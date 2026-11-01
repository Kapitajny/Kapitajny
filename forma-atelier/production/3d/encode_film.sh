#!/bin/bash
# Montaż filmu do hero: 12 kl./s -> 24 kl./s (interpolacja ruchu), 1080p, przenikania 1 s,
# pętla bez szwu (koniec przenika w początek), MP4 (H.264) + WebM (VP9) + lżejsza wersja 720p.
# Użycie: ./encode_film.sh <katalog_klatek> <katalog_wyjściowy> [ujęcia...]
set -euo pipefail
IN=${1:-out/film}
OUT=${2:-out/video}
TAKES=${3:-"A B C D"}
XF=1          # długość przenikania [s]
THREADS=${THREADS:-4}
mkdir -p "$OUT/tmp"

dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }

# 1) każde ujęcie: interpolacja ruchu do 24 kl./s i skalowanie lanczos do 1920x1080
for t in $TAKES; do
  ffmpeg -hide_banner -loglevel error -y -framerate 12 -i "$IN/${t}_%04d.png" \
    -vf "minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=none,scale=1920:1080:flags=lanczos,format=yuv444p" \
    -threads "$THREADS" -c:v ffv1 "$OUT/tmp/$t.mkv"
  echo "take $t: $(dur "$OUT/tmp/$t.mkv") s"
done

# 2) sklejenie ujęć przenikaniami
set -- $TAKES
cp "$OUT/tmp/$1.mkv" "$OUT/tmp/seq.mkv"
shift
for t in "$@"; do
  off=$(python3 -c "print(round($(dur "$OUT/tmp/seq.mkv") - $XF, 4))")
  ffmpeg -hide_banner -loglevel error -y -i "$OUT/tmp/seq.mkv" -i "$OUT/tmp/$t.mkv" \
    -filter_complex "[0:v][1:v]xfade=transition=fade:duration=$XF:offset=$off,format=yuv444p" \
    -threads "$THREADS" -c:v ffv1 "$OUT/tmp/seq2.mkv"
  mv "$OUT/tmp/seq2.mkv" "$OUT/tmp/seq.mkv"
done
TOTAL=$(dur "$OUT/tmp/seq.mkv")
echo "sequence: $TOTAL s"

# 3) pętla: zaczynamy od 1 s, a ostatnia sekunda przenika w pierwsze klatki -> ostatnia klatka = pierwsza
LOOPOFF=$(python3 -c "print(round($TOTAL - $XF - $XF, 4))")
ffmpeg -hide_banner -loglevel error -y -i "$OUT/tmp/seq.mkv" -filter_complex \
  "[0:v]split[a][b];[a]trim=start=$XF,setpts=PTS-STARTPTS[main];[b]trim=start=0:end=$XF,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=$XF:offset=$LOOPOFF,format=yuv444p" \
  -threads "$THREADS" -c:v ffv1 "$OUT/tmp/loop.mkv"
echo "loop: $(dur "$OUT/tmp/loop.mkv") s"

# 4) kodowanie: delikatna korekta (kontrast/nasycenie), bez dźwięku, faststart dla strumieniowania
GRADE="eq=contrast=1.03:saturation=0.96,format=yuv420p"
ffmpeg -hide_banner -loglevel error -y -i "$OUT/tmp/loop.mkv" -vf "$GRADE" -an \
  -c:v libx264 -preset slow -tune film -crf 21 -profile:v high -level 4.1 -g 48 -movflags +faststart \
  "$OUT/forma-atelier-hero-1080.mp4"
ffmpeg -hide_banner -loglevel error -y -i "$OUT/tmp/loop.mkv" -vf "$GRADE" -an \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good -cpu-used 2 -g 48 \
  "$OUT/forma-atelier-hero-1080.webm"
ffmpeg -hide_banner -loglevel error -y -i "$OUT/tmp/loop.mkv" -vf "scale=1280:720:flags=lanczos,$GRADE" -an \
  -c:v libx264 -preset slow -tune film -crf 24 -profile:v high -level 4.0 -g 48 -movflags +faststart \
  "$OUT/forma-atelier-hero-720.mp4"
ls -la "$OUT"/*.mp4 "$OUT"/*.webm
ffmpeg -hide_banner -loglevel error -y -i "$OUT/tmp/loop.mkv" -vf "scale=1280:720:flags=lanczos,$GRADE" -an \
  -c:v libvpx-vp9 -b:v 0 -crf 37 -row-mt 1 -deadline good -cpu-used 2 -g 48 \
  "$OUT/forma-atelier-hero-720.webm"
ls -la "$OUT"/*.webm
