#!/usr/bin/env python3
"""Measure how dark and how noisy a video is, and say honestly whether it can be saved.

Samples 2 frames per second with ffmpeg's signalstats and reports average
brightness (Y, 0-255 in 8-bit) and a noise estimate. Prints a verdict:
  OK         - leave it alone
  FIXABLE    - brighten + denoise will help; run with --fix OUT to write it
  RESHOOT    - so dark that brightening will mostly show grain; say so plainly

Usage: check_exposure.py INPUT [--fix OUTPUT]
"""
import argparse
import re
import subprocess


def stats(src):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", src, "-vf",
                        "fps=2,scale=640:-2,signalstats,metadata=print", "-an", "-f", "null", "-"],
                       capture_output=True, text=True)
    yavg = [float(x) for x in re.findall(r"lavfi.signalstats.YAVG=([\d.]+)", r.stderr)]
    ylow = [float(x) for x in re.findall(r"lavfi.signalstats.YLOW=([\d.]+)", r.stderr)]
    yhigh = [float(x) for x in re.findall(r"lavfi.signalstats.YHIGH=([\d.]+)", r.stderr)]
    # Noise: mean absolute difference between the frame and a blurred copy.
    r2 = subprocess.run(["ffmpeg", "-hide_banner", "-i", src, "-filter_complex",
                         "[0:v]fps=2,scale=640:-2,format=gray,split[a][b];[b]gblur=sigma=1.5[bb];"
                         "[a][bb]blend=all_mode=difference,signalstats,metadata=print", "-an", "-f", "null", "-"],
                        capture_output=True, text=True)
    noise = [float(x) for x in re.findall(r"lavfi.signalstats.YAVG=([\d.]+)", r2.stderr)]
    avg = lambda l: sum(l) / len(l) if l else 0
    # Relative to brightness, so a brightened copy is compared fairly (percent).
    return avg(yavg), avg(ylow), avg(yhigh), 100 * avg(noise) / max(avg(yavg), 1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("--fix")
    args = ap.parse_args()
    y, lo, hi, noise = stats(args.input)
    print(f"brightness {y:.0f}/255 (shadows {lo:.0f}, highlights {hi:.0f}), grain {noise:.1f}%")

    if y >= 70 and noise < 6:
        verdict = "OK"
    elif y >= 35:
        verdict = "FIXABLE"
    else:
        verdict = "RESHOOT"
    print("verdict:", verdict)
    if noise >= 15:
        print("Very grainy: denoising softens detail and some grain will remain. Say so honestly.")
    if verdict == "RESHOOT":
        print("Too dark to rescue well: brightening will lift grain with it. Recommend a reshoot "
              "facing a window or a lamp, and a lower ISO. I can still make a best-effort version.")
    if args.fix and verdict != "OK":
        gamma = min(1.8, max(1.0, 100 / max(y, 1)) ** 0.5)
        # Denoise before brightening (brightening lifts grain), harder for grainier footage.
        sp = min(12.0, max(2.0, noise * 0.4))
        vf = (f"hqdn3d={sp:.1f}:{sp * 0.75:.1f}:{sp * 1.5:.1f}:{sp * 1.5:.1f},"
              f"eq=gamma={gamma:.2f}:contrast=1.05:saturation=1.05")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", args.input, "-vf", vf, "-c:v", "libx264",
                        "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", args.fix],
                       check=True)
        y2, _, _, n2 = stats(args.fix)
        print(f"fixed -> {args.fix}: brightness {y:.0f} -> {y2:.0f}, grain {noise:.1f}% -> {n2:.1f}%")


if __name__ == "__main__":
    main()
