#!/usr/bin/env python3
"""Cut a video down to the keep ranges in cuts.json, at full quality.

Each kept range gets a tiny audio fade in/out (10 ms) so joins don't click.
Video is re-encoded once with x264 CRF 16 / preset slow (visually lossless);
audio as 48 kHz AAC 320k. Audio-only inputs (wav/m4a/mp3) also work.

Usage: apply_cuts.py INPUT cuts.json OUTPUT
"""
import json
import subprocess
import sys


def has_video(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=codec_type", "-of", "csv=p=0", path], capture_output=True, text=True)
    return "video" in out.stdout


def main():
    src, cuts, dst = sys.argv[1:4]
    keep = json.load(open(cuts))["keep"]
    video = has_video(src)
    parts, labels = [], []
    for i, (a, b) in enumerate(keep):
        d = b - a
        if video:
            parts.append(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS[v{i}]")
        parts.append(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,"
                     f"afade=t=in:d=0.01,afade=t=out:st={max(0, d - 0.01):.3f}:d=0.01[a{i}]")
        labels.append((f"[v{i}]" if video else "") + f"[a{i}]")
    n = len(keep)
    parts.append("".join(labels) + f"concat=n={n}:v={1 if video else 0}:a=1" + ("[v][a]" if video else "[a]"))
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", src, "-filter_complex", ";".join(parts)]
    if video:
        cmd += ["-map", "[v]", "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p",
                "-movflags", "+faststart"]
    cmd += ["-map", "[a]", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", dst]
    subprocess.run(cmd, check=True)
    print(f"{n} pieces joined -> {dst}")


if __name__ == "__main__":
    main()
