#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

while IFS= read -r image; do
  image="${image#\"}"
  image="${image%\"}"
  image="${image#/}"
  source_file="$project_root/static/$image"
  [[ -f "$source_file" ]] || continue

  relative="${image#optimized/}"
  relative="${relative%.*}.jpg"
  output_file="$project_root/static/social/$relative"
  mkdir -p "$(dirname "$output_file")"

  if [[ ! -f "$output_file" || "$source_file" -nt "$output_file" ]]; then
    convert "$source_file" -auto-orient -resize '1200x627^' -gravity center -extent 1200x627 \
      -strip -sampling-factor 4:2:0 -quality 84 "$output_file"
  fi
done < <(sed -n 's/^image:[[:space:]]*//p' "$project_root"/content/**/*.md "$project_root"/content/*.md 2>/dev/null | sort -u)
