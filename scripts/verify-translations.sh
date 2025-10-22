#!/bin/bash

###############################################################################
# Phase 5 Translation Verification Script
# 
# This script automates testing of the translation system by:
# 1. Checking service health
# 2. Verifying translation database
# 3. Testing translation API endpoints
# 4. Validating translation quality
###############################################################################

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Base URLs
TRANSLATION_SERVICE_URL="http://localhost:3007"
API_BASE="${TRANSLATION_SERVICE_URL}/api/v1/translation"

echo -e "${BLUE}"
cat << 'EOF'
╔═══════════════════════════════════════════════════════════════════════════╗
║          Phase 5: Multi-Language Translation Verification                ║
╚═══════════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Function to run a test
run_test() {
    local test_name=$1
    local command=$2
    local expected=$3
    
    TESTS_RUN=$((TESTS_RUN + 1))
    echo -e "${YELLOW}[TEST $TESTS_RUN]${NC} $test_name"
    
    result=$(eval "$command" 2>&1)
    
    if echo "$result" | grep -q "$expected"; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo -e "${GREEN}✅ PASS${NC}"
        echo ""
        return 0
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo -e "${RED}❌ FAIL${NC}"
        echo -e "${RED}Expected: $expected${NC}"
        echo -e "${RED}Got: $result${NC}"
        echo ""
        return 1
    fi
}

# Function to test translation
test_translation() {
    local text=$1
    local target_lang=$2
    local expected=$3
    local test_name="Translate '$text' to $target_lang"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    echo -e "${YELLOW}[TEST $TESTS_RUN]${NC} $test_name"
    
    # Make API call
    response=$(curl -s -X POST "${API_BASE}/translate" \
        -H "Content-Type: application/json" \
        -d "{\"text\":\"$text\",\"targetLanguage\":\"$target_lang\"}")
    
    # Extract translatedText from JSON (handle both old and new API structures)
    translated=$(echo "$response" | jq -r '.data.translatedText // .translatedText // empty')
    
    if [ "$translated" = "$expected" ]; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo -e "${GREEN}✅ PASS${NC} → \"$translated\""
        echo ""
        return 0
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo -e "${RED}❌ FAIL${NC}"
        echo -e "${RED}Expected: \"$expected\"${NC}"
        echo -e "${RED}Got: \"$translated\"${NC}"
        echo ""
        return 1
    fi
}

###############################################################################
# PHASE 1: Service Health Checks
###############################################################################

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 1: Service Health Checks${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

run_test "Translation Service Health" \
    "curl -s ${TRANSLATION_SERVICE_URL}/api/v1/health | jq -r '.data.status // .status'" \
    "ok"

run_test "Translation Service Version" \
    "curl -s ${TRANSLATION_SERVICE_URL}/api/v1/health | jq -r '.data.service // .service'" \
    "translation-service"

###############################################################################
# PHASE 2: Database Verification
###############################################################################

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 2: Translation Database Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check total translations
echo -e "${YELLOW}[INFO]${NC} Checking total translations in database..."
total_translations=$(curl -s "${API_BASE}/translations?limit=1000" | jq '.translations | length')
echo -e "${BLUE}Total translations: $total_translations${NC}"
echo ""

# Check French translations
echo -e "${YELLOW}[INFO]${NC} Checking French translations..."
french_count=$(curl -s "${API_BASE}/translations?targetLanguage=fr&limit=1000" | jq '.translations | length')
echo -e "${BLUE}French translations: $french_count${NC}"
echo ""

# Check Spanish translations
echo -e "${YELLOW}[INFO]${NC} Checking Spanish translations..."
spanish_count=$(curl -s "${API_BASE}/translations?targetLanguage=es&limit=1000" | jq '.translations | length')
echo -e "${BLUE}Spanish translations: $spanish_count${NC}"
echo ""

# Verify no [FR] or [ES] prefixes
echo -e "${YELLOW}[INFO]${NC} Checking for incorrect [FR]/[ES] prefixes..."
incorrect_count=$(curl -s "${API_BASE}/translations?limit=1000" | jq '[.translations[] | select(.translatedText | startswith("[FR]") or startswith("[ES]"))] | length')

TESTS_RUN=$((TESTS_RUN + 1))
if [ "$incorrect_count" = "0" ]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC} No incorrect [FR]/[ES] prefixes found"
else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL${NC} Found $incorrect_count translations with [FR]/[ES] prefixes"
fi
echo ""

###############################################################################
# PHASE 3: French Translation Quality Tests
###############################################################################

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 3: French Translation Quality Tests${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Carrier Module Labels
test_translation "Carriers" "fr" "Transporteurs"
test_translation "Add Carrier" "fr" "Ajouter un transporteur"
test_translation "Manage your carrier partners" "fr" "Gérez vos partenaires transporteurs"

# Table Headers
test_translation "Name" "fr" "Nom"
test_translation "Phone" "fr" "Téléphone"
test_translation "Code" "fr" "Code"
test_translation "Status" "fr" "Statut"
test_translation "Actions" "fr" "Actions"

# Status Labels
test_translation "Active" "fr" "Actif"
test_translation "Inactive" "fr" "Inactif"

# Shared UI Components
test_translation "Sort by:" "fr" "Trier par :"
test_translation "Show:" "fr" "Afficher :"
test_translation "per page" "fr" "par page"
test_translation "Showing" "fr" "Affichage de"
test_translation "to" "fr" "à"
test_translation "of" "fr" "sur"
test_translation "results" "fr" "résultats"

# Action Labels
test_translation "View" "fr" "Voir"
test_translation "Edit" "fr" "Modifier"
test_translation "Delete" "fr" "Supprimer"
test_translation "Save" "fr" "Enregistrer"
test_translation "Cancel" "fr" "Annuler"

# Form Labels
test_translation "Contact Email" "fr" "E-mail de contact"
test_translation "Contact Phone" "fr" "Téléphone de contact"
test_translation "Description" "fr" "Description"

###############################################################################
# PHASE 4: Spanish Translation Quality Tests
###############################################################################

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 4: Spanish Translation Quality Tests${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Carrier Module Labels
test_translation "Carriers" "es" "Transportistas"
test_translation "Add Carrier" "es" "Agregar transportista"
test_translation "Manage your carrier partners" "es" "Gestione sus socios transportistas"

# Table Headers
test_translation "Name" "es" "Nombre"
test_translation "Phone" "es" "Teléfono"
test_translation "Code" "es" "Código"
test_translation "Status" "es" "Estado"
test_translation "Actions" "es" "Acciones"

# Status Labels
test_translation "Active" "es" "Activo"
test_translation "Inactive" "es" "Inactivo"

# Shared UI Components
test_translation "Sort by:" "es" "Ordenar por:"
test_translation "Show:" "es" "Mostrar:"
test_translation "per page" "es" "por página"
test_translation "Showing" "es" "Mostrando"
test_translation "to" "es" "a"
test_translation "of" "es" "de"
test_translation "results" "es" "resultados"

# Action Labels
test_translation "View" "es" "Ver"
test_translation "Edit" "es" "Editar"
test_translation "Delete" "es" "Eliminar"
test_translation "Save" "es" "Guardar"
test_translation "Cancel" "es" "Cancelar"

###############################################################################
# PHASE 5: Cache Performance Tests
###############################################################################

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 5: Cache Performance Tests${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test first call (miss)
echo -e "${YELLOW}[TEST]${NC} First translation call (cache miss expected)..."
start_time=$(date +%s%N)
response1=$(curl -s -X POST "${API_BASE}/translate" \
    -H "Content-Type: application/json" \
    -d '{"text":"Test Cache","targetLanguage":"fr"}')
end_time=$(date +%s%N)
duration1=$(( (end_time - start_time) / 1000000 ))
from_cache1=$(echo "$response1" | jq -r '.fromCache // false')

echo -e "${BLUE}First call duration: ${duration1}ms${NC}"
echo -e "${BLUE}From cache: $from_cache1${NC}"
echo ""

# Test second call (hit)
echo -e "${YELLOW}[TEST]${NC} Second translation call (cache hit expected)..."
start_time=$(date +%s%N)
response2=$(curl -s -X POST "${API_BASE}/translate" \
    -H "Content-Type: application/json" \
    -d '{"text":"Test Cache","targetLanguage":"fr"}')
end_time=$(date +%s%N)
duration2=$(( (end_time - start_time) / 1000000 ))
from_cache2=$(echo "$response2" | jq -r '.fromCache // false')

echo -e "${BLUE}Second call duration: ${duration2}ms${NC}"
echo -e "${BLUE}From cache: $from_cache2${NC}"
echo ""

# Verify cache is working
TESTS_RUN=$((TESTS_RUN + 1))
if [ "$from_cache2" = "true" ]; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}✅ PASS${NC} Cache is working (fromCache: true on second call)"
else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}❌ FAIL${NC} Cache not working (fromCache: $from_cache2 on second call)"
fi
echo ""

###############################################################################
# FINAL REPORT
###############################################################################

echo -e "${BLUE}"
cat << 'EOF'
╔═══════════════════════════════════════════════════════════════════════════╗
║                         Test Summary Report                               ║
╚═══════════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BLUE}Total Tests Run:    ${NC}$TESTS_RUN"
echo -e "${GREEN}Tests Passed:       ${NC}$TESTS_PASSED"
echo -e "${RED}Tests Failed:       ${NC}$TESTS_FAILED"
echo ""

# Calculate pass rate
if [ $TESTS_RUN -gt 0 ]; then
    pass_rate=$((TESTS_PASSED * 100 / TESTS_RUN))
    echo -e "${BLUE}Pass Rate:          ${NC}${pass_rate}%"
    echo ""
fi

# Database Statistics
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Translation Database Statistics${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Total Translations:     ${NC}$total_translations"
echo -e "${BLUE}French Translations:    ${NC}$french_count"
echo -e "${BLUE}Spanish Translations:   ${NC}$spanish_count"
echo -e "${BLUE}Incorrect Prefixes:     ${NC}$incorrect_count"
echo ""

# Performance Metrics
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Cache Performance Metrics${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}First Call (Miss):      ${NC}${duration1}ms"
echo -e "${BLUE}Second Call (Hit):      ${NC}${duration2}ms"
if [ $duration1 -gt 0 ]; then
    speedup=$((duration1 / duration2))
    echo -e "${BLUE}Cache Speedup:          ${NC}${speedup}x faster"
fi
echo ""

# Final Status
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}"
    cat << 'EOF'
    ╔═══════════════════════════════════════════════════════════════════════╗
    ║                ✅ ALL TESTS PASSED - READY FOR PHASE 5                ║
    ╚═══════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo -e "${GREEN}✨ Translation system is working perfectly!${NC}"
    echo -e "${GREEN}✨ Ready for browser testing and user verification.${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Start React Admin: cd react-admin && npm run dev"
    echo "2. Open browser: http://localhost:5173"
    echo "3. Follow PHASE5-MULTI-LANGUAGE-TESTING-GUIDE.md"
    echo "4. Test language switching (EN → FR → ES)"
    echo "5. Verify all 106 labels translate correctly"
    exit 0
else
    echo -e "${RED}"
    cat << 'EOF'
    ╔═══════════════════════════════════════════════════════════════════════╗
    ║                  ❌ SOME TESTS FAILED - REVIEW NEEDED                 ║
    ╚═══════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo -e "${RED}⚠️  Please review the failed tests above.${NC}"
    echo -e "${RED}⚠️  Fix issues before proceeding to Phase 5.${NC}"
    echo ""
    echo -e "${BLUE}Common Issues:${NC}"
    echo "• Translation Service not running → Check docker-compose"
    echo "• Missing translations → Run seeding script"
    echo "• [FR]/[ES] prefixes → Run fix-french-spanish-translations.js"
    echo "• Cache not working → Check Translation Service configuration"
    exit 1
fi
