#!/usr/bin/env bash
set -euo pipefail

source_root="${1:-media-originals/img}"
target_root="${2:-static/optimized/img}"

if [[ ! -d "$source_root" ]]; then
  printf 'No existe el directorio de originales: %s\n' "$source_root" >&2
  exit 1
fi

mkdir -p "$target_root"

find "$source_root" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.gif' \) -print0 |
while IFS= read -r -d '' source; do
  relative="${source#"$source_root"/}"
  extension="${relative##*.}"
  stem="${relative%.*}"
  image_target="$target_root/$stem.webp"
  mkdir -p "$(dirname "$image_target")"

  if [[ ! -s "$image_target" || "$source" -nt "$image_target" ]]; then
    printf 'WEBP %s\n' "$relative"
    if [[ "${extension,,}" == "gif" ]]; then
      convert "${source}[0]" -auto-orient -resize '1600x1600>' -strip -quality 78 "$image_target"
    else
      convert "$source" -auto-orient -resize '1600x1600>' -strip -quality 78 "$image_target"
    fi
  fi

  if [[ "${extension,,}" == "gif" ]]; then
    video_target="$target_root/$stem.mp4"
    if [[ ! -s "$video_target" || "$source" -nt "$video_target" ]]; then
      printf 'MP4  %s\n' "$relative"
      ffmpeg -nostdin -v error -y -i "$source" -an -vf "fps=20,scale='trunc(min(1280,iw)/2)*2':-2:flags=lanczos" -c:v libx264 -preset medium -crf 28 -pix_fmt yuv420p -movflags +faststart "$video_target"
    fi
  fi
done

printf 'Optimización completada en %s\n' "$target_root"
