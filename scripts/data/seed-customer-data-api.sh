#!/bin/bash

# ===========================================
# CUSTOMER DATA SEEDING SCRIPT (API VERSION)
# ===========================================
# This script seeds 500 customer records via the
# customer service API for testing purposes.

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CUSTOMER_SERVICE_URL="http://localhost:3004"
RECORD_COUNT=500
BATCH_SIZE=10
DELAY_BETWEEN_BATCHES=1

# Function to print colored output
print_status() {
    echo -e "${BLUE}[SEED]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if customer service is running
check_customer_service() {
    print_status "Checking customer service status..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -s -f "$CUSTOMER_SERVICE_URL/api/v1/health" > /dev/null 2>&1; then
            print_success "Customer service is running and healthy"
            return 0
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            print_error "Customer service is not responding after $max_attempts attempts"
            print_error "Please ensure the customer service is running:"
            print_error "docker-compose -f docker-compose.hybrid.yml up -d customer-service"
            exit 1
        fi
        
        print_status "Waiting for customer service... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
}

# Function to generate random customer data
generate_customer_json() {
    local customer_id=$1
    
    # Arrays for random data generation
    local companies=(
        "Acme Corporation" "Tech Solutions Inc" "Global Enterprises" "Innovation Labs"
        "Digital Dynamics" "Future Systems" "Smart Technologies" "NextGen Solutions"
        "Advanced Analytics" "Cloud Computing Co" "Data Insights Ltd" "AI Innovations"
        "Blockchain Systems" "IoT Solutions" "Machine Learning Corp" "Quantum Computing"
        "Robotics Inc" "Automation Systems" "Cyber Security Co" "Network Solutions"
        "Software Development" "Web Services Inc" "Mobile Apps Ltd" "E-commerce Solutions"
        "Digital Marketing" "Content Creation" "Social Media Co" "Online Platforms"
        "Virtual Reality" "Augmented Reality" "Gaming Studios" "Entertainment Media"
        "Financial Services" "Investment Group" "Banking Solutions" "Insurance Corp"
        "Healthcare Systems" "Medical Devices" "Pharmaceuticals" "Biotech Research"
        "Manufacturing Co" "Industrial Solutions" "Supply Chain" "Logistics Systems"
        "Retail Operations" "Wholesale Trading" "Distribution Co" "Import Export"
        "Real Estate" "Property Management" "Construction Co" "Architecture Firm"
        "Consulting Services" "Management Group" "Business Solutions" "Strategic Planning"
    )
    
    local first_names=(
        "John" "Jane" "Michael" "Sarah" "David" "Lisa" "Robert" "Jennifer"
        "William" "Jessica" "James" "Ashley" "Christopher" "Amanda" "Daniel" "Stephanie"
        "Matthew" "Melissa" "Anthony" "Nicole" "Mark" "Elizabeth" "Donald" "Helen"
        "Steven" "Deborah" "Paul" "Dorothy" "Andrew" "Amy" "Joshua" "Angela"
        "Kenneth" "Brenda" "Kevin" "Emma" "Brian" "Olivia" "George" "Cynthia"
        "Timothy" "Marie" "Ronald" "Janet" "Jason" "Catherine" "Edward" "Frances"
        "Jeffrey" "Christine" "Ryan" "Samantha" "Jacob" "Debra" "Gary" "Rachel"
        "Nicholas" "Carolyn" "Eric" "Janet" "Jonathan" "Virginia" "Stephen" "Maria"
        "Larry" "Heather" "Justin" "Diane" "Scott" "Julie" "Brandon" "Joyce"
        "Benjamin" "Victoria" "Samuel" "Kelly" "Gregory" "Christina" "Alexander" "Joan"
    )
    
    local last_names=(
        "Smith" "Johnson" "Williams" "Brown" "Jones" "Garcia" "Miller" "Davis"
        "Rodriguez" "Martinez" "Hernandez" "Lopez" "Gonzalez" "Wilson" "Anderson" "Thomas"
        "Taylor" "Moore" "Jackson" "Martin" "Lee" "Perez" "Thompson" "White"
        "Harris" "Sanchez" "Clark" "Ramirez" "Lewis" "Robinson" "Walker" "Young"
        "Allen" "King" "Wright" "Scott" "Torres" "Nguyen" "Hill" "Flores"
        "Green" "Adams" "Nelson" "Baker" "Hall" "Rivera" "Campbell" "Mitchell"
        "Carter" "Roberts" "Gomez" "Phillips" "Evans" "Turner" "Diaz" "Parker"
        "Cruz" "Edwards" "Collins" "Reyes" "Stewart" "Morris" "Morales" "Murphy"
        "Cook" "Rogers" "Gutierrez" "Ortiz" "Morgan" "Cooper" "Peterson" "Bailey"
        "Reed" "Kelly" "Howard" "Ramos" "Kim" "Cox" "Ward" "Richardson"
    )
    
    local cities=(
        "New York" "Los Angeles" "Chicago" "Houston" "Phoenix" "Philadelphia" "San Antonio" "San Diego"
        "Dallas" "San Jose" "Austin" "Jacksonville" "Fort Worth" "Columbus" "Charlotte" "San Francisco"
        "Indianapolis" "Seattle" "Denver" "Washington" "Boston" "El Paso" "Nashville" "Detroit"
        "Oklahoma City" "Portland" "Las Vegas" "Memphis" "Louisville" "Baltimore" "Milwaukee" "Albuquerque"
        "Tucson" "Fresno" "Sacramento" "Mesa" "Kansas City" "Atlanta" "Long Beach" "Colorado Springs"
        "Raleigh" "Miami" "Virginia Beach" "Omaha" "Oakland" "Minneapolis" "Tulsa" "Arlington"
        "Tampa" "New Orleans" "Wichita" "Cleveland" "Bakersfield" "Aurora" "Anaheim" "Honolulu"
        "Santa Ana" "Corpus Christi" "Riverside" "Lexington" "Stockton" "Henderson" "Saint Paul" "St. Louis"
        "Milwaukee" "Columbus" "Charlotte" "Fort Worth" "El Paso" "Seattle" "Denver" "Washington"
    )
    
    local states=(
        "AL" "AK" "AZ" "AR" "CA" "CO" "CT" "DE" "FL" "GA" "HI" "ID" "IL" "IN" "IA"
        "KS" "KY" "LA" "ME" "MD" "MA" "MI" "MN" "MS" "MO" "MT" "NE" "NV" "NH" "NJ"
        "NM" "NY" "NC" "ND" "OH" "OK" "OR" "PA" "RI" "SC" "SD" "TN" "TX" "UT" "VT"
        "VA" "WA" "WV" "WI" "WY"
    )
    
    local customer_types=("individual" "business" "enterprise")
    local statuses=("active" "inactive" "suspended")
    
    # Generate random data
    local company_name="${companies[$((RANDOM % ${#companies[@]}))]}"
    local first_name="${first_names[$((RANDOM % ${#first_names[@]}))]}"
    local last_name="${last_names[$((RANDOM % ${#last_names[@]}))]}"
    local contact_person="$first_name $last_name"
    local email="$(echo "${first_name,,}.${last_name,,}@${company_name,,}" | tr ' ' '-').com"
    local phone="+1-555-$(printf "%03d" $((RANDOM % 1000)))-$(printf "%04d" $((RANDOM % 10000)))"
    local city="${cities[$((RANDOM % ${#cities[@]}))]}"
    local state="${states[$((RANDOM % ${#states[@]}))]}"
    local zip_code="$(printf "%05d" $((RANDOM % 100000)))"
    local street_number=$((RANDOM % 9999 + 1))
    local street_name="${last_names[$((RANDOM % ${#last_names[@]}))]}"
    local address_street="$street_number ${street_name} St"
    local customer_type="${customer_types[$((RANDOM % ${#customer_types[@]}))]}"
    local status="${statuses[$((RANDOM % ${#statuses[@]}))]}"
    
    # Generate user_id (assuming users exist from 1 to 100)
    local user_id=$((RANDOM % 100 + 1))
    
    # Generate notes (sometimes empty, sometimes with content)
    local notes=""
    if [[ $((RANDOM % 4)) -eq 0 ]]; then
        local note_templates=(
            "Regular customer with good payment history"
            "Prefers email communication"
            "High-value customer requiring special attention"
            "New customer, needs onboarding support"
            "Seasonal customer, active during holidays"
            "Enterprise customer with multiple locations"
            "Requires technical support frequently"
            "Long-term customer, very satisfied"
        )
        notes="${note_templates[$((RANDOM % ${#note_templates[@]}))]}"
    fi
    
    # Create JSON object
    cat << EOF
{
  "userId": $user_id,
  "companyName": "$company_name",
  "contactPerson": "$contact_person",
  "email": "$email",
  "phone": "$phone",
  "address": {
    "street": "$address_street",
    "city": "$city",
    "state": "$state",
    "zipCode": "$zip_code",
    "country": "USA"
  },
  "customerType": "$customer_type",
  "status": "$status",
  "notes": "$notes"
}
EOF
}

# Function to create customer via API
create_customer_via_api() {
    local customer_data="$1"
    
    local response=$(curl -s -w "%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$customer_data" \
        "$CUSTOMER_SERVICE_URL/api/v1/customers" 2>/dev/null)
    
    local http_code="${response: -3}"
    local response_body="${response%???}"
    
    if [[ "$http_code" -eq 201 ]]; then
        return 0
    else
        print_error "Failed to create customer. HTTP Code: $http_code"
        print_error "Response: $response_body"
        return 1
    fi
}

# Function to seed customer data via API
seed_customer_data_via_api() {
    print_status "Seeding $RECORD_COUNT customer records via API..."
    
    local success_count=0
    local failure_count=0
    local batch_count=0
    
    for ((i=1; i<=RECORD_COUNT; i++)); do
        # Generate customer data
        local customer_data=$(generate_customer_json $i)
        
        # Create customer via API
        if create_customer_via_api "$customer_data"; then
            ((success_count++))
        else
            ((failure_count++))
        fi
        
        # Batch processing with delay
        if [[ $((i % BATCH_SIZE)) -eq 0 ]]; then
            ((batch_count++))
            print_status "Processed batch $batch_count ($i/$RECORD_COUNT records)..."
            sleep $DELAY_BETWEEN_BATCHES
        fi
        
        # Show progress every 50 records
        if [[ $((i % 50)) -eq 0 ]]; then
            print_status "Progress: $i/$RECORD_COUNT records processed (Success: $success_count, Failed: $failure_count)"
        fi
    done
    
    print_success "API seeding completed: $success_count successful, $failure_count failed"
    
    if [[ $failure_count -gt 0 ]]; then
        print_warning "Some records failed to create. This might be due to validation errors or service issues."
    fi
}

# Function to verify seeded data via API
verify_seeded_data_via_api() {
    print_status "Verifying seeded data via API..."
    
    # Get customers from API
    local api_response=$(curl -s "$CUSTOMER_SERVICE_URL/api/v1/customers" || echo "failed")
    
    if [[ "$api_response" == "failed" ]]; then
        print_error "Failed to retrieve customers from API"
        return 1
    fi
    
    # Extract total count from response (assuming pagination)
    local total_count=$(echo "$api_response" | grep -o '"total":[0-9]*' | cut -d: -f2 || echo "0")
    
    if [[ "$total_count" -gt 0 ]]; then
        print_success "API verification passed: $total_count customer records found"
    else
        print_warning "API verification: Could not determine total count (might be pagination issue)"
    fi
    
    # Show sample records
    print_status "Sample customer records from API:"
    echo "$api_response" | head -c 500
    echo "..."
}

# Function to display summary
display_summary() {
    print_success "Customer Data Seeding Complete!"
    echo
    echo "=========================================="
    echo "SEEDING SUMMARY"
    echo "=========================================="
    echo
    echo "✅ Records seeded: $RECORD_COUNT"
    echo "✅ Method: API calls"
    echo "✅ Service: $CUSTOMER_SERVICE_URL"
    echo "✅ Batch size: $BATCH_SIZE"
    echo "✅ Delay between batches: ${DELAY_BETWEEN_BATCHES}s"
    echo
    echo "=========================================="
    echo "USEFUL COMMANDS"
    echo "=========================================="
    echo
    echo "📊 View all customers:"
    echo "   curl $CUSTOMER_SERVICE_URL/api/v1/customers"
    echo
    echo "🔍 Get specific customer:"
    echo "   curl $CUSTOMER_SERVICE_URL/api/v1/customers/1"
    echo
    echo "📈 Check customer count:"
    echo "   curl -s $CUSTOMER_SERVICE_URL/api/v1/customers | grep -o '\"total\":[0-9]*'"
    echo
    echo "🗑️  Delete all customers (if API supports it):"
    echo "   # Note: This depends on your API implementation"
    echo
}

# Main execution
main() {
    echo "=========================================="
    echo "🌱 CUSTOMER DATA SEEDING (API VERSION)"
    echo "=========================================="
    echo
    
    check_customer_service
    seed_customer_data_via_api
    verify_seeded_data_via_api
    display_summary
    
    print_success "Customer data seeding completed successfully!"
}

# Run main function
main "$@"
