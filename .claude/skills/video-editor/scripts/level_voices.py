#!/usr/bin/env python3
"""Level each voice separately so an AI voice and a real voice sit at the same loudness.

Give it the time ranges where each voice speaks (from the transcript, and
confirmed with the person), e.g. the AI voice from 0-4.2 s and 12.0-15.5 s:

  level_voices.py INPUT OUTPUT --ai 0-4.2,12-15.5 [--target -14]

Every range listed under --ai is measured and normalised on its own, everything
else (the real voice) is normalised on its own, then they are put back in
place. Target is integrated loudness in LUFS: -14 for Instagram/TikTok/YouTube.
If the two voices are on separate files/tracks, run it on each with no --ai
(whole file = one voice) and mix afterwards.
"""
import argparse
import json
import subprocess


def measure(src, a=None, b=None):
    flt = (f"atrim={a}:{b}," if a is not None else "") + "loudnorm=print_format=json"
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", src, "-af", flt, "-f", "null", "-"],
                       capture_output=True, text=True)
    j = r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1]
    return json.loads(j)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--ai", default="", help="comma list of start-end seconds spoken by the AI voice")
    ap.add_argument("--target", type=float, default=-14.0)
    args = ap.parse_args()

    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
                                "csv=p=0", args.input], capture_output=True, text=True).stdout)
    ai = sorted(tuple(map(float, r.split("-"))) for r in args.ai.split(",") if r)
    # Alternate real/AI ranges covering the whole file.
    ranges, t = [], 0.0
    for a, b in ai:
        if a > t:
            ranges.append((t, a, "real"))
        ranges.append((a, b, "ai"))
        t = b
    if t < dur:
        ranges.append((t, dur, "real"))

    # One gain per voice, measured over all of that voice's speech.
    gains = {}
    for voice in ("real", "ai"):
        rs = [(a, b) for a, b, v in ranges if v == voice]
        if not rs:
            continue
        louds = [float(measure(args.input, a, b)["input_i"]) for a, b in rs if b - a > 0.4]
        louds = [l for l in louds if l > -70]
        if louds:
            gains[voice] = args.target - sum(louds) / len(louds)
            print(f"{voice} voice: measured {sum(louds) / len(louds):.1f} LUFS -> gain {gains[voice]:+.1f} dB")

    expr = "+".join(f"between(t,{a},{b})*{10 ** (gains.get(v, 0) / 20):.4f}" for a, b, v in ranges) or "1"
    af = f"volume='{expr}':eval=frame,alimiter=limit=0.89"
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", args.input, "-af", af, "-c:a", "aac", "-b:a", "320k"]
    has_v = "video" in subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                       "stream=codec_type", "-of", "csv=p=0", args.input],
                                      capture_output=True, text=True).stdout
    if has_v:
        cmd += ["-c:v", "copy"]
    subprocess.run(cmd + [args.output], check=True)
    print("->", args.output)


if __name__ == "__main__":
    main()
