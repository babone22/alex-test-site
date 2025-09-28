#!/bin/bash

# Script simplu pentru upload imagini pe Cloudinary folosind curl
# Nu necesită cloudinary-cli

echo "🚀 Upload imagini pe Cloudinary folosind API..."

# Configurează Cloudinary cu datele tale
CLOUD_NAME="dsrsozscg"
API_KEY="942191844276884"
API_SECRET="kxFe5bJ1rH1nAQ-hj0ZZYYPfcVU"

echo "📁 Upload imagini din src/assets/images/..."

# Contor pentru progres
count=0
total=$(find src/assets/images/ -name "*.jpg" | wc -l)
echo "📊 Total imagini de upload: $total"

# Upload primele 10 imagini pentru test
for file in src/assets/images/*.jpg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        count=$((count + 1))
        
        echo "⬆️  [$count/$total] Upload: $filename"
        
        # Generează signature pentru upload semnat
        timestamp=$(date +%s)
        signature_string="public_id=${filename%.*}&timestamp=$timestamp$API_SECRET"
        signature=$(echo -n "$signature_string" | shasum -a 1 | cut -d' ' -f1)
        
        # Upload folosind curl și API-ul Cloudinary cu signature
        response=$(curl -s -X POST \
            "https://api.cloudinary.com/v1_1/$CLOUD_NAME/image/upload" \
            -F "file=@$file" \
            -F "public_id=${filename%.*}" \
            -F "api_key=$API_KEY" \
            -F "timestamp=$timestamp" \
            -F "signature=$signature")
        
        # Verifică dacă upload-ul a fost cu succes
        if echo "$response" | grep -q '"public_id"'; then
            echo "✅ Succes: $filename"
        else
            echo "❌ Eroare: $filename"
            echo "Response: $response"
        fi
        
        # Pauză mică între upload-uri
        sleep 1
        
        # Upload doar primele 10 pentru test
        if [ $count -eq 10 ]; then
            echo "🛑 Upload oprit după 10 imagini pentru test"
            break
        fi
    fi
done

echo "✅ Upload complet!"
echo "🔗 Accesează: https://cloudinary.com/console/media_library/folders/products"
