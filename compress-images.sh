#!/bin/bash

# Script pentru compresie imagini
# Instalează: brew install imagemagick

echo "Compresie imagini pentru web..."

# Creează directorul pentru imagini comprimate
mkdir -p src/assets/images-compressed

# Comprimă toate imaginile JPG
for file in src/assets/images/*.jpg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "Comprimă: $filename"
        
        # Comprimă la 80% calitate și redimensionează la max 1200px
        convert "$file" -quality 80 -resize '1200x1200>' "src/assets/images-compressed/$filename"
    fi
done

echo "Compresie completă! Verifică dimensiunea:"
du -sh src/assets/images-compressed/
