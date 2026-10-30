#!/usr/bin/env bash
# Final pass on a rendered video: loudness to -14 LUFS (Instagram, TikTok and
# YouTube all target about this), AAC 320k at 48 kHz, faststart for upload.
# The picture is copied untouched (no second compression).
# Usage: finish.sh IN.mp4 OUT.mp4
set -euo pipefail
in="$1"; out="$2"
[ "$in" != "$out" ] || { echo "OUT must differ from IN" >&2; exit 1; }
ffmpeg -y -v error -i "$in" -map 0:v -map 0:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.0:LRA=11" -ar 48000 -c:a aac -b:a 320k -movflags +faststart "$out"
ffmpeg -hide_banner -i "$out" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
