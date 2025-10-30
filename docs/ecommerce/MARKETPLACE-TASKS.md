# 🏪 Multi-Seller Marketplace - Detailed Task Breakdown

**Created:** October 30, 2025  
**Priority:** HIGH - Core Marketplace Features  
**Duration:** 12 weeks  
**Focus:** Seller Management, Product Ownership, Order Splitting, Payouts

---

## 🎯 Overview

This document provides a **week-by-week, day-by-day task breakdown** for implementing the multi-seller marketplace. Each task includes acceptance criteria, estimated time, and dependencies.

**Note:** Attribute Groups feature is deferred to Phase 7 (Week 11-12) to focus on core marketplace functionality first.

---

## 📅 WEEK 1: Seller Service Foundation

### **Day 1: Seller Service Setup** (8 hours)

#### Tasks:
- [x] **Task 1.1:** Create `seller-service` directory structure
  - Time: 30 minutes
  - Create NestJS project: `npx @nestjs/cli new seller-service`
  - Setup clean architecture folders
  - Configure TypeScript, ESLint

- [x] **Task 1.2:** Setup Database Configuration
  - Time: 30 minutes
  - Create docker-compose.yml for seller-db (port 3310)
  - Configure MySQL container
  - Setup .env file
  - Test database connection

- [x] **Task 1.3:** Configure TypeORM
  - Time: 1 hour
  - Install dependencies: `@nestjs/typeorm`, `typeorm`, `mysql2`
  - Create TypeORM configuration
  - Setup migrations infrastructure
  - Configure synchronize: false, migrationsRun: true

- [x] **Task 1.4:** Create Seller Entity
  - Time: 2 hours
  - File: `src/domain/entities/seller.entity.ts`
  - 25+ columns (user_id, business_name, status, verification_status, etc.)
  - Add indexes (user_id, status, verification_status, rating)
  - Relations: user, products, reviews

- [x] **Task 1.5:** Create Initial Migration
  - Time: 1 hour
  - Generate migration: `npm run migration:generate -- CreateSellersTable`
  - Review migration SQL
  - Run migration: `npm run migration:run`
  - Verify tables created

- [x] **Task 1.6:** Create SellerRepository
  - Time: 2 hours
  - File: `src/domain/repositories/seller.repository.ts`
  - Extend BaseTypeOrmRepository pattern
  - Methods: create, findById, findByUserId, findAll, update, delete
  - Add filtering methods: findByStatus, findPendingVerification

- [x] **Task 1.7:** Write Unit Tests
  - Time: 1 hour
  - Test entity creation
  - Test repository methods
  - Test migrations
  - Ensure >80% coverage

**Deliverables:**
- ✅ Seller Service running on port 3010
- ✅ Database running on port 3310
- ✅ Seller entity with all fields
- ✅ Initial migration executed
- ✅ Repository with CRUD operations
- ✅ Unit tests passing

---

### **Day 2: Seller Business Logic** (8 hours)

#### Tasks:
- [x] **Task 2.1:** Create DTOs
  - Time: 2 hours
  - CreateSellerDto (validation rules)
  - UpdateSellerDto (partial update)
  - SellerResponseDto (exclude sensitive data)
  - SellerFilterDto (search/filter)

- [x] **Task 2.2:** Create SellerService (Domain Layer)
  - Time: 3 hours
  - File: `src/domain/services/seller.service.ts`
  - Business logic methods:
    - `registerSeller(userId, data)` - Create seller account
    - `updateProfile(sellerId, data)` - Update seller info
    - `submitForVerification(sellerId)` - Change status to 'pending'
    - `approveSeller(sellerId, approvedById)` - Admin approval
    - `rejectSeller(sellerId, reason)` - Admin rejection
    - `suspendSeller(sellerId, reason)` - Admin suspension
    - `calculateRating(sellerId)` - Update seller rating

- [x] **Task 2.3:** Add Validation Rules
  - Time: 1 hour
  - Business name validation
  - Email/phone validation
  - Tax ID format validation (optional)
  - Banking info validation

- [x] **Task 2.4:** Implement Status Workflow
  - Time: 1 hour
  - State machine: pending → verified/rejected → active/suspended
  - Validate state transitions
  - Log status changes

- [x] **Task 2.5:** Write Service Tests
  - Time: 1 hour
  - Test seller registration
  - Test verification workflow
  - Test status transitions
  - Mock repository

**Deliverables:**
- ✅ Complete DTOs with validation
- ✅ SellerService with business logic
- ✅ Status workflow implementation
- ✅ Unit tests >80% coverage

---

### **Day 3: Seller API Endpoints** (8 hours)

#### Tasks:
- [x] **Task 3.1:** Create SellerController
  - Time: 3 hours
  - File: `src/interfaces/http/seller.controller.ts`
  - Endpoints:
    - `POST /api/v1/sellers` - Register seller
    - `GET /api/v1/sellers` - List sellers (admin)
    - `GET /api/v1/sellers/:id` - Get seller details
    - `GET /api/v1/sellers/user/:userId` - Get by user ID
    - `PATCH /api/v1/sellers/:id` - Update seller
    - `DELETE /api/v1/sellers/:id` - Delete seller
    - `POST /api/v1/sellers/:id/verify` - Submit for verification
    - `POST /api/v1/sellers/:id/approve` - Admin approve
    - `POST /api/v1/sellers/:id/reject` - Admin reject
    - `POST /api/v1/sellers/:id/suspend` - Admin suspend

- [x] **Task 3.2:** Add Authorization Guards
  - Time: 2 hours
  - SellerOwnerGuard - Seller can only edit own profile
  - AdminGuard - Admin endpoints require admin role
  - Integrate with Auth Service JWT

- [x] **Task 3.3:** Add Response Transformation
  - Time: 1 hour
  - TransformInterceptor for consistent responses
  - Exclude sensitive fields (banking info)
  - Format dates, enums

- [x] **Task 3.4:** Add Error Handling
  - Time: 1 hour
  - HttpExceptionFilter
  - Custom exceptions: SellerNotFoundException, InvalidStatusTransitionException
  - Validation error responses

- [x] **Task 3.5:** Create Postman Collection
  - Time: 1 hour
  - All 10 endpoints
  - Test data examples
  - Environment variables

**Deliverables:**
- ✅ SellerController with 10 endpoints
- ✅ Authorization guards configured
- ✅ Error handling implemented
- ✅ Postman collection created
- ✅ API documentation

---

### **Day 4: Integration with User Service** (8 hours)

#### Tasks:
- [x] **Task 4.1:** Create UserServiceClient
  - Time: 2 hours
  - File: `src/infrastructure/external-services/user-service.client.ts`
  - Methods:
    - `getUser(userId)` - Fetch user details
    - `updateUserRole(userId, role)` - Set 'seller' role
  - Handle HTTP errors
  - Add timeout, retry logic

- [x] **Task 4.2:** Update User Service
  - Time: 2 hours
  - Navigate to user-service
  - Add 'seller' role to UserRole enum
  - Create endpoint: `PATCH /api/v1/users/:id/role`
  - Add role validation

- [x] **Task 4.3:** Seller Registration Flow
  - Time: 2 hours
  - When seller registers:
    1. Verify user exists (call User Service)
    2. Check user doesn't already have seller account
    3. Create seller record
    4. Update user role to 'seller' (call User Service)
    5. Send verification email (placeholder)
  - Transaction handling

- [x] **Task 4.4:** Add Redis Caching
  - Time: 1 hour
  - Cache seller details (TTL: 1 hour)
  - Cache invalidation on update
  - Cache key pattern: `seller:{id}`

- [x] **Task 4.5:** Integration Tests
  - Time: 1 hour
  - Test registration flow end-to-end
  - Test User Service integration
  - Test error scenarios

**Deliverables:**
- ✅ User Service integration working
- ✅ Seller registration flow complete
- ✅ Redis caching implemented
- ✅ Integration tests passing

---

### **Day 5: Seller Analytics & Health Checks** (8 hours)

#### Tasks:
- [x] **Task 5.1:** Add Seller Metrics Columns
  - Time: 1 hour
  - Create migration to add:
    - `total_products INT DEFAULT 0`
    - `total_sales INT DEFAULT 0`
    - `total_revenue DECIMAL(12,2) DEFAULT 0`
  - Run migration

- [x] **Task 5.2:** Create Analytics Methods
  - Time: 2 hours
  - `updateProductCount(sellerId)` - Increment/decrement
  - `recordSale(sellerId, amount)` - Update sales metrics
  - `getSellerStats(sellerId)` - Return metrics
  - Scheduled job placeholder

- [x] **Task 5.3:** Add Health Check Endpoint
  - Time: 1 hour
  - Endpoint: `GET /health`
  - Check database connection
  - Check Redis connection
  - Return service status

- [x] **Task 5.4:** Add Logging
  - Time: 2 hours
  - Winston logger integration
  - Log all status changes
  - Log admin actions (approve, reject, suspend)
  - Structured logging format

- [x] **Task 5.5:** Documentation & README
  - Time: 2 hours
  - Create seller-service/README.md
  - API documentation
  - Setup instructions
  - Environment variables
  - Testing instructions

**Deliverables:**
- ✅ Seller analytics methods
- ✅ Health check endpoint
- ✅ Logging configured
- ✅ Complete README
- ✅ Service ready for Week 2

---

## 📅 WEEK 2: Product Service with Seller Integration

### **Day 1: Product Service Setup** (8 hours)

#### Tasks:
- [x] **Task 6.1:** Create Product Service
  - Time: 30 minutes
  - Create NestJS project: `npx @nestjs/cli new product-service`
  - Setup clean architecture

- [x] **Task 6.2:** Setup Database
  - Time: 30 minutes
  - Docker compose for product-db (port 3308)
  - Configure TypeORM

- [x] **Task 6.3:** Create Product Entity (WITH seller_id)
  - Time: 2 hours
  - File: `src/domain/entities/product.entity.ts`
  - **CRITICAL:** Add `seller_id INT NOT NULL` column
  - Add `approval_status ENUM('draft', 'pending', 'approved', 'rejected')`
  - Foreign key to sellers table
  - All other product fields (sku, name, price, etc.)

- [x] **Task 6.4:** Create Category Entity
  - Time: 2 hours
  - File: `src/domain/entities/category.entity.ts`
  - Hierarchical structure (parent_id)
  - slug, name, description

- [x] **Task 6.5:** Create ProductImage Entity
  - Time: 1 hour
  - File: `src/domain/entities/product-image.entity.ts`
  - One-to-many with Product
  - imageUrl, altText, isPrimary, sortOrder

- [x] **Task 6.6:** Create Migrations
  - Time: 1 hour
  - Generate and run migrations for all 3 tables
  - Verify foreign keys

- [x] **Task 6.7:** Create Repositories
  - Time: 1 hour
  - ProductRepository
  - CategoryRepository
  - Both extend BaseTypeOrmRepository

**Deliverables:**
- ✅ Product Service running on port 3008
- ✅ Database on port 3308
- ✅ Product, Category, ProductImage entities
- ✅ Migrations executed
- ✅ Repositories created

---

### **Day 2: Product Business Logic** (8 hours)

#### Tasks:
- [x] **Task 7.1:** Create Product DTOs
  - Time: 2 hours
  - CreateProductDto (with sellerId validation)
  - UpdateProductDto
  - ProductResponseDto
  - ProductFilterDto (filter by seller, category, status)

- [x] **Task 7.2:** Create ProductService
  - Time: 3 hours
  - Methods:
    - `createProduct(sellerId, data)` - Create draft product
    - `updateProduct(productId, sellerId, data)` - Seller edits
    - `deleteProduct(productId, sellerId)` - Seller deletes
    - `submitForApproval(productId, sellerId)` - Change to 'pending'
    - `approveProduct(productId, adminId)` - Admin approval
    - `rejectProduct(productId, adminId, reason)` - Admin rejection
    - `getSellerProducts(sellerId, filters)` - Seller's products
    - `findById(productId)` - Get product details

- [x] **Task 7.3:** Add Product Approval Workflow
  - Time: 2 hours
  - Status transitions: draft → pending → approved/rejected
  - Only approved products visible to customers
  - Sellers can edit rejected products
  - Email notifications (placeholder)

- [x] **Task 7.4:** Write Service Tests
  - Time: 1 hour
  - Test product creation with seller
  - Test approval workflow
  - Test ownership validation

**Deliverables:**
- ✅ Complete Product DTOs
- ✅ ProductService with seller integration
- ✅ Approval workflow implemented
- ✅ Unit tests passing

---

### **Day 3: Product API with Seller Authorization** (8 hours)

#### Tasks:
- [x] **Task 8.1:** Create ProductController
  - Time: 3 hours
  - Seller endpoints:
    - `POST /api/v1/sellers/:sellerId/products` - Create product
    - `GET /api/v1/sellers/:sellerId/products` - List seller products
    - `PATCH /api/v1/products/:id` - Update (owner only)
    - `DELETE /api/v1/products/:id` - Delete (owner only)
    - `POST /api/v1/products/:id/submit` - Submit for approval
  - Public endpoints:
    - `GET /api/v1/products` - List approved products
    - `GET /api/v1/products/:id` - Get product (if approved)
  - Admin endpoints:
    - `GET /api/v1/products/pending` - Pending approvals
    - `POST /api/v1/products/:id/approve` - Approve
    - `POST /api/v1/products/:id/reject` - Reject

- [x] **Task 8.2:** Add Authorization Guards
  - Time: 2 hours
  - ProductOwnerGuard - Verify product belongs to seller
  - SellerGuard - Require seller role
  - AdminGuard - Admin-only endpoints
  - Check JWT claims

- [x] **Task 8.3:** Create CategoryController
  - Time: 2 hours
  - `POST /api/v1/categories` - Create (admin)
  - `GET /api/v1/categories` - List all
  - `GET /api/v1/categories/tree` - Hierarchical tree
  - `GET /api/v1/categories/:id` - Get details
  - `PATCH /api/v1/categories/:id` - Update (admin)
  - `DELETE /api/v1/categories/:id` - Delete (admin)

- [x] **Task 8.4:** Create Postman Collection
  - Time: 1 hour
  - All product endpoints
  - Category endpoints
  - Test scenarios

**Deliverables:**
- ✅ ProductController with seller authorization
- ✅ CategoryController
- ✅ Authorization guards working
- ✅ Postman collection

---

### **Day 4: Seller Service Integration** (8 hours)

#### Tasks:
- [x] **Task 9.1:** Create SellerServiceClient
  - Time: 2 hours
  - File: `src/infrastructure/external-services/seller-service.client.ts`
  - Methods:
    - `getSeller(sellerId)` - Verify seller exists
    - `validateSellerActive(sellerId)` - Check status is 'active'
    - `incrementProductCount(sellerId)` - Update metrics

- [x] **Task 9.2:** Add Seller Validation in Product Creation
  - Time: 2 hours
  - Before creating product:
    1. Verify seller exists (call Seller Service)
    2. Verify seller is 'active' status
    3. Verify seller is 'verified'
  - Return appropriate error if validation fails

- [x] **Task 9.3:** Auto-update Seller Metrics
  - Time: 2 hours
  - When product created → increment seller.total_products
  - When product deleted → decrement seller.total_products
  - When product approved → log event
  - Call Seller Service API

- [x] **Task 9.4:** Add Redis Caching
  - Time: 1 hour
  - Cache product details
  - Cache category tree
  - Cache invalidation strategy

- [x] **Task 9.5:** Integration Tests
  - Time: 1 hour
  - Test product creation with seller validation
  - Test seller metrics updates
  - Test error scenarios

**Deliverables:**
- ✅ Seller Service integration
- ✅ Seller validation working
- ✅ Metrics auto-update
- ✅ Integration tests passing

---

### **Day 5: Product Search & Documentation** (8 hours)

#### Tasks:
- [x] **Task 10.1:** Add Search Functionality
  - Time: 2 hours
  - Endpoint: `GET /api/v1/products/search?q=laptop`
  - Fulltext search on name, description
  - Filter by category, seller, price range
  - Pagination, sorting

- [x] **Task 10.2:** Add Stock Management
  - Time: 2 hours
  - Endpoint: `PATCH /api/v1/products/:id/stock`
  - Methods:
    - `updateStock(productId, quantity)` - Set stock
    - `incrementStock(productId, amount)` - Add stock
    - `decrementStock(productId, amount)` - Reduce stock
    - `reserveStock(productId, amount)` - For orders
  - Prevent negative stock

- [x] **Task 10.3:** Add Low Stock Alerts
  - Time: 1 hour
  - Endpoint: `GET /api/v1/sellers/:sellerId/products/low-stock`
  - Return products where stock <= min_stock
  - Notification placeholder

- [x] **Task 10.4:** Health Check & Logging
  - Time: 1 hour
  - Health check endpoint
  - Winston logging
  - Log product approvals, rejections

- [x] **Task 10.5:** Documentation
  - Time: 2 hours
  - product-service/README.md
  - API documentation
  - Setup instructions
  - Seller workflow guide

**Deliverables:**
- ✅ Product search working
- ✅ Stock management implemented
- ✅ Low stock alerts
- ✅ Complete documentation
- ✅ Week 2 complete

---

## 📅 WEEK 3: Order Service with Multi-Seller Support

### **Day 1: Order Service Setup** (8 hours)

#### Tasks:
- [x] **Task 11.1:** Create Order Service
  - Time: 30 minutes
  - NestJS project: `npx @nestjs/cli new order-service`

- [x] **Task 11.2:** Setup Database
  - Time: 30 minutes
  - Docker compose for order-db (port 3309)

- [x] **Task 11.3:** Create Order Entity (WITH seller_id in items)
  - Time: 3 hours
  - File: `src/domain/entities/order.entity.ts`
  - Fields: order_number, customer_id, status, payment_status, total, shipping_address, etc.
  - **CRITICAL:** Add indexes for querying by customer, seller

- [x] **Task 11.4:** Create OrderItem Entity
  - Time: 2 hours
  - File: `src/domain/entities/order-item.entity.ts`
  - **CRITICAL FIELDS:**
    - `seller_id INT NOT NULL` - Which seller owns this item
    - `product_snapshot JSON` - Product data at order time
    - `commission_rate DECIMAL(5,2)` - Platform fee %
    - `commission_amount DECIMAL(10,2)` - Calculated fee
    - `seller_payout DECIMAL(10,2)` - Amount to seller
    - `fulfillment_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled')`
    - `tracking_number VARCHAR(255)`

- [x] **Task 11.5:** Create Migrations
  - Time: 1 hour
  - Generate migrations
  - Run migrations
  - Verify tables

- [x] **Task 11.6:** Create Repositories
  - Time: 1 hour
  - OrderRepository
  - OrderItemRepository

**Deliverables:**
- ✅ Order Service on port 3009
- ✅ Database on port 3309
- ✅ Order & OrderItem entities with seller_id
- ✅ Migrations executed
- ✅ Repositories created

---

### **Day 2: Order Business Logic with Seller Splitting** (8 hours)

#### Tasks:
- [x] **Task 12.1:** Create Order DTOs
  - Time: 2 hours
  - CreateOrderDto (cart items with seller info)
  - OrderResponseDto (group items by seller)
  - OrderItemDto

- [x] **Task 12.2:** Create OrderService
  - Time: 4 hours
  - **CRITICAL METHOD:** `createOrder(customerId, cartItems)`
    - Calculate totals per seller
    - Calculate commission per item
    - Calculate seller payouts
    - Create order record
    - Create order_items with seller_id for each item
    - Store product snapshot (name, price, sku at order time)
  - Methods:
    - `getOrder(orderId)` - Get order details
    - `getCustomerOrders(customerId)` - Customer's orders
    - `getSellerOrders(sellerId)` - Seller's order items
    - `updateOrderStatus(orderId, status)` - Admin update
    - `updateItemFulfillment(itemId, sellerId, status)` - Seller ships item

- [x] **Task 12.3:** Commission Calculation Logic
  - Time: 1 hour
  - For each order item:
    ```
    item_total = unit_price * quantity
    commission = item_total * commission_rate
    seller_payout = item_total - commission
    ```
  - Store in order_items table

- [x] **Task 12.4:** Write Service Tests
  - Time: 1 hour
  - Test order creation with multiple sellers
  - Test commission calculation
  - Test order splitting

**Deliverables:**
- ✅ Order DTOs
- ✅ OrderService with seller splitting
- ✅ Commission calculation working
- ✅ Unit tests passing

---

### **Day 3: Order API Endpoints** (8 hours)

#### Tasks:
- [x] **Task 13.1:** Create OrderController
  - Time: 3 hours
  - Customer endpoints:
    - `POST /api/v1/orders` - Create order
    - `GET /api/v1/customers/:customerId/orders` - My orders
    - `GET /api/v1/orders/:id` - Order details
  - Seller endpoints:
    - `GET /api/v1/sellers/:sellerId/orders` - Seller's order items
    - `PATCH /api/v1/order-items/:id/fulfill` - Update fulfillment
    - `POST /api/v1/order-items/:id/ship` - Mark shipped, add tracking
  - Admin endpoints:
    - `GET /api/v1/orders` - All orders
    - `PATCH /api/v1/orders/:id/status` - Update status

- [x] **Task 13.2:** Add Authorization Guards
  - Time: 2 hours
  - CustomerOwnerGuard - Customer can only see own orders
  - SellerOrderGuard - Seller can only see/update own items
  - AdminGuard

- [x] **Task 13.3:** Order Status Workflow
  - Time: 2 hours
  - Order statuses: pending → processing → completed/cancelled
  - Item statuses: pending → processing → shipped → delivered
  - State transition validation

- [x] **Task 13.4:** Create Postman Collection
  - Time: 1 hour
  - All order endpoints
  - Multi-seller test scenarios

**Deliverables:**
- ✅ OrderController with seller separation
- ✅ Authorization guards
- ✅ Status workflow
- ✅ Postman collection

---

### **Day 4: External Service Integration** (8 hours)

#### Tasks:
- [x] **Task 14.1:** Create ProductServiceClient
  - Time: 2 hours
  - Methods:
    - `getProduct(productId)` - Get product details
    - `decrementStock(productId, quantity)` - Reserve stock
    - `incrementStock(productId, quantity)` - Return stock (cancellation)

- [x] **Task 14.2:** Create SellerServiceClient
  - Time: 2 hours
  - Methods:
    - `getSeller(sellerId)` - Get seller info
    - `recordSale(sellerId, amount)` - Update seller metrics

- [x] **Task 14.3:** Order Creation Flow
  - Time: 3 hours
  - When order created:
    1. Validate all products exist (call Product Service)
    2. Check stock availability
    3. Reserve stock for each item
    4. Get seller info for each item
    5. Calculate commission per seller
    6. Create order and items
    7. Update seller sales metrics
    8. Send notification (placeholder)

- [x] **Task 14.4:** Integration Tests
  - Time: 1 hour
  - Test full order creation flow
  - Test stock reservation
  - Test seller metrics update

**Deliverables:**
- ✅ Product Service integration
- ✅ Seller Service integration
- ✅ Order creation flow complete
- ✅ Integration tests passing

---

### **Day 5: Order Analytics & Documentation** (8 hours)

#### Tasks:
- [x] **Task 15.1:** Order Statistics Endpoints
  - Time: 2 hours
  - `GET /api/v1/sellers/:sellerId/analytics` - Seller sales stats
  - `GET /api/v1/admin/analytics` - Platform-wide stats
  - Metrics: total orders, revenue, commission

- [x] **Task 15.2:** Add Carrier Integration
  - Time: 2 hours
  - Call Carrier Service for shipping rates
  - Calculate shipping per seller
  - Store shipping info

- [x] **Task 15.3:** Health Check & Logging
  - Time: 1 hour
  - Health check endpoint
  - Winston logging
  - Log all status changes

- [x] **Task 15.4:** Documentation
  - Time: 2 hours
  - order-service/README.md
  - Order workflow documentation
  - Seller fulfillment guide

- [x] **Task 15.5:** Week 3 Testing
  - Time: 1 hour
  - End-to-end order flow test
  - Multi-seller order test
  - Commission calculation verification

**Deliverables:**
- ✅ Analytics endpoints
- ✅ Carrier integration
- ✅ Complete documentation
- ✅ Week 3 complete

---

## 📅 WEEK 4: Payout Service

### **Day 1: Payout Service Setup** (8 hours)

#### Tasks:
- [x] **Task 16.1:** Create Payout Service
  - Time: 30 minutes
  - NestJS project: `npx @nestjs/cli new payout-service`

- [x] **Task 16.2:** Setup Database
  - Time: 30 minutes
  - Docker compose for payout-db (port 3311)

- [x] **Task 16.3:** Create SellerPayout Entity
  - Time: 2 hours
  - Fields:
    - seller_id
    - payout_period_start, payout_period_end
    - gross_sales (total sales in period)
    - platform_commission (total fees)
    - net_payout (amount to seller)
    - status (pending, processing, paid, failed)
    - payment_method
    - transaction_reference
    - paid_at

- [x] **Task 16.4:** Create PayoutItem Entity (Optional)
  - Time: 1 hour
  - Link payout to individual orders
  - Track which orders are included

- [x] **Task 16.5:** Create Migrations & Repositories
  - Time: 2 hours
  - Generate migrations
  - Create PayoutRepository

- [x] **Task 16.6:** Write Tests
  - Time: 1 hour
  - Test entity creation
  - Test repository methods

**Deliverables:**
- ✅ Payout Service on port 3011
- ✅ Database on port 3311
- ✅ Payout entities
- ✅ Migrations executed

---

### **Day 2: Payout Calculation Logic** (8 hours)

#### Tasks:
- [x] **Task 17.1:** Create Payout DTOs
  - Time: 1 hour
  - GeneratePayoutDto
  - PayoutResponseDto
  - PayoutFilterDto

- [x] **Task 17.2:** Create PayoutService
  - Time: 4 hours
  - **CRITICAL METHOD:** `generatePayouts(periodStart, periodEnd)`
    - Query Order Service for completed orders in period
    - Group by seller_id
    - Sum seller_payout for each seller
    - Sum commission_amount for platform
    - Create payout records
  - Methods:
    - `getSellerPayouts(sellerId)` - Seller's payout history
    - `getPendingPayouts()` - Admin view
    - `processPayout(payoutId, paymentDetails)` - Mark as paid
    - `getPayoutDetails(payoutId)` - Detailed breakdown

- [x] **Task 17.3:** Add Payout Validation
  - Time: 1 hour
  - Minimum payout threshold (e.g., $50)
  - No duplicate payouts for same period
  - Seller must be active and verified

- [x] **Task 17.4:** Create OrderServiceClient
  - Time: 1 hour
  - Methods:
    - `getOrderItemsBySeller(sellerId, dateRange)` - Get items
    - `getCommissionBreakdown(sellerId, dateRange)` - Calculate totals

- [x] **Task 17.5:** Write Service Tests
  - Time: 1 hour
  - Test payout generation
  - Test commission calculation
  - Test validation rules

**Deliverables:**
- ✅ Payout DTOs
- ✅ PayoutService with calculation logic
- ✅ Order Service integration
- ✅ Unit tests passing

---

### **Day 3: Payout API & Scheduling** (8 hours)

#### Tasks:
- [x] **Task 18.1:** Create PayoutController
  - Time: 2 hours
  - Admin endpoints:
    - `POST /api/v1/payouts/generate` - Generate payouts for period
    - `GET /api/v1/payouts/pending` - List pending payouts
    - `POST /api/v1/payouts/:id/process` - Mark as paid
    - `GET /api/v1/payouts` - All payouts
  - Seller endpoints:
    - `GET /api/v1/sellers/:sellerId/payouts` - My payouts
    - `GET /api/v1/payouts/:id` - Payout details

- [x] **Task 18.2:** Add Scheduled Jobs
  - Time: 3 hours
  - Install: `@nestjs/schedule`
  - Weekly payout job (runs every Monday at 00:00):
    ```typescript
    @Cron('0 0 * * 1')
    async generateWeeklyPayouts() {
      const lastWeek = getLastWeekRange();
      await this.payoutService.generatePayouts(lastWeek.start, lastWeek.end);
    }
    ```
  - Monthly payout job (runs 1st of month)
  - Configurable via environment variable

- [x] **Task 18.3:** Add Payment Integration (Placeholder)
  - Time: 2 hours
  - Create payment provider interface
  - Stripe/PayPal placeholder
  - Mock payment processing
  - Real integration in future phase

- [x] **Task 18.4:** Create Postman Collection
  - Time: 1 hour
  - All payout endpoints
  - Test scenarios

**Deliverables:**
- ✅ PayoutController
- ✅ Scheduled payout generation
- ✅ Payment provider placeholder
- ✅ Postman collection

---

### **Day 4: Payout Notifications & Reporting** (8 hours)

#### Tasks:
- [x] **Task 19.1:** Add Email Notifications (Placeholder)
  - Time: 2 hours
  - When payout generated → email seller
  - When payout processed → email seller with details
  - Template structure (actual sending in future)

- [x] **Task 19.2:** Create Payout Reports
  - Time: 3 hours
  - Endpoint: `GET /api/v1/sellers/:sellerId/payout-report`
  - Generate PDF/CSV report:
    - Payout summary
    - Order breakdown
    - Commission details
  - Use library: `pdfkit` or `exceljs`

- [x] **Task 19.3:** Add Payout Disputes (Basic)
  - Time: 2 hours
  - Seller can flag payout as disputed
  - Admin can review and resolve
  - Basic workflow

- [x] **Task 19.4:** Integration Tests
  - Time: 1 hour
  - Test scheduled job
  - Test payout generation
  - Test report generation

**Deliverables:**
- ✅ Email notification placeholders
- ✅ Payout reports
- ✅ Dispute workflow
- ✅ Integration tests

---

### **Day 5: Payout Dashboard Data & Documentation** (8 hours)

#### Tasks:
- [x] **Task 20.1:** Create Payout Analytics Endpoints
  - Time: 2 hours
  - `GET /api/v1/sellers/:sellerId/earnings` - Total earnings
  - `GET /api/v1/sellers/:sellerId/commission-history` - Historical data
  - `GET /api/v1/admin/platform-revenue` - Platform totals

- [x] **Task 20.2:** Add Payout Dashboard Data
  - Time: 2 hours
  - Current balance (unpaid earnings)
  - Next payout date
  - Payout history
  - Commission rate

- [x] **Task 20.3:** Health Check & Logging
  - Time: 1 hour
  - Health check endpoint
  - Winston logging
  - Log payout generation, processing

- [x] **Task 20.4:** Documentation
  - Time: 2 hours
  - payout-service/README.md
  - Payout calculation formula
  - Scheduled jobs configuration
  - Payment provider integration guide

- [x] **Task 20.5:** Week 4 Testing
  - Time: 1 hour
  - End-to-end payout flow
  - Verify commission calculations
  - Test scheduled jobs

**Deliverables:**
- ✅ Analytics endpoints
- ✅ Dashboard data endpoints
- ✅ Complete documentation
- ✅ Week 4 complete
- ✅ **ALL BACKEND SERVICES COMPLETE**

---

## 📅 WEEK 5-6: Admin Dashboard (Seller Management)

### Overview
Extend existing React Admin (port 3000) with marketplace features.

### **Week 5: Core Admin Features**

#### Day 1-2: Seller Management UI (16 hours)
- [x] Create seller module in react-admin
- [x] Create seller labels: `seller-labels.ts`
- [x] Create `useSellerLabels` hook
- [x] Build `Sellers.tsx` component (list view)
  - Table columns: business_name, user_email, status, verification_status, rating, total_products, total_sales
  - Filters: status, verification_status, rating
  - Search: business_name, email
  - Sort: created_at, rating, total_sales
- [x] Build `SellerForm.tsx` (view/edit - read-only mostly)
- [x] Build `SellerDetails.tsx`
  - Business info
  - Verification status
  - Metrics (products, sales, revenue)
  - Action buttons (approve, reject, suspend)
- [x] Add seller approval workflow UI
  - Approve button → confirmation modal
  - Reject button → reason textarea
  - Suspend button → reason textarea
- [x] Add seller analytics dashboard
  - Sales chart
  - Product count
  - Rating breakdown

#### Day 3: Product Approval UI (8 hours)
- [x] Create product approval queue view
- [x] Filter products by approval_status = 'pending'
- [x] Show product details (name, sku, price, seller, images)
- [x] Approve/Reject buttons with reason
- [x] Bulk approve/reject functionality
- [x] Product preview modal

#### Day 4: Payout Management UI (8 hours)
- [x] Create payout module
- [x] Build `Payouts.tsx` list view
  - Table: seller, period, gross_sales, commission, net_payout, status
  - Filters: status, date range
- [x] Build `PayoutDetails.tsx`
  - Order breakdown
  - Commission calculation
  - Payment details
- [x] Add "Generate Payouts" button (admin action)
  - Date range picker
  - Preview before generation
- [x] Add "Process Payout" button
  - Payment method selection
  - Transaction reference input
  - Mark as paid

#### Day 5: Platform Analytics (8 hours)
- [x] Create admin analytics dashboard
- [x] Key metrics:
  - Total sellers (active, pending, suspended)
  - Total products (approved, pending, rejected)
  - Total orders
  - Total revenue
  - Total commission earned
- [x] Charts:
  - Revenue over time
  - Orders per seller
  - Commission by seller
  - Product approval rate
- [x] Export reports (CSV/PDF)

**Week 5 Deliverables:**
- ✅ Seller management UI complete
- ✅ Product approval workflow UI
- ✅ Payout management UI
- ✅ Admin analytics dashboard

---

### **Week 6: Advanced Admin Features**

#### Day 1: Commission Settings UI (8 hours)
- [x] Create commission settings page
- [x] Set default commission rate (platform-wide)
- [x] Set per-seller commission rates
- [x] Historical commission rate tracking
- [x] Commission rate effective dates

#### Day 2: Seller Reviews & Ratings (8 hours)
- [x] View seller reviews
- [x] Moderate reviews (approve/reject)
- [x] Respond to reviews as admin
- [x] Rating breakdown visualization

#### Day 3: Order Management (8 hours)
- [x] Extend orders view with seller info
- [x] Filter orders by seller
- [x] View order items grouped by seller
- [x] Track fulfillment status per seller
- [x] Handle order disputes

#### Day 4: Reporting & Exports (8 hours)
- [x] Generate seller reports
- [x] Generate payout reports
- [x] Generate commission reports
- [x] Export to Excel/PDF
- [x] Scheduled report emails (placeholder)

#### Day 5: Testing & Polish (8 hours)
- [x] End-to-end testing of admin flows
- [x] Fix bugs
- [x] UI/UX improvements
- [x] Responsive design check
- [x] Documentation

**Week 6 Deliverables:**
- ✅ All admin features complete
- ✅ Reporting system ready
- ✅ Admin dashboard fully functional

---

## 📅 WEEK 7-8: Seller Dashboard (New React App)

### Overview
Create NEW React application (port 3200) for seller operations.

### **Week 7: Seller Dashboard Foundation**

#### Day 1-2: Project Setup (16 hours)
- [x] Create React app: `npx create-react-app seller-dashboard`
- [x] Install dependencies:
  - React Query
  - React Router
  - Tailwind CSS
  - Axios
  - Chart.js
- [x] Setup authentication (JWT from Auth Service)
- [x] Create layout components:
  - SellerLayout with sidebar
  - Navigation menu
  - Header with logout
- [x] Create route structure:
  - /dashboard
  - /products
  - /orders
  - /payouts
  - /analytics
  - /settings

#### Day 3: Product Management UI (8 hours)
- [x] Build product list view
  - Show seller's products only
  - Filter by status (draft, pending, approved, rejected)
  - Search, sort, paginate
- [x] Build create product form
  - All product fields
  - Image upload
  - Category selection
  - Submit for approval button
- [x] Build edit product form
  - Can edit draft/rejected products
  - Cannot edit approved products (must create new version)
- [x] Product status badges
  - Draft (gray)
  - Pending (yellow)
  - Approved (green)
  - Rejected (red) - show rejection reason

#### Day 4: Order Management UI (8 hours)
- [x] Build order list view
  - Show only items belonging to this seller
  - Group by order (show order number)
  - Filter by fulfillment status
- [x] Build order details view
  - Product info
  - Customer info (masked)
  - Shipping address
  - Current status
- [x] Add fulfillment actions
  - Mark as processing
  - Mark as shipped (add tracking number)
  - Mark as delivered
- [x] Order timeline visualization

#### Day 5: Analytics Dashboard (8 hours)
- [x] Create seller analytics dashboard
- [x] Key metrics cards:
  - Total products
  - Total sales
  - Total revenue
  - Average rating
- [x] Charts:
  - Sales over time (line chart)
  - Revenue by product (pie chart)
  - Orders by status (bar chart)
- [x] Recent orders widget
- [x] Low stock alerts

**Week 7 Deliverables:**
- ✅ Seller dashboard app running
- ✅ Product management complete
- ✅ Order management complete
- ✅ Analytics dashboard

---

### **Week 8: Seller Dashboard Advanced Features**

#### Day 1: Payout UI (8 hours)
- [x] Build payout history view
  - Table: period, gross_sales, commission, net_payout, status
  - Filter by date range
- [x] Build payout details view
  - Order breakdown
  - Commission calculation
  - Payment info
- [x] Show current balance (unpaid earnings)
- [x] Show next payout date
- [x] Download payout report (PDF)

#### Day 2: Profile & Settings (8 hours)
- [x] Build seller profile page
  - Business info (read-only)
  - Contact info (editable)
  - Logo upload
  - Description (editable)
- [x] Build banking info page
  - Bank account details
  - Payment method preferences
  - Secure form handling
- [x] Build notification settings
  - Email preferences
  - Notification types

#### Day 3: Inventory Management (8 hours)
- [x] Build stock management view
- [x] Quick stock update
- [x] Low stock alerts dashboard
- [x] Bulk stock import (CSV)
- [x] Stock history log

#### Day 4: Customer Communication (8 hours)
- [x] View customer messages (placeholder)
- [x] Respond to reviews (placeholder)
- [x] Order notes/comments
- [x] Dispute resolution interface

#### Day 5: Testing & Polish (8 hours)
- [x] End-to-end testing
- [x] Responsive design
- [x] Bug fixes
- [x] Performance optimization
- [x] Documentation

**Week 8 Deliverables:**
- ✅ Seller dashboard complete
- ✅ All seller features working
- ✅ Ready for seller testing

---

## 📅 WEEK 9-10: Customer Website (Multi-Seller Marketplace)

### Overview
Create NEW React application (port 3100) for customers.

### **Week 9: Customer Website Foundation**

#### Day 1-2: Project Setup & Product Catalog (16 hours)
- [x] Create React app
- [x] Setup dependencies (same as seller dashboard)
- [x] Create layout (header, footer, navigation)
- [x] Build homepage
  - Featured products
  - Categories
  - Top sellers
- [x] Build product list page
  - Filter by category, price, seller
  - Search functionality
  - Pagination
  - Sort options
- [x] Build product detail page
  - Product info
  - Images gallery
  - **Seller badge** (name, rating)
  - Add to cart button
  - Reviews section

#### Day 3: Multi-Seller Cart (8 hours)
- [x] Implement cart state (React Context or Zustand)
- [x] Build cart component
  - **Group items by seller**
  - Show subtotal per seller
  - Show total
  - Remove items
  - Update quantity
- [x] Cart icon with item count
- [x] Persist cart in localStorage

#### Day 4: Seller Profiles (8 hours)
- [x] Build seller profile page
  - Business info
  - Logo, description
  - Rating and reviews
  - Products list
- [x] Seller reviews section
- [x] "Message Seller" button (placeholder)

#### Day 5: Category & Search (8 hours)
- [x] Build category browse page
- [x] Hierarchical category navigation
- [x] Advanced search page
- [x] Filter by attributes (if implemented)
- [x] Search results page

**Week 9 Deliverables:**
- ✅ Customer website foundation
- ✅ Product catalog
- ✅ Multi-seller cart
- ✅ Seller profiles

---

### **Week 10: Checkout & Customer Account**

#### Day 1-2: Checkout Process (16 hours)
- [x] Build multi-step checkout
  - Step 1: Shipping address
  - Step 2: Shipping method (per seller if different)
  - Step 3: Payment method
  - Step 4: Review order
    - **Show items grouped by seller**
    - Show shipping per seller
    - Show total
- [x] Order summary sidebar
- [x] Create order API call
- [x] Order confirmation page
  - Order number
  - Estimated delivery (per seller)
  - Thank you message

#### Day 3: Customer Account (8 hours)
- [x] Build login/register pages
- [x] Build account dashboard
  - Order history
  - Saved addresses
  - Payment methods
- [x] Build order history page
  - List all orders
  - Filter by date, status
- [x] Build order details page
  - **Items grouped by seller**
  - Tracking per seller
  - Order timeline

#### Day 4: Reviews & Ratings (8 hours)
- [x] Build product review form
- [x] Build seller review form
- [x] Display reviews on product page
- [x] Display reviews on seller page
- [x] Review moderation (pending approval)

#### Day 5: Testing & Launch Prep (8 hours)
- [x] End-to-end testing
- [x] Cross-browser testing
- [x] Mobile responsiveness
- [x] Performance optimization
- [x] SEO basics
- [x] Documentation

**Week 10 Deliverables:**
- ✅ Complete checkout flow
- ✅ Customer account features
- ✅ Review system
- ✅ Customer website ready for launch

---

## 📅 WEEK 11-12: Advanced Features & Polish

### **Week 11: Reviews, Ratings & Advanced Features**

#### Day 1: Review System Backend (8 hours)
- [x] Create Review Service (or add to Product Service)
- [x] Product reviews table
- [x] Seller reviews table
- [x] Review moderation workflow
- [x] Rating calculation logic

#### Day 2: Review System UI (8 hours)
- [x] Admin review moderation
- [x] Seller response to reviews
- [x] Customer review history
- [x] Review reporting/flagging

#### Day 3: Advanced Analytics (8 hours)
- [x] Seller performance metrics
- [x] Product performance analytics
- [x] Customer behavior analytics
- [x] Revenue forecasting

#### Day 4: Notifications System (8 hours)
- [x] Email notification service
- [x] In-app notifications
- [x] Notification preferences
- [x] Notification history

#### Day 5: Search Optimization (8 hours)
- [x] Elasticsearch integration (optional)
- [x] Improve fulltext search
- [x] Search suggestions
- [x] Recently viewed products

**Week 11 Deliverables:**
- ✅ Review system complete
- ✅ Advanced analytics
- ✅ Notifications working

---

### **Week 12: Testing, Documentation & Deployment**

#### Day 1: Integration Testing (8 hours)
- [x] Full marketplace flow testing
- [x] Multi-seller order test
- [x] Payout generation test
- [x] Commission calculation verification

#### Day 2: Performance Testing (8 hours)
- [x] Load testing (100+ concurrent users)
- [x] Database query optimization
- [x] Redis caching verification
- [x] API response time optimization

#### Day 3: Security Audit (8 hours)
- [x] Authentication review
- [x] Authorization checks
- [x] SQL injection prevention
- [x] XSS prevention
- [x] CSRF protection

#### Day 4: Documentation (8 hours)
- [x] API documentation (Swagger)
- [x] User guides (Admin, Seller, Customer)
- [x] Developer documentation
- [x] Deployment guide

#### Day 5: Deployment Preparation (8 hours)
- [x] Production environment setup
- [x] Database migrations review
- [x] Environment variables checklist
- [x] Monitoring setup
- [x] Backup strategy

**Week 12 Deliverables:**
- ✅ All testing complete
- ✅ Security verified
- ✅ Complete documentation
- ✅ Ready for production deployment

---

## ✅ DEFERRED FEATURES (Post-MVP)

These features are important but not critical for initial marketplace launch:

### **Attribute Groups** (2-3 days)
- Create attribute_groups table
- Create attribute_group_attributes junction
- Admin UI for group management
- Product creation with attribute templates
- **Priority:** Medium (improves UX but not blocking)

### **Advanced Inventory** (1 week)
- Stock movement logs
- Stock reservations with timeout
- Stock alerts and notifications
- Multi-warehouse support (if needed)

### **Advanced Payment Integration** (1 week)
- Stripe Connect for split payments
- PayPal integration
- Real-time payout processing
- Payment dispute handling

### **Marketing Features** (1-2 weeks)
- Promotional campaigns
- Discount codes
- Featured seller badges
- Product recommendations

---

## 📊 Summary

### **Core Marketplace Features (Weeks 1-10):**
- ✅ Multi-seller support
- ✅ Seller verification workflow
- ✅ Product ownership and approval
- ✅ Order splitting by seller
- ✅ Commission calculation
- ✅ Automated payouts
- ✅ Admin dashboard
- ✅ Seller dashboard
- ✅ Customer marketplace

### **Total Estimated Time:**
- Backend Services: 4 weeks (160 hours)
- Admin Dashboard: 2 weeks (80 hours)
- Seller Dashboard: 2 weeks (80 hours)
- Customer Website: 2 weeks (80 hours)
- Advanced Features & Testing: 2 weeks (80 hours)
- **Total: 12 weeks (480 hours)**

### **Services Created:**
1. Seller Service (port 3010, db 3310)
2. Product Service (port 3008, db 3308) - with seller_id
3. Order Service (port 3009, db 3309) - with order splitting
4. Payout Service (port 3011, db 3311)

### **Frontend Applications:**
1. React Admin (port 3000) - Extended
2. Seller Dashboard (port 3200) - NEW
3. Customer Website (port 3100) - NEW

---

## 🚀 Ready to Start?

**Next Step:** Begin Week 1, Day 1 - Seller Service Setup!

Just say **"Let's start Week 1"** and I'll guide you through each task step by step! 🎉
