#!/bin/bash

# Script pentru upload imagini pe Cloudinary
# Instalează: npm install -g cloudinary-cli

echo "🚀 Upload imagini pe Cloudinary..."

# Verifică dacă cloudinary-cli este instalat
if ! command -v cloudinary &> /dev/null; then
    echo "❌ cloudinary-cli nu este instalat!"
    echo "Instalează cu: npm install -g cloudinary-cli"
    exit 1
fi

# Configurează Cloudinary cu datele tale
CLOUD_NAME="dsrsozscg"
API_KEY="942191844276884"
API_SECRET="kxFe5bJ1rH1nAQ-hj0ZZYYPfcVU"

echo "📁 Upload imagini din src/assets/images/..."

# Upload toate imaginile JPG
for file in src/assets/images/*.jpg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "⬆️  Upload: $filename"
        
        # Upload în folderul 'products' pe Cloudinary
        cloudinary upload "$file" \
            --cloud-name="$CLOUD_NAME" \
            --api-key="$API_KEY" \
            --api-secret="$API_SECRET" \
            --folder="products" \
            --public-id="${filename%.*}" \
            --overwrite=true
    fi
done

echo "✅ Upload complet!"
echo "🔗 Accesează dashboard-ul Cloudinary pentru a vedea imaginile"
