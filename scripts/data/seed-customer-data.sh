#!/bin/bash

# ===========================================
# CUSTOMER DATA SEEDING SCRIPT
# ===========================================
# This script seeds 500 customer records into the
# customer service database for testing purposes.

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CUSTOMER_SERVICE_URL="http://localhost:3004"
CUSTOMER_DB_HOST="localhost"
CUSTOMER_DB_PORT="3309"
CUSTOMER_DB_NAME="customer_service_db"
CUSTOMER_DB_USER="customer_user"
CUSTOMER_DB_PASSWORD="customer_password"
RECORD_COUNT=500

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

# Function to check if Docker is running
check_docker() {
    print_status "Checking Docker status..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
    print_success "Docker is running"
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

# Function to check if customer database is accessible
check_customer_database() {
    print_status "Checking customer database connectivity..."
    
    if docker exec southern-martin-customer-service-db mysql -u "$CUSTOMER_DB_USER" -p"$CUSTOMER_DB_PASSWORD" -e "SELECT 1;" "$CUSTOMER_DB_NAME" > /dev/null 2>&1; then
        print_success "Customer database is accessible"
    else
        print_error "Customer database is not accessible"
        print_error "Please ensure the customer service database is running"
        exit 1
    fi
}

# Function to create customers table if it doesn't exist
create_customers_table() {
    print_status "Creating customers table if it doesn't exist..."
    
    local create_table_sql="
    CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        email VARCHAR(255) NOT NULL UNIQUE,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        isActive TINYINT NOT NULL DEFAULT 1,
        dateOfBirth DATE,
        address JSON,
        preferences JSON,
        INDEX idx_email (email),
        INDEX idx_firstName (firstName),
        INDEX idx_lastName (lastName),
        INDEX idx_isActive (isActive),
        INDEX idx_createdAt (createdAt)
    );"
    
    if docker exec southern-martin-customer-service-db mysql -u "$CUSTOMER_DB_USER" -p"$CUSTOMER_DB_PASSWORD" -e "$create_table_sql" "$CUSTOMER_DB_NAME"; then
        print_success "Customers table created/verified"
    else
        print_error "Failed to create customers table"
        exit 1
    fi
}

# Function to generate random customer data
generate_customer_data() {
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
    local email="$(echo "${first_name}.${last_name}@${company_name}" | tr '[:upper:]' '[:lower:]' | tr ' ' '-').com"
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
    
    # Generate registration date (random date within last 2 years)
    local days_ago=$((RANDOM % 730))
    local registration_date=$(date -v-${days_ago}d '+%Y-%m-%d %H:%M:%S')
    
    # Generate last contact date (random date within last 6 months, or NULL)
    local last_contact_date="NULL"
    if [[ $((RANDOM % 3)) -eq 0 ]]; then
        local contact_days_ago=$((RANDOM % 180))
        last_contact_date="'$(date -v-${contact_days_ago}d '+%Y-%m-%d %H:%M:%S')'"
    fi
    
    # Generate notes (sometimes empty, sometimes with content)
    local notes="NULL"
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
        local note="${note_templates[$((RANDOM % ${#note_templates[@]}))]}"
        notes="'$note'"
    fi
    
    # Create JSON address object
    local address_json="{\"street\": \"$address_street\", \"city\": \"$city\", \"state\": \"$state\", \"zipCode\": \"$zip_code\", \"country\": \"USA\"}"
    
    # Create JSON preferences object
    local preferences_json="{\"company\": \"$company_name\", \"industry\": \"Technology\", \"newsletter\": true, \"preferredContact\": \"email\", \"customerType\": \"$customer_type\", \"status\": \"$status\"}"
    
    # Generate date of birth (random age between 18-65)
    local age=$((RANDOM % 47 + 18))
    local birth_year=$((2024 - age))
    local birth_month=$((RANDOM % 12 + 1))
    local birth_day=$((RANDOM % 28 + 1))
    local date_of_birth="$birth_year-$(printf "%02d" $birth_month)-$(printf "%02d" $birth_day)"
    
    # Return the SQL INSERT statement
    echo "INSERT INTO customers (email, firstName, lastName, phone, isActive, dateOfBirth, address, preferences) VALUES ('$email', '$first_name', '$last_name', '$phone', 1, '$date_of_birth', '$address_json', '$preferences_json');"
}

# Function to seed customer data
seed_customer_data() {
    print_status "Seeding $RECORD_COUNT customer records..."
    
    # Create temporary SQL file
    local temp_sql_file="/tmp/customer_seed_data.sql"
    
    # Generate SQL statements
    print_status "Generating customer data..."
    for ((i=1; i<=RECORD_COUNT; i++)); do
        generate_customer_data $i >> "$temp_sql_file"
        
        # Show progress every 50 records
        if [[ $((i % 50)) -eq 0 ]]; then
            print_status "Generated $i/$RECORD_COUNT records..."
        fi
    done
    
    print_status "Executing SQL statements..."
    
    # Execute the SQL file
    if docker exec -i southern-martin-customer-service-db mysql -u "$CUSTOMER_DB_USER" -p"$CUSTOMER_DB_PASSWORD" "$CUSTOMER_DB_NAME" < "$temp_sql_file"; then
        print_success "Successfully seeded $RECORD_COUNT customer records"
    else
        print_error "Failed to seed customer data"
        exit 1
    fi
    
    # Clean up temporary file
    rm -f "$temp_sql_file"
}

# Function to verify seeded data
verify_seeded_data() {
    print_status "Verifying seeded data..."
    
    # Count total customers
    local total_count=$(docker exec southern-martin-customer-service-db mysql -u "$CUSTOMER_DB_USER" -p"$CUSTOMER_DB_PASSWORD" -sN -e "SELECT COUNT(*) FROM customers;" "$CUSTOMER_DB_NAME")
    
    if [[ "$total_count" -eq "$RECORD_COUNT" ]]; then
        print_success "Verification passed: $total_count customer records found"
    else
        print_warning "Verification failed: Expected $RECORD_COUNT records, found $total_count"
    fi
    
    # Show some statistics
    print_status "Customer data statistics:"
    
    # Count by active status
    local active_count=$(docker exec southern-martin-customer-service-db mysql -u "$CUSTOMER_DB_USER" -p"$CUSTOMER_DB_PASSWORD" -sN -e "SELECT COUNT(*) FROM customers WHERE isActive = 1;" "$CUSTOMER_DB_NAME")
    local inactive_count=$(docker exec southern-martin-customer-service-db mysql -u "$CUSTOMER_DB_USER" -p"$CUSTOMER_DB_PASSWORD" -sN -e "SELECT COUNT(*) FROM customers WHERE isActive = 0;" "$CUSTOMER_DB_NAME")
    
    echo "  - Active customers: $active_count"
    echo "  - Inactive customers: $inactive_count"
    
    # Show sample records
    print_status "Sample customer records:"
    docker exec southern-martin-customer-service-db mysql -u "$CUSTOMER_DB_USER" -p"$CUSTOMER_DB_PASSWORD" -e "SELECT id, firstName, lastName, email, isActive FROM customers LIMIT 5;" "$CUSTOMER_DB_NAME"
}

# Function to test API endpoints
test_api_endpoints() {
    print_status "Testing customer API endpoints..."
    
    # Test GET /api/v1/customers
    local api_response=$(curl -s "$CUSTOMER_SERVICE_URL/api/v1/customers" || echo "failed")
    if [[ "$api_response" != "failed" ]]; then
        print_success "Customer API is responding"
        
        # Count customers via API
        local api_count=$(echo "$api_response" | grep -o '"total":[0-9]*' | cut -d: -f2 || echo "0")
        if [[ "$api_count" -gt 0 ]]; then
            print_success "API returned $api_count customers"
        else
            print_warning "API returned 0 customers (might be pagination issue)"
        fi
    else
        print_error "Customer API is not responding"
    fi
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
    echo "✅ Database: $CUSTOMER_DB_NAME"
    echo "✅ Service: $CUSTOMER_SERVICE_URL"
    echo "✅ Table: customers"
    echo
    echo "=========================================="
    echo "USEFUL COMMANDS"
    echo "=========================================="
    echo
    echo "📊 View all customers:"
    echo "   curl $CUSTOMER_SERVICE_URL/api/v1/customers"
    echo
    echo "🔍 Query database directly:"
    echo "   docker exec -it southern-martin-customer-service-db mysql -u $CUSTOMER_DB_USER -p $CUSTOMER_DB_NAME"
    echo
    echo "📈 Check customer statistics:"
    echo "   docker exec southern-martin-customer-service-db mysql -u $CUSTOMER_DB_USER -p$CUSTOMER_DB_PASSWORD -e \"SELECT customer_type, COUNT(*) FROM customers GROUP BY customer_type;\" $CUSTOMER_DB_NAME"
    echo
    echo "🗑️  Clear all customer data:"
    echo "   docker exec southern-martin-customer-service-db mysql -u $CUSTOMER_DB_USER -p$CUSTOMER_DB_PASSWORD -e \"DELETE FROM customers;\" $CUSTOMER_DB_NAME"
    echo
}

# Main execution
main() {
    echo "=========================================="
    echo "🌱 CUSTOMER DATA SEEDING"
    echo "=========================================="
    echo
    
    check_docker
    check_customer_service
    check_customer_database
    create_customers_table
    seed_customer_data
    verify_seeded_data
    test_api_endpoints
    display_summary
    
    print_success "Customer data seeding completed successfully!"
}

# Run main function
main "$@"
