# 🌱 Data Seeding Scripts

This directory contains scripts for seeding test data into the microservices architecture.

## 📋 **Available Scripts**

### **Customer Data Seeding**

#### **1. Database Direct Seeding (`seed-customer-data.sh`)**
- **Purpose**: Seeds customer data directly into the database
- **Method**: Direct SQL INSERT statements
- **Speed**: Fast (bulk SQL operations)
- **Requirements**: Direct database access

#### **2. API Seeding (`seed-customer-data-api.sh`)**
- **Purpose**: Seeds customer data via REST API calls
- **Method**: HTTP POST requests to customer service
- **Speed**: Slower (individual API calls)
- **Requirements**: Customer service running and accessible

## 🚀 **Quick Start**

### **Prerequisites**
1. **Docker Running**: Ensure Docker Desktop is running
2. **Services Running**: Start the hybrid architecture
3. **Database Access**: Ensure customer service database is accessible

### **Start Services**
```bash
# Start the hybrid architecture
./scripts/setup/hybrid-setup.sh

# Or start manually
docker-compose -f docker-compose.hybrid.yml up -d
```

### **Seed Customer Data**

#### **Option 1: Direct Database Seeding (Recommended)**
```bash
# Seed 500 customer records directly to database
./scripts/data/seed-customer-data.sh
```

#### **Option 2: API Seeding**
```bash
# Seed 500 customer records via API
./scripts/data/seed-customer-data-api.sh
```

## 📊 **Data Generated**

### **Customer Records (500 records)**
Each customer record includes:

- **Basic Information**:
  - Company name (random from 60+ company names)
  - Contact person (random first + last name)
  - Email (generated from name and company)
  - Phone number (random US format)

- **Address Information**:
  - Street address (random number + street name)
  - City (random from 50+ US cities)
  - State (random US state abbreviation)
  - ZIP code (random 5-digit code)
  - Country (USA)

- **Business Information**:
  - Customer type (individual, business, enterprise)
  - Status (active, inactive, suspended)
  - Registration date (random within last 2 years)
  - Last contact date (random within last 6 months, or NULL)
  - Notes (optional, random business notes)

- **Relationships**:
  - User ID (random 1-100, assumes users exist)

## 🔧 **Configuration**

### **Script Configuration**
You can modify the following variables in the scripts:

```bash
# Number of records to generate
RECORD_COUNT=500

# Customer service URL
CUSTOMER_SERVICE_URL="http://localhost:3004"

# Database configuration (for direct seeding)
CUSTOMER_DB_HOST="localhost"
CUSTOMER_DB_PORT="3309"
CUSTOMER_DB_NAME="customer_service_db"
CUSTOMER_DB_USER="customer_user"
CUSTOMER_DB_PASSWORD="customer_password"

# API seeding configuration
BATCH_SIZE=10
DELAY_BETWEEN_BATCHES=1
```

## 📈 **Performance Comparison**

| Method | Speed | Reliability | Validation | Use Case |
|--------|-------|-------------|------------|----------|
| **Direct DB** | ⚡ Fast | ✅ High | ❌ Bypassed | Bulk seeding, testing |
| **API Calls** | 🐌 Slower | ⚠️ Medium | ✅ Full | Production-like testing |

## 🧪 **Testing the Seeded Data**

### **1. Check Database Directly**
```bash
# Connect to customer database
docker exec -it customer-service-db mysql -u customer_user -p customer_service_db

# Count customers
SELECT COUNT(*) FROM customers;

# View sample records
SELECT * FROM customers LIMIT 5;

# Check by customer type
SELECT customer_type, COUNT(*) FROM customers GROUP BY customer_type;

# Check by status
SELECT status, COUNT(*) FROM customers GROUP BY status;
```

### **2. Check via API**
```bash
# Get all customers
curl http://localhost:3004/api/v1/customers

# Get specific customer
curl http://localhost:3004/api/v1/customers/1

# Check customer count
curl -s http://localhost:3004/api/v1/customers | grep -o '"total":[0-9]*'
```

### **3. Check via React Admin**
1. Open http://localhost:3000
2. Navigate to Customers section
3. Verify 500 records are displayed
4. Test pagination, filtering, and search

## 🗑️ **Cleaning Up Seeded Data**

### **Clear All Customer Data**
```bash
# Via database
docker exec customer-service-db mysql -u customer_user -p$CUSTOMER_DB_PASSWORD -e "DELETE FROM customers;" customer_service_db

# Via API (if supported)
# Note: This depends on your API implementation
```

### **Reset Customer Table**
```bash
# Drop and recreate table
docker exec customer-service-db mysql -u customer_user -p$CUSTOMER_DB_PASSWORD -e "DROP TABLE IF EXISTS customers;" customer_service_db
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. Service Not Running**
```bash
# Check if customer service is running
docker-compose -f docker-compose.hybrid.yml ps

# Start customer service
docker-compose -f docker-compose.hybrid.yml up -d customer-service
```

#### **2. Database Connection Issues**
```bash
# Check database container
docker ps | grep customer-service-db

# Check database logs
docker logs customer-service-db

# Test database connection
docker exec customer-service-db mysql -u customer_user -p customer_service_db
```

#### **3. API Connection Issues**
```bash
# Test API health
curl http://localhost:3004/api/v1/health

# Check service logs
docker logs customer-service
```

#### **4. Permission Issues**
```bash
# Make scripts executable
chmod +x scripts/data/*.sh

# Check file permissions
ls -la scripts/data/
```

## 📚 **Data Schema**

### **Customers Table Structure**
```sql
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_zip_code VARCHAR(20),
    address_country VARCHAR(100) DEFAULT 'USA',
    customer_type ENUM('individual', 'business', 'enterprise') DEFAULT 'business',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_contact_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_company_name (company_name),
    INDEX idx_status (status),
    INDEX idx_customer_type (customer_type),
    INDEX idx_created_at (created_at)
);
```

## 🎯 **Next Steps**

### **Additional Data Seeding**
Consider creating similar scripts for:

- **User Data**: Seed additional users for testing
- **Carrier Data**: Seed carrier records
- **Pricing Rules**: Seed pricing rules and configurations
- **Translation Data**: Seed translation records

### **Performance Testing**
Use the seeded data for:

- **Load Testing**: Test API performance with large datasets
- **Pagination Testing**: Verify pagination works correctly
- **Search Testing**: Test search functionality
- **Filtering Testing**: Test various filter combinations

### **Integration Testing**
Test cross-service functionality:

- **User-Customer Relationships**: Verify user-customer associations
- **Customer-Carrier Relationships**: Test customer-carrier interactions
- **Pricing Calculations**: Test pricing with real customer data

## 📞 **Support**

If you encounter issues:

1. **Check Logs**: Review service and database logs
2. **Verify Configuration**: Ensure all environment variables are correct
3. **Test Connectivity**: Verify services can communicate
4. **Check Resources**: Ensure sufficient disk space and memory

---

**Happy Seeding! 🌱**
