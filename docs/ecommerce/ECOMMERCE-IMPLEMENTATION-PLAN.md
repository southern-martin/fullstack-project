# 🛒 Multi-Seller Marketplace - Complete Implementation Plan

**Created:** October 29, 2025  
**Updated:** October 29, 2025 (Added Marketplace Architecture)  
**Status:** Planning Phase  
**Estimated Duration:** 12-14 weeks (phased approach)  
**System Type:** Multi-Seller Marketplace Platform

---

## 📋 Executive Summary

This document outlines a complete implementation plan for building a production-ready **multi-seller marketplace** platform integrated with the existing microservices architecture. The system enables multiple independent sellers to list and sell products, with automated commission handling, order splitting, and payout management.

### Key Objectives
1. Build **4 new microservices** (Product, Order, Seller, Payout Services)
2. Create **Multi-Seller Management** with verification workflow
3. Build **Admin Dashboard** for marketplace management
4. Build **Seller Dashboard** for seller operations
5. Build **Customer Website** for multi-seller shopping
6. Implement **Commission System** and automated payouts
7. Integrate **Translation Service** for multi-language content
8. Add **Order Splitting** by seller and fulfillment tracking

### Marketplace Features
- ✅ **Multiple Sellers** - Independent vendor accounts
- ✅ **Seller Verification** - Admin approval workflow
- ✅ **Product Ownership** - Products belong to sellers
- ✅ **Order Splitting** - Orders split by seller automatically
- ✅ **Commission System** - Configurable platform fees
- ✅ **Automated Payouts** - Weekly/monthly seller payments
- ✅ **Seller Analytics** - Sales reports and metrics
- ✅ **Seller Reviews** - Customer ratings for sellers
- ✅ **Multi-Seller Cart** - Cart can contain items from multiple sellers

---

## 🏗️ System Architecture Overview

### Current Infrastructure
- ✅ **Auth Service** (3001) - Authentication & Authorization
- ✅ **User Service** (3003) - User management
- ✅ **Customer Service** (3004) - Customer data
- ✅ **Carrier Service** (3005) - Shipping carriers
- ✅ **Pricing Service** (3006) - Pricing rules
- ✅ **Translation Service** (3007) - Multi-language support
- ✅ **Shared MySQL Database** - Auth + User data
- ✅ **Shared Redis** - Caching layer
- ✅ **React Admin** - Administration interface

### New Services Required
- 🆕 **Product Service** (3008) - Product catalog, categories, attributes, images (owned by sellers)
- 🆕 **Order Service** (3009) - Order processing with multi-seller order splitting
- 🆕 **Seller Service** (3010) - Seller registration, verification, and management
- 🆕 **Payout Service** (3011) - Commission calculation and seller payouts

**Architecture Decisions:**
1. **Product + Category Combined** - Categories integrated into Product Service for domain cohesion
2. **Seller Ownership** - All products are owned by sellers (seller_id foreign key)
3. **Order Splitting** - Orders automatically split by seller for independent fulfillment
4. **Platform Commission** - Platform collects payment, calculates commission, pays sellers
5. **Seller Verification** - Manual admin approval required before sellers can publish products

### Frontend Applications
- 🔧 **React Admin (3000)** - Platform admin dashboard (manage sellers, approve products, process payouts)
- 🆕 **Seller Dashboard (3200)** - Seller operations (products, orders, analytics, payouts)
- 🆕 **Customer Website (3100)** - Public marketplace storefront (browse all sellers)

---

## 📊 Database Schema Design

### Marketplace Tables (New)

#### Sellers Table
```sql
CREATE TABLE sellers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                    -- Link to User Service
    business_name VARCHAR(255) NOT NULL,
    business_type ENUM('individual', 'company', 'enterprise') DEFAULT 'individual',
    tax_id VARCHAR(100),                     -- VAT/Tax number
    business_email VARCHAR(255) NOT NULL,
    business_phone VARCHAR(50),
    
    -- Address
    business_address TEXT,
    business_city VARCHAR(100),
    business_state VARCHAR(100),
    business_country VARCHAR(100),
    business_postal_code VARCHAR(20),
    
    -- Seller Status
    status ENUM('pending', 'active', 'suspended', 'banned') DEFAULT 'pending',
    verification_status ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'unverified',
    
    -- Ratings
    rating DECIMAL(3,2) DEFAULT 0.00,        -- Average rating (0.00 - 5.00)
    total_reviews INT DEFAULT 0,
    
    -- Business Metrics
    total_products INT DEFAULT 0,
    total_sales INT DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    
    -- Commission Settings (can be customized per seller)
    commission_rate DECIMAL(5,2) DEFAULT 15.00,  -- Platform fee %
    
    -- Banking Information (for payouts)
    bank_account_holder VARCHAR(255),
    bank_account_number VARCHAR(100),        -- Encrypted
    bank_name VARCHAR(255),
    bank_routing_number VARCHAR(100),
    
    -- Metadata
    logo_url VARCHAR(500),
    description TEXT,
    website_url VARCHAR(500),
    
    -- Timestamps
    approved_at TIMESTAMP NULL,
    rejected_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user (user_id),
    INDEX idx_status (status),
    INDEX idx_verification (verification_status),
    INDEX idx_rating (rating),
    INDEX idx_created (created_at)
);
```

#### Products Table (Seller-Owned)
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,                  -- NEW: Product belongs to seller
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    min_stock INT DEFAULT 0,
    max_stock INT,
    weight DECIMAL(10,2),
    dimensions JSON,                         -- {length, width, height, unit}
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Product Status (for marketplace)
    approval_status ENUM('draft', 'pending', 'approved', 'rejected') DEFAULT 'draft',
    approved_by_id INT NULL,
    approved_at TIMESTAMP NULL,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
    INDEX idx_seller (seller_id),
    INDEX idx_sku (sku),
    INDEX idx_name (name),
    INDEX idx_price (price),
    INDEX idx_stock (stock_quantity),
    INDEX idx_active (is_active),
    INDEX idx_approval (approval_status),
    INDEX idx_created (created_at),
    FULLTEXT idx_search (name, description, short_description)
);
```

#### Categories Table (Hierarchical)
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    image_url VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_parent (parent_id),
    INDEX idx_slug (slug),
    INDEX idx_active (is_active),
    INDEX idx_sort (sort_order)
);
```

#### Product_Categories Junction Table
```sql
CREATE TABLE product_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_category (product_id, category_id),
    INDEX idx_product (product_id),
    INDEX idx_category (category_id),
    INDEX idx_primary (is_primary)
);
```

#### Product_Images Table
```sql
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_primary (is_primary),
    INDEX idx_sort (sort_order)
);
```

#### Attributes Table (Flexible Product Attributes)
```sql
CREATE TABLE attributes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    attribute_type ENUM('text', 'number', 'boolean', 'select', 'multiselect') NOT NULL,
    is_required BOOLEAN DEFAULT false,
    is_filterable BOOLEAN DEFAULT true,
    is_visible BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_attribute_name (name),
    INDEX idx_type (attribute_type),
    INDEX idx_filterable (is_filterable),
    INDEX idx_sort (sort_order)
);
```

#### Attribute_Values Table
```sql
CREATE TABLE attribute_values (
    id INT PRIMARY KEY AUTO_INCREMENT,
    attribute_id INT NOT NULL,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE,
    INDEX idx_attribute (attribute_id),
    INDEX idx_value (value),
    INDEX idx_sort (sort_order)
);
```

#### Product_Attribute_Values Table (Normalized)
```sql
CREATE TABLE product_attribute_values (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    attribute_id INT NOT NULL,
    attribute_value_id INT NULL,  -- For predefined values (select/multiselect)
    value_text VARCHAR(500),      -- For text/custom values
    value_number DECIMAL(10,2),   -- For numeric values
    value_boolean BOOLEAN,        -- For boolean values
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_value_id) REFERENCES attribute_values(id) ON DELETE SET NULL,
    INDEX idx_product (product_id),
    INDEX idx_attribute (attribute_id),
    INDEX idx_value (attribute_value_id),
    INDEX idx_product_attribute (product_id, attribute_id)
);
```

#### Orders Table
```sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    shipping_address JSON NOT NULL,
    billing_address JSON,
    customer_note TEXT,
    admin_note TEXT,
    carrier_id INT,
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    actual_delivery DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (carrier_id) REFERENCES carriers(id) ON DELETE SET NULL,
    INDEX idx_customer (customer_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_carrier (carrier_id),
    INDEX idx_created (created_at),
    INDEX idx_status_created (status, created_at)
);
```

#### Order_Items Table (Multi-Seller Support)
```sql
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    seller_id INT NOT NULL,              -- NEW: Track which seller owns this item
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,  -- Snapshot at order time
    product_sku VARCHAR(100) NOT NULL,   -- Snapshot at order time
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    
    -- Seller Commission
    commission_rate DECIMAL(5,2) NOT NULL,        -- Platform fee % at order time
    commission_amount DECIMAL(10,2) NOT NULL,     -- Calculated commission
    seller_payout DECIMAL(10,2) NOT NULL,         -- Amount seller receives
    
    -- Fulfillment (per-seller)
    fulfillment_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    tracking_number VARCHAR(255),
    carrier_id INT,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    
    product_snapshot JSON,  -- Complete product data at order time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (carrier_id) REFERENCES carriers(id) ON DELETE SET NULL,
    INDEX idx_order (order_id),
    INDEX idx_seller (seller_id),
    INDEX idx_product (product_id),
    INDEX idx_fulfillment (fulfillment_status),
    INDEX idx_created (created_at)
);
```

#### Seller_Payouts Table
```sql
CREATE TABLE seller_payouts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    
    -- Payout Period
    payout_period_start DATE NOT NULL,
    payout_period_end DATE NOT NULL,
    
    -- Financial Details
    gross_sales DECIMAL(12,2) NOT NULL,          -- Total sales before commission
    platform_commission DECIMAL(12,2) NOT NULL,  -- Total commission deducted
    net_payout DECIMAL(12,2) NOT NULL,           -- Amount to pay seller
    
    -- Order Statistics
    total_orders INT NOT NULL,
    total_items INT NOT NULL,
    
    -- Status
    status ENUM('pending', 'processing', 'paid', 'failed', 'cancelled') DEFAULT 'pending',
    
    -- Payment Information
    payment_method VARCHAR(100),                  -- bank_transfer, paypal, stripe
    transaction_reference VARCHAR(255),           -- External payment ID
    transaction_fee DECIMAL(10,2) DEFAULT 0,
    
    -- Timestamps
    paid_at TIMESTAMP NULL,
    failed_at TIMESTAMP NULL,
    
    -- Notes
    admin_note TEXT,
    failure_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
    INDEX idx_seller (seller_id),
    INDEX idx_status (status),
    INDEX idx_period (payout_period_start, payout_period_end),
    INDEX idx_created (created_at)
);
```

#### Seller_Reviews Table
```sql
CREATE TABLE seller_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    customer_id INT NOT NULL,
    order_id INT NOT NULL,
    
    -- Review Content
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    
    -- Review Aspects (optional detailed ratings)
    communication_rating INT CHECK (communication_rating >= 1 AND communication_rating <= 5),
    shipping_speed_rating INT CHECK (shipping_speed_rating >= 1 AND shipping_speed_rating <= 5),
    product_quality_rating INT CHECK (product_quality_rating >= 1 AND product_quality_rating <= 5),
    
    -- Status
    status ENUM('pending', 'approved', 'rejected', 'flagged') DEFAULT 'pending',
    
    -- Seller Response
    seller_response TEXT,
    seller_responded_at TIMESTAMP NULL,
    
    -- Moderation
    approved_by_id INT,
    approved_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (seller_id, customer_id, order_id),
    INDEX idx_seller (seller_id),
    INDEX idx_customer (customer_id),
    INDEX idx_rating (rating),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);
```

---

## 🎯 Implementation Phases (Marketplace Architecture)

### **PHASE 1: Seller & Product Foundation (Weeks 1-2)**

#### 1.1 Seller Service Setup
**Goal:** Create Seller microservice for multi-seller marketplace

**Tasks:**
- [ ] Create `seller-service` directory structure (NestJS clean architecture)
- [ ] Setup TypeORM with migrations infrastructure
- [ ] Implement Seller entity with all marketplace fields
- [ ] Create SellerRepository with BaseTypeOrmRepository
- [ ] Implement SellerService (domain layer)
- [ ] Create Seller DTOs (RegisterSellerDto, UpdateSellerDto, SellerResponseDto)
- [ ] Build SellerController with REST endpoints
- [ ] Add seller registration workflow
- [ ] Implement verification status management
- [ ] Add seller rating calculation logic
- [ ] Setup seller database (MySQL on port 3310)
- [ ] Create initial migrations
- [ ] Implement Redis caching for seller data
- [ ] Write unit tests (Jest)
- [ ] Create Postman collection for Seller API
- [ ] Add health check endpoint

**Database:**
- MySQL container: `seller-db` (port 3310)
- Tables: `sellers`
- Indexes: Status, verification, rating, user_id

**Seller API Endpoints:**
- `POST /api/v1/sellers/register` - Seller registration
- `GET /api/v1/sellers` - List all sellers (admin)
- `GET /api/v1/sellers/:id` - Get seller by ID
- `GET /api/v1/sellers/user/:userId` - Get seller by user ID
- `PATCH /api/v1/sellers/:id` - Update seller profile
- `PATCH /api/v1/sellers/:id/verify` - Verify seller (admin)
- `PATCH /api/v1/sellers/:id/status` - Update seller status (admin)
- `GET /api/v1/sellers/:id/stats` - Get seller statistics
- `DELETE /api/v1/sellers/:id` - Delete/ban seller (admin)

**Deliverables:**
- ✅ Seller Service running on port 3010
- ✅ Seller registration and verification workflow
- ✅ Admin can approve/reject sellers
- ✅ Seller profile management

---

#### 1.2 Product Service Setup (Seller-Owned Products)
**Goal:** Create Product microservice with seller ownership

**Tasks:**
- [ ] Create `product-service` directory structure (NestJS clean architecture)
- [ ] Setup TypeORM with migrations infrastructure
- [ ] Implement Product entity with **seller_id** and **approval_status**
- [ ] Implement Category entity (self-referencing for hierarchy)
- [ ] Implement ProductImage entity (one-to-many with Product)
- [ ] Create ProductRepository with seller filtering
- [ ] Create CategoryRepository with tree operations
- [ ] Implement ProductService with seller ownership logic
- [ ] Implement CategoryService (domain layer)
- [ ] Add product approval workflow (draft → pending → approved/rejected)
- [ ] Create Product DTOs (CreateProductDto, UpdateProductDto, ProductResponseDto)
- [ ] Create Category DTOs (CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto)
- [ ] Build ProductController with seller-based authorization
- [ ] Build CategoryController with REST endpoints
- [ ] Add validation (class-validator)
- [ ] Implement error handling (HttpExceptionFilter)
- [ ] Add response transformation (TransformInterceptor)
- [ ] Setup product database (MySQL on port 3308)
- [ ] Create initial migrations for all tables
- [ ] Add strategic indexes (seller_id, approval_status)
- [ ] Implement Redis caching for products and categories
- [ ] Write unit tests (Jest)
- [ ] Create Postman collection for Product API
- [ ] Add health check endpoint

**Database:**
- MySQL container: `product-db` (port 3308)
- Tables: `products` (with seller_id), `categories`, `product_categories`, `product_images`
- Indexes: seller_id, approval_status, active, price, stock

**Product API Endpoints:**
- `POST /api/v1/products` - Create product (by seller)
- `GET /api/v1/products` - List all approved products (public)
- `GET /api/v1/products/seller/:sellerId` - Get products by seller
- `GET /api/v1/products/pending` - Get pending products (admin)
- `GET /api/v1/products/:id` - Get product by ID
- `PATCH /api/v1/products/:id` - Update product (seller/admin)
- `PATCH /api/v1/products/:id/approve` - Approve product (admin)
- `PATCH /api/v1/products/:id/reject` - Reject product (admin)
- `DELETE /api/v1/products/:id` - Delete product (seller/admin)
- `GET /api/v1/products/search` - Search products (fulltext)
- `PATCH /api/v1/products/:id/stock` - Update stock (seller)
- `POST /api/v1/products/:id/images` - Add product image (seller)

**Category API Endpoints:**
- `POST /api/v1/categories` - Create category (admin)
- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `PATCH /api/v1/categories/:id` - Update category (admin)
- `DELETE /api/v1/categories/:id` - Delete category (admin)
- `GET /api/v1/categories/tree` - Get category tree (hierarchical)
- `GET /api/v1/categories/:id/products` - Get products in category

**Deliverables:**
- ✅ Product Service running on port 3008
- ✅ Products owned by sellers (seller_id foreign key)
- ✅ Product approval workflow
- ✅ Category management
- ✅ Admin can approve/reject products

---

### **PHASE 2: Order Management & Splitting (Weeks 3-4)**

#### 2.1 Order Service Setup (Multi-Seller Orders)
**Goal:** Create Order microservice with order splitting by seller

**Tasks:**
- [ ] Create `order-service` directory structure (NestJS clean architecture)
- [ ] Setup TypeORM with migrations infrastructure
- [ ] Implement Order and OrderItem entities (with seller_id in order_items)
- [ ] Create OrderRepository with seller filtering
- [ ] Implement OrderService with multi-seller order splitting logic
- [ ] Add commission calculation logic (per order item)
- [ ] Create Order DTOs (CreateOrderDto, UpdateOrderDto, OrderResponseDto)
- [ ] Build OrderController with REST endpoints
- [ ] Implement order number generation
- [ ] Add order status workflow (state machine)
- [ ] Add payment status tracking
- [ ] Implement order splitting algorithm (group items by seller)
- [ ] Add fulfillment tracking per seller
- [ ] Setup order database (MySQL on port 3309)
- [ ] Create initial migrations
- [ ] Implement Redis caching for recent orders
- [ ] Write unit tests (Jest)
- [ ] Create Postman collection

**Database:**
- MySQL container: `order-db` (port 3309)
- Tables: `orders`, `order_items` (with seller_id, commission fields, fulfillment_status)
- Indexes: order, seller, product, fulfillment, created_at

**Order API Endpoints:**
- `POST /api/v1/orders` - Create order (auto-split by seller)
- `GET /api/v1/orders` - List all orders (admin)
- `GET /api/v1/orders/seller/:sellerId` - Get seller's orders
- `GET /api/v1/orders/customer/:customerId` - Get customer's orders
- `GET /api/v1/orders/:id` - Get order by ID
- `GET /api/v1/orders/:id/items/seller/:sellerId` - Get seller's items in order
- `PATCH /api/v1/orders/:id/status` - Update order status
- `PATCH /api/v1/orders/items/:itemId/fulfill` - Update item fulfillment (seller)
- `PATCH /api/v1/orders/items/:itemId/ship` - Mark item as shipped (seller)
- `GET /api/v1/orders/stats` - Get order statistics
- `DELETE /api/v1/orders/:id` - Cancel order

**Deliverables:**
- ✅ Order Service running on port 3309
- ✅ Orders automatically split by seller
- ✅ Each seller can only see/fulfill their items
- ✅ Commission calculated per order item
- ✅ Fulfillment tracking per seller

---

### **PHASE 3: Payout System (Week 5)**

#### 3.1 Payout Service Setup
**Goal:** Create Payout microservice for commission calculation and seller payments

**Tasks:**
- [ ] Create `payout-service` directory structure (NestJS clean architecture)
- [ ] Setup TypeORM with migrations infrastructure
- [ ] Implement SellerPayout entity
- [ ] Create PayoutRepository
- [ ] Implement PayoutService with commission calculation
- [ ] Add payout period calculation (weekly/monthly)
- [ ] Create seller payout aggregation logic
- [ ] Implement payout status workflow
- [ ] Create Payout DTOs
- [ ] Build PayoutController
- [ ] Add scheduled jobs for automatic payout generation (cron)
- [ ] Implement payout export (CSV/PDF)
- [ ] Add email notifications for payouts
- [ ] Setup payout database (MySQL on port 3311)
- [ ] Create initial migrations
- [ ] Write unit tests
- [ ] Create Postman collection

**Database:**
- MySQL container: `payout-db` (port 3311)
- Tables: `seller_payouts`
- Indexes: seller, status, period, created_at

**Payout API Endpoints:**
- `POST /api/v1/payouts/generate` - Generate payouts for period (admin)
- `GET /api/v1/payouts` - List all payouts (admin)
- `GET /api/v1/payouts/seller/:sellerId` - Get seller's payouts
- `GET /api/v1/payouts/:id` - Get payout by ID
- `PATCH /api/v1/payouts/:id/process` - Mark payout as paid (admin)
- `PATCH /api/v1/payouts/:id/fail` - Mark payout as failed (admin)
- `GET /api/v1/payouts/pending` - Get pending payouts
- `GET /api/v1/payouts/:id/export` - Export payout report (PDF/CSV)
- `GET /api/v1/payouts/seller/:sellerId/summary` - Get seller payout summary

**Payout Calculation Logic:**
```typescript
For each seller in payout period:
  1. Get all delivered order_items for seller
  2. Sum: gross_sales = SUM(total_price)
  3. Sum: platform_commission = SUM(commission_amount)
  4. Calculate: net_payout = gross_sales - platform_commission
  5. Create seller_payout record
```

**Deliverables:**
- ✅ Payout Service running on port 3311
- ✅ Automated payout calculation
- ✅ Admin can process payouts
- ✅ Sellers can view their payout history
- ✅ Scheduled payout generation (weekly/monthly)

---

### **PHASE 4: Admin Dashboard Extensions (Week 6)**

#### 4.1 Seller Management UI
**Goal:** Build seller management interface in React Admin

**Tasks:**
- [ ] Create seller module in react-admin
- [ ] Create seller labels (seller-labels.ts)
- [ ] Create useSellerLabels hook
- [ ] Build Sellers.tsx component (list view)
- [ ] Build SellerForm.tsx (create/edit)
- [ ] Build SellerDetails.tsx with tabs (Profile, Products, Orders, Payouts, Reviews)
- [ ] Add seller verification workflow UI
- [ ] Add seller status management (active, suspended, banned)
- [ ] Implement seller filtering (status, verification, rating)
- [ ] Add seller statistics dashboard
- [ ] Create seller seeding script
- [ ] Add translation support (FR/ES labels)

#### 4.2 Product Approval UI
**Goal:** Build product approval interface for admin

**Tasks:**
- [ ] Build PendingProducts.tsx component
- [ ] Add product approval/rejection actions
- [ ] Add bulk approval/rejection
- [ ] Add product review modal with product details
- [ ] Implement rejection reason form
- [ ] Add notifications for sellers on approval/rejection

#### 4.3 Payout Management UI
**Goal:** Build payout processing interface

**Tasks:**
- [ ] Create payout module in react-admin
- [ ] Build Payouts.tsx component (list view)
- [ ] Build PayoutDetails.tsx
- [ ] Add payout period selector
- [ ] Add "Generate Payouts" button
- [ ] Add "Process Payout" action
- [ ] Add payout export (CSV/PDF)
- [ ] Display payout statistics

**Deliverables:**
- ✅ Admin can manage sellers
- ✅ Admin can approve/reject products
- ✅ Admin can process payouts
- ✅ Comprehensive seller analytics

---

### **PHASE 5: Seller Dashboard (Weeks 7-8)**

#### 5.1 Seller Dashboard Application
**Goal:** Create new React application for sellers

**Tasks:**
- [ ] Create new React app (seller-dashboard on port 3200)
- [ ] Setup React Query, Tailwind, TypeScript
- [ ] Implement seller authentication (JWT from Auth Service)
- [ ] Create seller layout and navigation
- [ ] Build Dashboard page with analytics
- [ ] Create seller labels and translation integration

#### 5.2 Seller Product Management
**Goal:** Allow sellers to manage their products

**Tasks:**
- [ ] Build MyProducts.tsx page
- [ ] Build ProductForm.tsx (create/edit)
- [ ] Add product image upload
- [ ] Add category selection
- [ ] Display product approval status
- [ ] Add stock management UI
- [ ] Show product performance metrics

#### 5.3 Seller Order Fulfillment
**Goal:** Allow sellers to fulfill their orders

**Tasks:**
- [ ] Build MyOrders.tsx page
- [ ] Filter orders by fulfillment status
- [ ] Add "Mark as Shipped" action
- [ ] Add tracking number input
- [ ] Display order statistics
- [ ] Add order notifications

#### 5.4 Seller Payout Tracking
**Goal:** Show sellers their payout history

**Tasks:**
- [ ] Build Payouts.tsx page
- [ ] Display payout history table
- [ ] Show payout summary (total earnings, pending, paid)
- [ ] Add payout period filter
- [ ] Display commission breakdown
- [ ] Add download payout statement

#### 5.5 Seller Analytics
**Goal:** Provide sales analytics to sellers

**Tasks:**
- [ ] Build Analytics.tsx page
- [ ] Display sales chart (daily/weekly/monthly)
- [ ] Show top-selling products
- [ ] Display conversion metrics
- [ ] Show rating and review summary
- [ ] Add export reports feature

**Deliverables:**
- ✅ Seller Dashboard running on port 3200
- ✅ Sellers can manage their products
- ✅ Sellers can fulfill orders
- ✅ Sellers can track payouts
- ✅ Comprehensive sales analytics

---

### **PHASE 6: Customer Website (Weeks 9-10)**

#### 6.1 Customer Website Setup
**Goal:** Create public-facing marketplace website

**Tasks:**
- [ ] Create new React app (customer-website on port 3100)
- [ ] Setup React Query, Tailwind, TypeScript
- [ ] Implement authentication (JWT from Auth Service)
- [ ] Create customer layout and navigation
- [ ] Integrate Translation Service for multi-language
- [ ] Create customer labels and hooks

#### 6.2 Multi-Seller Product Catalog
**Goal:** Display products from all sellers

**Tasks:**
- [ ] Build HomePage with featured products
- [ ] Build CategoryPage with product listing
- [ ] Build ProductDetailPage showing seller info
- [ ] Add seller profile badge on products
- [ ] Display seller rating and review count
- [ ] Add "View Seller" link to seller profile page
- [ ] Implement product search with seller filter
- [ ] Add product filtering (price, rating, seller)
- [ ] Show product from multiple sellers in results

#### 6.3 Multi-Seller Shopping Cart
**Goal:** Cart that handles products from multiple sellers

**Tasks:**
- [ ] Create cart context with multi-seller support
- [ ] Build Cart component showing items grouped by seller
- [ ] Display separate totals per seller
- [ ] Show estimated shipping per seller
- [ ] Add cart icon with item count
- [ ] Persist cart in localStorage
- [ ] Handle stock validation per seller

#### 6.4 Multi-Seller Checkout
**Goal:** Checkout process with order splitting

**Tasks:**
- [ ] Build multi-step checkout page
- [ ] Step 1: Review cart (grouped by seller)
- [ ] Step 2: Shipping information
- [ ] Step 3: Payment method
- [ ] Step 4: Order review showing split by seller
- [ ] Implement order creation (auto-split backend)
- [ ] Build order confirmation page showing seller breakdown
- [ ] Add order tracking per seller

#### 6.5 Seller Profile Pages
**Goal:** Public seller profile pages

**Tasks:**
- [ ] Build SellerProfile.tsx page
- [ ] Display seller info (name, logo, description, rating)
- [ ] Show seller's products
- [ ] Display seller reviews
- [ ] Add "Contact Seller" button
- [ ] Show seller statistics (total sales, products)

#### 6.6 Customer Order Tracking
**Goal:** Customers can track orders from multiple sellers

**Tasks:**
- [ ] Build MyOrders.tsx page
- [ ] Group order items by seller in order details
- [ ] Show fulfillment status per seller
- [ ] Display tracking numbers per seller
- [ ] Add seller contact for each item
- [ ] Allow reviews for sellers after delivery

**Deliverables:**
- ✅ Customer Website running on port 3100
- ✅ Multi-seller product catalog
- ✅ Multi-seller shopping cart
- ✅ Order splitting at checkout
- ✅ Seller profile pages
- ✅ Order tracking by seller

---

### **PHASE 7: Reviews & Advanced Features (Weeks 11-12)**

#### 7.1 Seller Review System
**Goal:** Customers can review sellers

**Tasks:**
- [ ] Add seller review endpoints to Seller Service
- [ ] Build review form component
- [ ] Display seller reviews on seller profile
- [ ] Implement review moderation (admin approval)
- [ ] Add seller response to reviews
- [ ] Calculate seller rating automatically
- [ ] Send email notifications for new reviews

#### 7.2 Product Reviews (Optional)
**Goal:** Customers can review products

**Tasks:**
- [ ] Create product_reviews table
- [ ] Add product review endpoints
- [ ] Build product review form
- [ ] Display product reviews on product page
- [ ] Implement review voting (helpful/not helpful)

#### 7.3 Seller Analytics Dashboard
**Goal:** Advanced analytics for sellers

**Tasks:**
- [ ] Add analytics API endpoints
- [ ] Build comprehensive analytics dashboard
- [ ] Sales trends chart (daily/weekly/monthly)
- [ ] Top products by revenue
- [ ] Customer demographics
- [ ] Conversion funnel
- [ ] Export analytics reports

#### 7.4 Admin Marketplace Analytics
**Goal:** Platform-wide analytics for admin

**Tasks:**
- [ ] Build marketplace analytics dashboard
- [ ] Total GMV (Gross Merchandise Value)
- [ ] Platform commission revenue
- [ ] Active sellers/customers metrics
- [ ] Top sellers by revenue
- [ ] Top categories
- [ ] Order volume trends

**Deliverables:**
- ✅ Seller review system
- ✅ Advanced analytics
- ✅ Comprehensive reporting
- ✅ Platform insights

---

## 🏁 Implementation Timeline Summary

| Phase | Duration | Focus | Key Deliverables |
|-------|----------|-------|------------------|
| Phase 1 | Weeks 1-2 | Seller & Product Foundation | Seller Service, Product Service (seller-owned) |
| Phase 2 | Weeks 3-4 | Order Management | Order Service with multi-seller splitting |
| Phase 3 | Week 5 | Payout System | Payout Service, commission calculation |
| Phase 4 | Week 6 | Admin Dashboard | Seller management, product approval, payout processing |
| Phase 5 | Weeks 7-8 | Seller Dashboard | Seller operations, analytics, fulfillment |
| Phase 6 | Weeks 9-10 | Customer Website | Multi-seller marketplace, seller profiles |
| Phase 7 | Weeks 11-12 | Advanced Features | Reviews, analytics, reporting |

**Total Duration:** 12 weeks  
**Total Services:** 10 microservices (6 existing + 4 new)  
**Total Frontend Apps:** 3 (React Admin, Customer Website, Seller Dashboard)
- `POST /api/v1/attributes/:id/values` - Add predefined value
- `GET /api/v1/products/:id/attributes` - Get product attributes
- `POST /api/v1/products/:id/attributes` - Assign attribute to product
- `DELETE /api/v1/products/:productId/attributes/:attributeId` - Remove attribute

**Deliverables:**
- ✅ Flexible attribute system
- ✅ Support for 5 attribute types
- ✅ Normalized storage
- ✅ Faceted search capability

---

### **PHASE 3: Translation Integration (Week 4)**

#### 3.1 Content Translation for Products
**Goal:** Integrate Translation Service for multi-language product content

**Tasks:**
- [ ] Extend Product Service to support content translation
- [ ] Add translation methods to ProductService
- [ ] Implement `translateProduct()` method using Translation Service API
- [ ] Create `@TranslateContent()` decorator for automatic translation
- [ ] Add Accept-Language header support
- [ ] Implement translation for: name, description, short_description, meta_title, meta_description
- [ ] Create translation endpoints
- [ ] Add translation caching in Redis
- [ ] Update Product DTOs to include translated content
- [ ] Write tests for translation logic

**API Endpoints:**
- `GET /api/v1/products/:id?lang=fr` - Get translated product
- `GET /api/v1/products?lang=es` - List translated products
- `POST /api/v1/products/:id/translate` - Trigger translation for product

#### 3.2 Content Translation for Categories
**Goal:** Add translation support for categories

**Tasks:**
- [ ] Extend Category Service for translation
- [ ] Implement `translateCategory()` method
- [ ] Add translation for: name, description, meta_title, meta_description
- [ ] Update category endpoints to support lang parameter
- [ ] Add translation caching

**Deliverables:**
- ✅ Multi-language product catalog
- ✅ Multi-language category navigation
- ✅ Translation caching for performance

---

### **PHASE 4: Admin Dashboard Integration (Week 5)**

#### 4.1 Product Management UI
**Goal:** Build product management interface in React Admin

**Tasks:**
- [ ] Create product module in react-admin
- [ ] Create product labels (product-labels.ts)
- [ ] Create useProductLabels hook
- [ ] Build Products.tsx component (list view)
- [ ] Build ProductForm.tsx (create/edit)
- [ ] Build ProductDetails.tsx
- [ ] Add image upload component
- [ ] Add category selection (multi-select)
- [ ] Add attribute assignment UI
- [ ] Implement stock management UI
- [ ] Add product search and filters
- [ ] Implement pagination
- [ ] Add bulk operations (delete, activate, deactivate)
- [ ] Create product seeding script
- [ ] Add translation support (FR/ES labels)

**Features:**
- Product listing with search/filter/sort
- Create/Edit product form
- Image upload and management
- Category assignment
- Attribute management
- Stock tracking
- SEO fields (meta title, description)
- Multi-language support

#### 4.2 Category Management UI
**Goal:** Build category management interface

**Tasks:**
- [ ] Create category module in react-admin
- [ ] Create category labels (category-labels.ts)
- [ ] Create useCategoryLabels hook
- [ ] Build Categories.tsx (tree view)
- [ ] Build CategoryForm.tsx
- [ ] Implement drag-and-drop for reordering
- [ ] Add parent category selection
- [ ] Add slug auto-generation
- [ ] Implement category tree visualization
- [ ] Add translation support

#### 4.3 Order Management UI
**Goal:** Build order management interface

**Tasks:**
- [ ] Create order module in react-admin
- [ ] Create order labels (order-labels.ts)
- [ ] Create useOrderLabels hook
- [ ] Build Orders.tsx (list view)
- [ ] Build OrderDetails.tsx
- [ ] Add order status update UI
- [ ] Add payment status tracking
- [ ] Implement order timeline
- [ ] Add printing functionality (invoice, packing slip)
- [ ] Add order search and filters
- [ ] Implement order statistics dashboard
- [ ] Add translation support

**Deliverables:**
- ✅ Complete admin interface for ecommerce
- ✅ Product management
- ✅ Category management
- ✅ Order management
- ✅ Multi-language UI

---

### **PHASE 5: Customer Frontend (Weeks 6-7)**

#### 5.1 Customer Website Setup
**Goal:** Create new React application for ecommerce storefront

**Tasks:**
- [ ] Create new React app: `customer-website`
- [ ] Setup project structure
- [ ] Add Tailwind CSS
- [ ] Add React Router
- [ ] Add React Query for data fetching
- [ ] Setup environment variables
- [ ] Create shared hooks (useProducts, useCategories, useCart)
- [ ] Implement translation hook (useTranslation)
- [ ] Add language switcher
- [ ] Create layout components (Header, Footer, Navigation)

#### 5.2 Product Catalog Pages
**Goal:** Build product browsing and search

**Tasks:**
- [ ] Create Home page with featured products
- [ ] Build Product Listing Page (PLP)
- [ ] Build Product Detail Page (PDP)
- [ ] Add category navigation
- [ ] Implement product search
- [ ] Add product filters (attributes, price, category)
- [ ] Implement sorting (price, name, newest)
- [ ] Add pagination
- [ ] Build product image gallery
- [ ] Add product reviews section (placeholder)
- [ ] Implement breadcrumbs
- [ ] Add SEO meta tags

#### 5.3 Shopping Cart
**Goal:** Implement shopping cart functionality

**Tasks:**
- [ ] Create cart context (React Context API or Zustand)
- [ ] Build Cart component (sidebar/modal)
- [ ] Implement add to cart
- [ ] Implement remove from cart
- [ ] Implement quantity update
- [ ] Add cart total calculation
- [ ] Persist cart in localStorage
- [ ] Add cart icon with item count
- [ ] Build Cart Page
- [ ] Add empty cart state

#### 5.4 Checkout Process
**Goal:** Build checkout flow

**Tasks:**
- [ ] Create checkout page (multi-step)
- [ ] Step 1: Shipping information
- [ ] Step 2: Shipping method (carrier selection)
- [ ] Step 3: Payment method (placeholder)
- [ ] Step 4: Order review
- [ ] Implement form validation
- [ ] Add order summary sidebar
- [ ] Create order confirmation page
- [ ] Implement order creation API call
- [ ] Add error handling
- [ ] Send confirmation email (placeholder)

#### 5.5 Customer Account
**Goal:** Customer account management

**Tasks:**
- [ ] Create login/register pages
- [ ] Build account dashboard
- [ ] Add order history page
- [ ] Build order details page
- [ ] Add order tracking
- [ ] Implement profile editing
- [ ] Add address book
- [ ] Create wishlist (optional)

**Deliverables:**
- ✅ Customer-facing ecommerce website
- ✅ Product catalog
- ✅ Shopping cart
- ✅ Checkout process
- ✅ Customer account
- ✅ Multi-language support

---

### **PHASE 6: Advanced Features (Week 8)**

#### 6.1 Inventory Management
**Goal:** Add advanced stock tracking

**Tasks:**
- [ ] Create stock movement log table
- [ ] Implement stock adjustment endpoint
- [ ] Add low stock alerts
- [ ] Build inventory dashboard in admin
- [ ] Add bulk stock update
- [ ] Implement stock reservation on order
- [ ] Add stock reports

#### 6.2 Search Optimization
**Goal:** Improve product search

**Tasks:**
- [ ] Implement Elasticsearch integration (optional)
- [ ] Add fulltext search using MySQL
- [ ] Implement search suggestions
- [ ] Add search analytics
- [ ] Create search results page improvements

#### 6.3 Analytics & Reporting
**Goal:** Add business intelligence

**Tasks:**
- [ ] Create sales dashboard
- [ ] Add revenue reports
- [ ] Implement top products report
- [ ] Add customer analytics
- [ ] Create order status reports
- [ ] Add inventory reports

**Deliverables:**
- ✅ Advanced inventory management
- ✅ Enhanced search
- ✅ Analytics dashboard

---

## 🔧 Technical Stack Summary

### Backend (Microservices)
| Service | Port | Database Port | Technology | Purpose |
|---------|------|---------------|------------|---------|
| Auth Service | 3001 | 3306 (shared) | NestJS + TypeORM | Authentication |
| User Service | 3003 | 3306 (shared) | NestJS + TypeORM | User management |
| Customer Service | 3004 | 3304 | NestJS + TypeORM | Customer data |
| Carrier Service | 3005 | 3305 | NestJS + TypeORM | Shipping carriers |
| Pricing Service | 3006 | 3306 | NestJS + TypeORM | Pricing rules |
| Translation Service | 3007 | 3307 | NestJS + TypeORM | Multi-language |
| **Product Service** | **3008** | **3308** | **NestJS + TypeORM** | **Products + Categories (Seller-Owned)** |
| **Order Service** | **3009** | **3309** | **NestJS + TypeORM** | **Multi-Seller Order Processing** |
| **Seller Service** | **3010** | **3310** | **NestJS + TypeORM** | **Seller Management & Verification** |
| **Payout Service** | **3011** | **3311** | **NestJS + TypeORM** | **Commission & Seller Payouts** |

### Frontend Applications
| Application | Port | Technology | Purpose |
|-------------|------|------------|---------|
| React Admin | 3000 | React + TypeScript + Tailwind | Platform admin dashboard |
| **Customer Website** | **3100** | **React + TypeScript + Tailwind** | **Multi-seller marketplace storefront** |
| **Seller Dashboard** | **3200** | **React + TypeScript + Tailwind** | **Seller operations & analytics** |

### Shared Infrastructure
- **Shared MySQL Database** (3306) - Auth + User services
- **Shared Redis** (6379) - Caching layer for all services
- **Service Databases** - Independent MySQL per service (3308-3311)

### Key Technologies
- **NestJS** - Backend framework
- **TypeORM** - ORM with migrations
- **MySQL 8.0** - Relational database
- **Redis** - Caching and sessions
- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Class Validator** - Input validation
- **JWT** - Authentication
- **Docker** - Containerization
- **Cron Jobs** - Scheduled payout generation

### Marketplace-Specific Features
- **Seller Verification** - Manual admin approval workflow
- **Product Approval** - Draft → Pending → Approved/Rejected
- **Order Splitting** - Automatic split by seller
- **Commission System** - Configurable per-seller rates (default 15%)
- **Automated Payouts** - Weekly/monthly scheduled generation
- **Multi-Seller Cart** - Cart can contain items from multiple sellers
- **Fulfillment Tracking** - Per-seller shipment tracking
- **Seller Reviews** - Customer ratings and feedback

---

## 📈 Success Metrics

### Performance Targets
- **API Response Time**: < 200ms for 95th percentile
- **Database Queries**: < 100ms for product searches
- **Page Load Time**: < 2s for product pages
- **Cart Operations**: < 50ms
- **Checkout Process**: < 5s total

### Scalability Targets
- Support **10,000+ products** initially
- Support **100+ categories**
- Support **1,000+ orders/day**
- Support **100+ concurrent users**

### Quality Targets
- **Unit Test Coverage**: > 80%
- **Integration Test Coverage**: > 70%
- **Zero Critical Bugs** in production
- **API Uptime**: 99.9%

---

## 🚀 Getting Started (Phase 1 - Week 1)

### Prerequisites
- All existing services running
- Docker Desktop installed
- Node.js 18+ installed
- MySQL client installed
- Postman installed

### Step 1: Create Product Service
```bash
# Navigate to project root
cd /opt/cursor-project/fullstack-project

# Create new service
npx @nestjs/cli new product-service

# Navigate to service
cd product-service

# Install dependencies
npm install @nestjs/typeorm typeorm mysql2 class-validator class-transformer
npm install @nestjs/config redis
npm install -D @types/node

# Create directory structure
mkdir -p src/{domain,application,infrastructure,interfaces}
mkdir -p src/domain/{entities,repositories}
mkdir -p src/application/{services,dtos}
mkdir -p src/infrastructure/{database,redis,config}
mkdir -p src/interfaces/http
```

### Step 2: Setup Database
```bash
# Create Docker Compose file
# Add MySQL container on port 3308
# Add service configuration
```

### Step 3: Implement Clean Architecture
```bash
# Follow existing patterns from:
# - auth-service
# - customer-service
# - translation-service
```

---

## 📋 Detailed Task Breakdown (Week 1 - Product Service)

### Day 1-2: Project Setup & Entity Design
- [ ] Create NestJS project structure
- [ ] Setup TypeORM with migrations
- [ ] Design Product entity
- [ ] Design ProductImage entity
- [ ] Create database migrations
- [ ] Setup Docker Compose
- [ ] Configure environment variables

### Day 3-4: Repository & Service Layer
- [ ] Implement ProductRepository (extends BaseTypeOrmRepository)
- [ ] Implement ProductService (domain logic)
- [ ] Create Product DTOs (Create, Update, Response)
- [ ] Add validation decorators
- [ ] Implement error handling
- [ ] Add Redis caching layer

### Day 5: API Layer & Testing
- [ ] Create ProductController
- [ ] Implement REST endpoints
- [ ] Add response transformation
- [ ] Write unit tests
- [ ] Create Postman collection
- [ ] Test all endpoints

---

## 🎯 Priority Matrix

### Must Have (Phase 1-3)
- ✅ Product Service with CRUD
- ✅ Category Service with hierarchy
- ✅ Order Service with workflow
- ✅ Product attributes system
- ✅ Translation integration

### Should Have (Phase 4-5)
- ✅ Admin dashboard for products
- ✅ Admin dashboard for orders
- ✅ Customer website
- ✅ Shopping cart
- ✅ Basic checkout

### Nice to Have (Phase 6)
- ⭐ Advanced inventory
- ⭐ Enhanced search
- ⭐ Analytics dashboard
- ⭐ Customer reviews
- ⭐ Wishlist

---

## 🔒 Security Considerations

### Authentication & Authorization
- All ecommerce APIs require JWT authentication
- Role-based access control (RBAC)
- Admin-only endpoints for management
- Customer-only endpoints for orders

### Data Protection
- Encrypt sensitive customer data
- Secure payment information (PCI DSS compliance)
- HTTPS only for customer website
- Input validation on all endpoints
- SQL injection prevention (TypeORM parameterized queries)

### Rate Limiting
- Implement rate limiting on public APIs
- Prevent cart abuse
- Protect order creation endpoint

---

## 📚 Documentation Requirements

### API Documentation
- Postman collections for all services
- API endpoint documentation
- Request/response examples
- Error code documentation

### Developer Documentation
- Architecture diagrams
- Database schema documentation
- Setup guides
- Deployment guides

### User Documentation
- Admin user guide
- Customer user guide
- FAQ section

---

## 🧪 Testing Strategy

### Unit Tests
- Service layer business logic
- Repository methods
- Utility functions
- Target: >80% coverage

### Integration Tests
- API endpoint tests
- Database integration
- Service-to-service communication
- Cache integration

### E2E Tests
- Complete user flows
- Checkout process
- Order creation
- Product search

---

## 🚢 Deployment Strategy

### Development Environment
- Local Docker Compose
- All services on localhost
- Hot reload enabled

### Staging Environment
- Cloud deployment (GCP/AWS)
- Separate database instances
- SSL certificates
- Performance monitoring

### Production Environment
- High availability setup
- Database replication
- Load balancing
- Auto-scaling
- Monitoring and alerting

---

## 📞 Support & Maintenance

### Monitoring
- Service health checks
- API performance monitoring
- Database performance monitoring
- Error tracking (Sentry/New Relic)

### Backup Strategy
- Daily database backups
- Transaction log backups
- Backup retention: 30 days

### Maintenance Windows
- Weekly maintenance window
- Database optimization
- Cache clearing
- Log rotation

---

## 🎓 Learning Resources

### NestJS Clean Architecture
- Review existing services (auth-service, translation-service)
- Follow BaseTypeOrmRepository pattern
- Use existing error handling patterns

### TypeORM Migrations
- Check migration setup in pricing-service
- Check migration setup in translation-service
- Follow same migration patterns

### React Admin Patterns
- Review existing modules (Users, Customers, Carriers, Roles)
- Follow label structure patterns
- Use existing hooks (useLabels, React Query)

---

**Next Steps:**
1. Review this plan with stakeholders
2. Get approval for Phase 1 (Weeks 1-2)
3. Start with Product Service implementation
4. Follow clean architecture patterns from existing services
5. Maintain code quality and test coverage

**Questions to Answer:**
- Do we need a separate Cart Service or frontend-only cart?
- Do we need Inventory Service or include in Product Service?
- Payment gateway integration timeline?
- Email notification service needed?
- Image storage solution (local, S3, CDN)?

---

**Created by:** AI Assistant  
**Last Updated:** October 29, 2025  
**Status:** Ready for Review
