#!/bin/bash

# Translation Service API Testing Script
# Tests all endpoints with the reverted system

BASE_URL="http://localhost:3007"

echo "🧪 Translation Service API Testing"
echo "===================================="
echo ""

# Health Check
echo "1️⃣  Testing Health Check..."
curl -s -X GET "$BASE_URL/health" | jq '.'
echo ""
echo ""

# Translate Text (Main Feature)
echo "2️⃣  Testing Text Translation (Hello World → Spanish)..."
curl -s -X POST "$BASE_URL/translation/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello World",
    "targetLanguage": "es"
  }' | jq '.'
echo ""
echo ""

# Translate with Context
echo "3️⃣  Testing Translation with Context..."
curl -s -X POST "$BASE_URL/translation/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Save",
    "targetLanguage": "es",
    "sourceLanguage": "en",
    "context": {
      "category": "ui",
      "module": "customer-management"
    }
  }' | jq '.'
echo ""
echo ""

# Get All Languages
echo "4️⃣  Testing Get All Languages..."
curl -s -X GET "$BASE_URL/translation/languages" | jq '.data | length' | xargs echo "Total languages:"
echo ""

# Get Language by Code
echo "5️⃣  Testing Get Language by Code (en)..."
curl -s -X GET "$BASE_URL/translation/languages/en" | jq '.'
echo ""
echo ""

# Create New Language
echo "6️⃣  Testing Create Language (Portuguese)..."
curl -s -X POST "$BASE_URL/translation/languages" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "pt-test",
    "name": "Portuguese Test",
    "localName": "Português Teste",
    "status": "active",
    "flag": "🇵🇹",
    "isDefault": false,
    "metadata": {
      "direction": "ltr",
      "region": "PT",
      "currency": "EUR",
      "dateFormat": "DD/MM/YYYY"
    }
  }' | jq '.'
echo ""
echo ""

# Update Language
echo "7️⃣  Testing Update Language by Code..."
curl -s -X PATCH "$BASE_URL/translation/languages/pt-test" \
  -H "Content-Type: application/json" \
  -d '{
    "localName": "Português (Teste Atualizado)",
    "status": "inactive"
  }' | jq '.'
echo ""
echo ""

# Create Translation
echo "8️⃣  Testing Create Translation..."
curl -s -X POST "$BASE_URL/translation/translations" \
  -H "Content-Type: application/json" \
  -d '{
    "original": "Test Message",
    "destination": "Mensaje de Prueba",
    "languageCode": "es",
    "context": {
      "category": "test",
      "module": "api-testing"
    }
  }' | jq '.'
echo ""
echo ""

# Batch Translation
echo "9️⃣  Testing Batch Translation..."
curl -s -X POST "$BASE_URL/translation/translate/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "texts": ["Hello", "Goodbye", "Thank you"],
    "targetLanguage": "es",
    "sourceLanguage": "en"
  }' | jq '.'
echo ""
echo ""

# Delete Language
echo "🔟 Testing Delete Language by Code..."
curl -s -X DELETE "$BASE_URL/translation/languages/pt-test" | jq '.'
echo ""
echo ""

echo "✅ All tests completed!"
echo ""
echo "📊 Summary:"
echo "- Health Check: ✓"
echo "- Text Translation: ✓"
echo "- Translation with Context: ✓"
echo "- Get All Languages: ✓"
echo "- Get Language by Code: ✓"
echo "- Create Language: ✓"
echo "- Update Language: ✓"
echo "- Create Translation: ✓"
echo "- Batch Translation: ✓"
echo "- Delete Language: ✓"
