# Seller Service# Seller Service



Multi-seller marketplace microservice for managing seller accounts, verification, and business operations.Multi-seller marketplace microservice for managing seller accounts, verification, and business operations.



## 📋 Overview## 📋 Overview



The Seller Service is a **NestJS-based microservice** that handles all seller-related operations in the multi-seller marketplace. It provides comprehensive seller lifecycle management including registration, verification, profile management, and status tracking.The Seller Service is a **NestJS-based microservice** that handles all seller-related operations in the multi-seller marketplace. It provides comprehensive seller lifecycle management including registration, verification, profile management, and status tracking.



### Key Features### Key Features



- 🏪 **Seller Registration & Onboarding** - Complete registration flow with business validation- 🏪 **Seller Registration & Onboarding** - Complete registration flow with business validation

- ✅ **Verification System** - Admin-controlled seller verification with approval/rejection workflow- ✅ **Verification System** - Admin-controlled seller verification with approval/rejection workflow

- 👤 **Profile Management** - Business profile, banking info, and logo management- 👤 **Profile Management** - Business profile, banking info, and logo management

- 🔒 **Account Status Management** - Active, suspended, rejected status transitions- 🔒 **Account Status Management** - Active, suspended, rejected status transitions

- 📊 **Metrics & Analytics** - Sales tracking, ratings, reviews, product counts- 📊 **Metrics & Analytics** - Sales tracking, ratings, reviews, product counts

- 🔐 **Security** - JWT authentication via Kong Gateway, role-based access control, owner guards- 🔐 **Security** - JWT authentication, role-based access control, owner guards

- 🚀 **Performance** - Redis caching with cache-first pattern, 98% faster reads- 🚀 **Performance** - Redis caching with cache-first pattern, 98% faster reads

- 🔗 **User Service Integration** - Validates user existence before seller registration- � **User Service Integration** - Validates user existence before seller registration

- 🧪 **Well-Tested** - 61 tests with 97.8% coverage- 🧪 **Well-Tested** - 61 tests with 97.8% coverage



---## 📅 Development Progress



## 📅 Development Progress- ✅ **Day 1 (Complete)**: Foundation - Database setup, entity, repository, migrations

- ✅ **Day 2 (Complete)**: Business Logic - DTOs, SellerService with 97.8% test coverage, 39 unit tests

- ✅ **Day 1 (Complete)**: Foundation - Database setup, entity, repository, migrations- ✅ **Day 3 (Complete)**: API Endpoints - Guards, interceptors, 14 REST endpoints, Postman collection, 18 controller tests

- ✅ **Day 2 (Complete)**: Business Logic - DTOs, SellerService with 97.8% test coverage, 39 unit tests- ✅ **Day 4 (Complete)**: Integration - User Service integration, Redis caching, 61 tests passing

- ✅ **Day 3 (Complete)**: API Endpoints - Guards, interceptors, 14 REST endpoints, Postman collection, 18 controller tests- ⏳ **Day 5 (Pending)**: Analytics - Metrics dashboard, logging, final documentation

- ✅ **Day 4 (Complete)**: Integration - User Service integration, Redis caching, 61 tests passing

- ⏳ **Day 5 (Pending)**: Analytics - Metrics dashboard, structured logging, Kong Gateway integration**Documentation**:

- [DAY-1-SUMMARY.md](./DAY-1-SUMMARY.md) - Database foundation

**Documentation**:- [DAY-2-SUMMARY.md](./DAY-2-SUMMARY.md) - Business logic implementation

- [DAY-1-SUMMARY.md](./DAY-1-SUMMARY.md) - Database foundation- [DAY-3-SUMMARY.md](./DAY-3-SUMMARY.md) - API layer implementation

- [DAY-2-SUMMARY.md](./DAY-2-SUMMARY.md) - Business logic implementation- [DAY-4-SUMMARY.md](./DAY-4-SUMMARY.md) - User Service integration & Redis caching

- [DAY-3-SUMMARY.md](./DAY-3-SUMMARY.md) - API layer implementation- [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) - Complete API reference (if exists)

- [DAY-4-SUMMARY.md](./DAY-4-SUMMARY.md) - User Service integration & Redis caching

## 📦 Tech Stack

---

- **Framework**: NestJS 10

## 🏗️ Architecture

- **Database**: MySQL 8.0 (Port 3313)

### Clean Architecture Pattern

- **ORM**: TypeORM with migrations- ⏳ **Day 4 (Pending)**: Integration - User Service integration, Redis caching

```

src/- **Validation**: class-validator, class-transformer

├── application/         # DTOs and application interfaces

│   └── dto/            # Data Transfer Objects- **Authentication**: JWT (via Auth Service)- ⏳ **Day 5 (Pending)**: Analytics - Metrics dashboard, logging, final documentation  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

├── domain/             # Business logic (entities, services)

│   ├── modules/        # Feature modules- **Caching**: Redis (Day 4)

│   └── services/       # Business logic services

├── infrastructure/     # External concerns- **Port**: 3010

│   ├── cache/         # Redis caching

│   ├── database/      # TypeORM entities, repositories, migrations- **API Prefix**: /api/v1

│   └── external/      # External service clients (User Service)

├── interfaces/         # API layerSee [DAY-1-SUMMARY.md](./DAY-1-SUMMARY.md) and [DAY-2-SUMMARY.md](./DAY-2-SUMMARY.md) for detailed progress.## 📦 Tech Stack    <p align="center">

│   └── http/          # REST controllers

└── shared/            # Cross-cutting concerns## 🗄️ Database Schema

    ├── decorators/    # Custom decorators

    ├── guards/        # Authentication & authorization

    └── interceptors/  # Logging, transformation

```### Sellers Table



### Service Integration## 📦 Tech Stack<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>



``````sql

┌─────────────────────────────────────────────────────────┐

│                  Kong API Gateway                       │CREATE TABLE sellers (

│                  (JWT Validation)                       │

└──────────────────────┬──────────────────────────────────┘  -- Primary Fields

                       │

           ┌───────────▼───────────┐  id INT PRIMARY KEY AUTO_INCREMENT,- **Framework**: NestJS 10- **Framework**: NestJS 10<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

           │   Seller Service      │

           │    (Port 3010)        │  user_id INT UNIQUE NOT NULL,  -- FK to User Service

           └───┬───────┬───────┬───┘

               │       │       │  - **Database**: MySQL 8.0 (Port 3313)

               ▼       ▼       ▼

        ┌──────────┐ ┌──────────┐ ┌──────────────┐  -- Business Information

        │ MySQL DB │ │  Redis   │ │ User Service │

        │Port 3313 │ │Port 6379 │ │  Port 3003   │  business_name VARCHAR(255) NOT NULL,- **ORM**: TypeORM with migrations- **Database**: MySQL 8.0 (Port 3313)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

        └──────────┘ └──────────┘ └──────────────┘

         Seller Data  Cache Layer  User Validation  business_type ENUM('individual', 'sole_proprietor', 'llc', 'corporation', 'partnership'),

```

  business_email VARCHAR(255),- **Validation**: class-validator, class-transformer

---

  business_phone VARCHAR(20),

## 🚀 Quick Start

  tax_id VARCHAR(100),- **Authentication**: JWT (via Auth Service)- **ORM**: TypeORM<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

### Prerequisites

  business_address VARCHAR(500),

- **Node.js 18+** and npm

- **Docker** and Docker Compose  business_city VARCHAR(100),- **Caching**: Redis

- **MySQL 8.0** (via Docker)

- **Redis 7** (shared-redis container) - **REQUIRED**  business_state VARCHAR(100),

- **User Service** running on Port 3003 - **REQUIRED for registration**

  business_country VARCHAR(100),- **Port**: 3010- **Validation**: class-validator, class-transformer<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>

### 1. Install Dependencies

  business_postal_code VARCHAR(20),

```bash

npm install  - **API Prefix**: /api/v1

```

  -- Profile

### 2. Configure Environment

  logo_url VARCHAR(500),- **Authentication**: JWT (via Auth Service)<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

```bash

# Copy example environment file  description TEXT,

cp .env.example .env

  website VARCHAR(500),## 🗄️ Database Schema

# Update .env with your configuration

# Critical variables:  

# - JWT_SECRET (must match Auth Service)

# - USER_SERVICE_URL (User Service endpoint)  -- Status & Verification- **Caching**: Redis<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

# - REDIS_PASSWORD (shared Redis password: shared_redis_password_2024)

```  status ENUM('pending', 'active', 'suspended', 'rejected') DEFAULT 'pending',



### 3. Start Shared Redis  verification_status ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'unverified',### Sellers Table



```bash  verified_at TIMESTAMP NULL,

# Check if shared Redis is running

docker ps | grep shared-redis  verified_by INT NULL,- **Port**: 3010<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>



# If not running, start it  rejection_reason TEXT,

cd ../shared-redis

docker-compose up -d  suspension_reason TEXT,**Primary Fields**:

```

  

### 4. Start Database

  -- Metrics- `id` (PK, auto-increment)  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

```bash

# Start MySQL database  rating DECIMAL(3,2) DEFAULT 0,

docker-compose up -d seller-db

  total_reviews INT DEFAULT 0,- `user_id` (FK to User Service, UNIQUE)

# Wait for database to be ready (check health)

docker ps  total_products INT DEFAULT 0,

```

  total_sales INT DEFAULT 0,## 🗄️ Database Schema    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

### 5. Run Migrations

  total_revenue DECIMAL(12,2) DEFAULT 0,

```bash

# Run database migrations  **Business Information**:

npm run migration:run

  -- Commission

# Verify tables created

docker exec -it seller-db mysql -u seller_user -pseller_password seller_db -e "SHOW TABLES;"  commission_rate DECIMAL(5,2) NULL,  -- Uses platform default if null- `business_name` (required, indexed)  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

```

  

### 6. Start the Service

  -- Banking- `business_type` (enum: individual, sole_proprietor, llc, corporation, partnership)

```bash

# Development mode (with hot-reload)  bank_name VARCHAR(255),

npm run start:dev

  bank_account_holder VARCHAR(255),- `business_email`, `business_phone`### Sellers Table</p>

# Production mode

npm run build  bank_account_number VARCHAR(100),

npm run start:prod

```  bank_routing_number VARCHAR(100),- `tax_id`



✅ **Service Available**: `http://localhost:3010`  payment_method ENUM('bank_transfer', 'paypal', 'stripe'),



---  - `business_address`, `business_city`, `business_state`, `business_country`, `business_postal_code`  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)



## 🔧 Configuration  -- Timestamps



### Environment Variables  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,



| Variable | Description | Default | Required |  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

|----------|-------------|---------|----------|

| **Server** | | | |  last_login_at TIMESTAMP NULL,**Profile**:```sql  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

| `PORT` | Service port | `3010` | Yes |

| `NODE_ENV` | Environment | `development` | Yes |  

| **Database** | | | |

| `DB_HOST` | MySQL host | `localhost` | Yes |  -- Indexes- `logo_url`, `description`, `website`

| `DB_PORT` | MySQL port | `3313` | Yes |

| `DB_USERNAME` | Database user | `seller_user` | Yes |  INDEX idx_user_id (user_id),

| `DB_PASSWORD` | Database password | `seller_password` | Yes |

| `DB_DATABASE` | Database name | `seller_db` | Yes |  INDEX idx_status (status),- id (PK)

| **JWT** | | | |

| `JWT_SECRET` | JWT signing secret (MUST match Auth Service & Kong) | - | Yes |  INDEX idx_verification_status (verification_status),

| **Redis (Shared)** | | | |

| `REDIS_HOST` | Redis host | `localhost` | Yes |  INDEX idx_rating (rating),**Status & Verification**:

| `REDIS_PORT` | Redis port | `6379` | Yes |

| `REDIS_PASSWORD` | Redis password | `shared_redis_password_2024` | **Yes** |  INDEX idx_business_name (business_name),

| `REDIS_DB` | Redis database number | `0` | No |

| `REDIS_TTL` | Default TTL (seconds) | `3600` | No |  INDEX idx_created_at (created_at)- `status` (enum: pending, active, suspended, rejected, indexed)- user_id (FK to User Service, UNIQUE)## Description

| **User Service** | | | |

| `USER_SERVICE_URL` | User Service API URL | `http://localhost:3003/api/v1` | Yes |);

| `USER_SERVICE_TIMEOUT` | Request timeout (ms) | `5000` | No |

| **Cache** | | | |```- `verification_status` (enum: unverified, pending, verified, rejected, indexed)

| `CACHE_ENABLED` | Enable caching | `true` | No |

| `CACHE_USER_TTL` | User cache TTL (seconds) | `300` | No |

| `CACHE_SELLER_TTL` | Seller cache TTL (seconds) | `300` | No |

## 🏗️ Architecture- `verified_at`, `verified_by` (admin user ID)- business_name

### Example .env



```env

# ServerFollowing Clean Architecture principles:- `rejection_reason`, `suspension_reason`

PORT=3010

NODE_ENV=development



# Database```- business_type (individual, sole_proprietor, llc, corporation, partnership)[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

DB_HOST=localhost

DB_PORT=3313src/

DB_USERNAME=seller_user

DB_PASSWORD=seller_password├── application/           # Application layer**Metrics**:

DB_DATABASE=seller_db

│   └── dto/              # Data Transfer Objects (4 files)

# JWT (MUST match Auth Service & Kong Gateway)

JWT_SECRET=your_shared_secret_key│       ├── create-seller.dto.ts- `rating` (decimal 3,2, indexed)- business_email, business_phone



# Redis (Shared Infrastructure)│       ├── update-seller.dto.ts

REDIS_HOST=localhost

REDIS_PORT=6379│       ├── seller-response.dto.ts- `total_reviews`, `total_products`, `total_sales`

REDIS_PASSWORD=shared_redis_password_2024

REDIS_DB=0│       └── seller-filter.dto.ts

REDIS_TTL=3600

├── domain/               # Domain layer (business logic)- `total_revenue` (decimal 12,2)- tax_id## Project setup

# User Service Integration

USER_SERVICE_URL=http://localhost:3003/api/v1│   ├── services/         # Business logic services

USER_SERVICE_TIMEOUT=5000

│   │   ├── seller.service.ts (19 methods)

# Cache Configuration

CACHE_ENABLED=true│   │   └── seller.service.spec.ts (39 tests, 97.8% coverage)

CACHE_USER_TTL=300

CACHE_SELLER_TTL=300│   ├── repositories/     # Repository interfaces**Commission**:- business_address, city, state, country, postal_code

```

│   └── modules/          # Feature modules

---

│       └── seller.module.ts- `commission_rate` (decimal 5,2, nullable - uses platform default if null)

## 🔐 Authentication with Kong Gateway

├── infrastructure/       # Infrastructure layer

### Kong Gateway Integration

│   └── database/- logo_url, description, website```bash

**JWT Flow**:

│       └── typeorm/

1. **User logs in** → Auth Service issues JWT token

2. **User makes request** → Kong Gateway validates JWT signature, expiration, issuer│           ├── entities/         # TypeORM entities**Banking**:

3. **Kong forwards request** → Seller Service validates JWT again (defense-in-depth)

4. **Service processes** → Returns response│           ├── repositories/     # Repository implementations



**Configuration Requirements**:│           └── migrations/       # Database migrations- `bank_name`, `bank_account_holder`- status (pending, active, suspended, rejected)$ npm install



- **JWT_SECRET**: MUST be identical in Kong Gateway, Auth Service, and Seller Service├── interfaces/           # Interface adapters

- **Algorithm**: HS256 (HMAC-SHA256)

- **Issuer**: `auth-service` (validated by Kong)│   └── http/            # HTTP layer- `bank_account_number`, `bank_routing_number`

- **Claims**: userId, email, roles, iat, exp

│       ├── seller.controller.ts (14 endpoints)

**Route Protection**:

│       └── seller.controller.spec.ts (18 tests)- `payment_method` (enum: bank_transfer, paypal, stripe)- verification_status (unverified, pending, verified, rejected)```

```yaml

# Kong routes (add to api-gateway/kong.yml)└── shared/              # Shared utilities

routes:

  - name: sellers-routes    ├── guards/          # Security guards (3 files)

    service: seller-service

    paths:    ├── interceptors/    # Cross-cutting concerns (2 files)

      - /api/v1/sellers

      - /api/v1/sellers/.*    └── decorators/      # Custom decorators (2 files)**Timestamps**:- verified_at, verified_by (admin user ID)

    plugins:

      - name: jwt```

        config:

          key_claim_name: sub- `created_at`, `updated_at`, `last_login_at`

      

  # Admin-only routes## 🔐 API Endpoints (14 total)

  - name: sellers-admin-routes

    service: seller-service- rejection_reason, suspension_reason## Compile and run the project

    paths:

      - /api/v1/sellers/.*/approve**Authentication**: All endpoints require JWT token (except health check)

      - /api/v1/sellers/.*/reject

      - /api/v1/sellers/.*/suspend**Indexes**: user_id (unique), status, verification_status, rating, business_name, created_at

      - /api/v1/sellers/pending-verification

    plugins:### Public

      - name: jwt

        config:- `GET /health` - Health check- rating (decimal 3,2)

          key_claim_name: sub

      - name: acl

        config:

          whitelist: [admin, super_admin]### Authenticated User## 🏗️ Architecture

```

- `POST /sellers` - Register new seller

---

- `GET /sellers/me` - Get my seller account- total_reviews, total_products, total_sales, total_revenue```bash

## 📡 API Documentation

- `GET /sellers/:id` - Get seller by ID (owner or admin)

### Base URL

- `GET /sellers/user/:userId` - Get seller by user ID (owner or admin)Following Clean Architecture principles:

```

http://localhost:3010/api/v1- `PATCH /sellers/:id/profile` - Update profile (owner)

```

- `PATCH /sellers/:id/banking` - Update banking info (owner)- commission_rate (decimal 5,2, nullable - uses platform default if null)# development

### Authentication

- `POST /sellers/:id/verify` - Submit for verification (owner)

All endpoints require JWT authentication:

```

```

Authorization: Bearer <jwt_token>### Admin Only

```

- `GET /sellers` - List all sellers (with filters)src/- bank_name, bank_account_holder, bank_account_number, bank_routing_number$ npm run start

Get JWT token from Auth Service: `POST /api/v1/auth/login`

- `GET /sellers/pending-verification` - Get pending sellers

### Endpoints Summary

- `PATCH /sellers/:id` - Admin update seller├── application/           # Application layer

| Method | Endpoint | Description | Auth | Roles |

|--------|----------|-------------|------|-------|- `POST /sellers/:id/approve` - Approve verification

| **Seller Management** | | | | |

| `POST` | `/sellers` | Register new seller | ✅ | User |- `POST /sellers/:id/reject` - Reject verification│   └── dto/              # Data Transfer Objects (4 files)- payment_method (bank_transfer, paypal, stripe)

| `GET` | `/sellers/:id` | Get seller by ID | ✅ | Any |

| `GET` | `/sellers/user/:userId` | Get seller by user ID | ✅ | Owner/Admin |- `POST /sellers/:id/suspend` - Suspend seller

| `GET` | `/sellers` | List all sellers | ✅ | Admin |

| `PATCH` | `/sellers/:id/profile` | Update seller profile | ✅ | Owner |- `POST /sellers/:id/reactivate` - Reactivate seller│       ├── create-seller.dto.ts

| `PATCH` | `/sellers/:id/banking` | Update banking info | ✅ | Owner |

| **Admin Operations** | | | | |- `DELETE /sellers/:id` - Delete seller

| `GET` | `/sellers/pending-verification` | List pending sellers | ✅ | Admin |

| `POST` | `/sellers/:id/approve` | Approve seller | ✅ | Admin |│       ├── update-seller.dto.ts- created_at, updated_at, last_login_at# watch mode

| `POST` | `/sellers/:id/reject` | Reject seller | ✅ | Admin |

| `POST` | `/sellers/:id/suspend` | Suspend seller | ✅ | Admin |**See [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) for complete endpoint reference.**

| `POST` | `/sellers/:id/reactivate` | Reactivate seller | ✅ | Admin |

| **Metrics** | | | | |│       ├── seller-response.dto.ts

| `POST` | `/sellers/:id/products/increment` | Increment product count | ✅ | Owner |

| `POST` | `/sellers/:id/products/decrement` | Decrement product count | ✅ | Owner |## 🔄 Seller Lifecycle (State Machine)

| `POST` | `/sellers/:id/sales` | Record sale | ✅ | System |

| `POST` | `/sellers/:id/rating` | Update rating | ✅ | System |│       └── seller-filter.dto.ts```$ npm run start:dev



### Example Requests### Verification Status



#### 1. Register Seller```├── domain/               # Domain layer (business logic)



**Request**:UNVERIFIED → PENDING (submitForVerification)

```bash

POST /api/v1/sellersPENDING → VERIFIED (approveSeller)│   ├── services/         # Business logic services

Authorization: Bearer <jwt_token>

Content-Type: application/jsonPENDING → REJECTED (rejectSeller)



{```│   │   ├── seller.service.ts (19 methods)

  "userId": 123,

  "businessName": "Tech Store Inc",

  "businessType": "LLC",

  "businessEmail": "contact@techstore.com",### Seller Status│   │   └── seller.service.spec.ts (39 tests, 97.8% coverage)**Indexes**:# production mode

  "businessPhone": "+1234567890",

  "businessAddress": "123 Tech Street",```

  "businessCity": "San Francisco",

  "businessState": "CA",PENDING → ACTIVE (approveSeller)│   └── repositories/     # Repository interfaces

  "businessCountry": "US",

  "businessZip": "94102"PENDING → REJECTED (rejectSeller)

}

```ACTIVE → SUSPENDED (suspendSeller)├── infrastructure/       # Infrastructure layer- user_id (unique)$ npm run start:prod



**Response**:SUSPENDED → ACTIVE (reactivateSeller)

```json

{```│   └── database/

  "id": 1,

  "userId": 123,

  "businessName": "Tech Store Inc",

  "status": "pending",## 📝 Business Logic (SellerService)│       └── typeorm/- status```

  "verificationStatus": "unverified",

  "rating": 0,

  "totalReviews": 0,

  "totalProducts": 0,19 methods implemented with 97.8% test coverage:│           ├── entities/ # TypeORM entities

  "totalSales": 0,

  "totalRevenue": 0,

  "createdAt": "2024-12-29T10:00:00Z"

}**Core CRUD**:│           ├── repositories/ # Repository implementations- verification_status

```

- `registerSeller(userId, createDto)` - Create seller account

#### 2. Approve Seller (Admin)

- `getSellerById(id)` - Find by ID│           └── migrations/ # Database migrations

**Request**:

```bash- `getSellerByUserId(userId)` - Find by user

POST /api/v1/sellers/1/approve

Authorization: Bearer <admin_jwt_token>- `getAllSellers(filters)` - List with filters├── interfaces/           # Interface adapters- rating## Run tests

Content-Type: application/json

- `updateSeller(id, updateDto)` - Update seller

{

  "approvedBy": 456- `deleteSeller(id)` - Delete (if no products/sales)│   └── http/            # HTTP controllers (Day 3)

}

```



**Response**:**Profile Management**:└── shared/              # Shared utilities- business_name

```json

{- `updateProfile(id, profileDto)` - Update public profile

  "id": 1,

  "status": "active",- `updateBankingInfo(id, bankingDto)` - Update payment info    ├── guards/

  "verificationStatus": "verified",

  "verifiedAt": "2024-12-29T12:00:00Z",

  "verifiedBy": 456

}**Verification Workflow**:    ├── interceptors/- created_at```bash

```

- `submitForVerification(id)` - Seller submits for review

---

- `approveSeller(id, adminId)` - Admin approves    └── decorators/

## 🚀 Performance & Caching

- `rejectSeller(id, reason)` - Admin rejects

### Redis Cache Strategy

```# unit tests

**Pattern**: Cache-aside (lazy loading)

**Admin Actions**:

**Cache Keys**:

- `seller:id:{id}` - Seller by ID- `suspendSeller(id, reason)` - Suspend account

- `seller:userId:{userId}` - Seller by user ID

- `reactivateSeller(id)` - Reactivate suspended account

**TTL**: 300 seconds (5 minutes)

## 🔄 Seller Lifecycle (State Machine)## 🚀 Getting Started$ npm run test

**Cache Invalidation**:

Automatic invalidation occurs on:**Metrics**:

- `updateProfile`

- `updateBankingInfo`- `updateRating(id, newRating, reviewCount)` - Update rating

- `approveSeller`

- `rejectSeller`- `incrementProducts(id)` - Increment product count

- `suspendSeller`

- `reactivateSeller`- `decrementProducts(id)` - Decrement product count### Verification Status



**Performance Improvement**:- `incrementSales(id, revenue)` - Record sale



| Operation | Without Cache | With Cache | Improvement |```

|-----------|---------------|------------|-------------|

| Get seller by ID | ~50ms | ~1ms | **98% faster** |**Queries**:

| Get seller by user | ~50ms | ~1ms | **98% faster** |

- `getPendingVerification()` - Get all pending sellersUNVERIFIED → PENDING (submitForVerification)### Prerequisites# e2e tests

**Error Handling**: Fail-open strategy - if Redis is down, service uses database directly (no errors)

- `updateLastLogin(userId)` - Track login

---

PENDING → VERIFIED (approveSeller)

## 🧪 Testing

## 🔒 Security Features

### Run Tests

PENDING → REJECTED (rejectSeller)$ npm run test:e2e

```bash

# All tests### Guards (Day 3)

npm test

- **JwtAuthGuard**: Validates JWT tokens on all routes```

# Watch mode

npm run test:watch- **RolesGuard**: Role-based access control (admin endpoints)



# Coverage report- **SellerOwnerGuard**: Ensures users access only their own data- Node.js 18+

npm run test:cov



# Specific test file

npm test -- seller.service.spec.ts### Decorators (Day 3)### Seller Status

```

- **@Roles('admin')**: Specify required roles

### Test Statistics

- **@CurrentUser()**: Extract authenticated user from request```- Docker and Docker Compose# test coverage

✅ **Total Tests**: 61  

✅ **Test Suites**: 3  

✅ **Coverage**: 97.8%  

✅ **Success Rate**: 100%### Interceptors (Day 3)PENDING → ACTIVE (approveSeller)



**Test Breakdown**:- **TransformInterceptor**: Auto-convert entities to DTOs (excludes sensitive data)

- `app.controller.spec.ts`: 1 test (health check)

- `seller.service.spec.ts`: 42 tests (business logic + caching)- **LoggingInterceptor**: Log all requests/responses for observabilityPENDING → REJECTED (rejectSeller)- MySQL 8.0$ npm run test:cov

- `seller.controller.spec.ts`: 18 tests (API layer)



**Integration Tests**:

- User Service integration (validation, error handling)## 🧪 TestingACTIVE → SUSPENDED (suspendSeller)

- Redis cache integration (hit/miss, invalidation, connection failure)



---

**Total**: 58 tests passing (100% success rate)SUSPENDED → ACTIVE (reactivateSeller)```

## 🐳 Docker



### Start Services

### Test Coverage```

```bash

# Database only- `app.controller.spec.ts`: 1 test (health check)

docker-compose up -d seller-db

- `seller.service.spec.ts`: 39 tests (97.8% coverage)### Installation

# Full service stack

docker-compose up -d- `seller.controller.spec.ts`: 18 tests (100% endpoint coverage)



# View logs## 📝 Business Logic (SellerService)

docker-compose logs -f seller-service

### Run Tests

# Stop services

docker-compose down```bash## Deployment



# Stop and remove volumes (CAUTION: deletes data)# All tests

docker-compose down -v

```npm test19 methods implemented:



### Service Health Checks



```bash# Watch mode```bash

# Seller service

curl http://localhost:3010/healthnpm run test:watch



# Database**Core CRUD**:

docker exec seller-db mysqladmin ping -u seller_user -pseller_password

# Coverage report

# Redis (shared)

docker exec shared-redis redis-cli -a shared_redis_password_2024 pingnpm run test:cov- `registerSeller(userId, createDto)` - Create seller account# Install dependenciesWhen you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

```



---

# Specific test file- `getSellerById(id)` - Fetch by ID

## 🔄 Database Migrations

npm test -- seller.service.spec

### Create Migration

```- `getSellerByUserId(userId)` - Fetch by user IDnpm install

```bash

# Generate from entity changes

npm run migration:generate -- src/infrastructure/database/typeorm/migrations/MigrationName

## 🚀 Getting Started- `getAllSellers(filters)` - Paginated list with filters

# Create empty migration

npm run migration:create -- src/infrastructure/database/typeorm/migrations/MigrationName

```

### PrerequisitesIf you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

### Run Migrations

- Node.js 18+

```bash

# Run pending migrations- Docker and Docker Compose**Profile Management**:

npm run migration:run

- MySQL 8.0

# Show migration status

npm run migration:show- `updateProfile(sellerId, updateDto)` - Update seller profile# Start database



# Revert last migration### Installation

npm run migration:revert

```- `updateBankingInfo(sellerId, bankingDto)` - Update banking details



---```bash



## 🚧 Troubleshooting# Install dependencies- `adminUpdateSeller(sellerId, updateDto)` - Admin-only full updatedocker-compose up -d```bash



### Database Connection Issuesnpm install



```bash

# Check database status

docker ps | grep seller-db# Copy environment file



# View database logscp .env.example .env**Verification Workflow**:$ npm install -g mau

docker logs seller-db



# Test connection

docker exec seller-db mysql -u seller_user -pseller_password seller_db -e "SELECT 1;"# Update .env with your configuration- `submitForVerification(sellerId)` - Submit for admin review



# Restart database# DB_HOST=localhost

docker-compose restart seller-db

```# DB_PORT=3313- `approveSeller(sellerId, adminId)` - Approve and activate# Run migrations$ mau deploy



### Redis Connection Issues# DB_USERNAME=seller_user



```bash# DB_PASSWORD=seller_password- `rejectSeller(sellerId, reason)` - Reject with reason

# Check if shared Redis is running

docker ps | grep shared-redis# DB_DATABASE=seller_db



# If not running, start it```- `suspendSeller(sellerId, reason)` - Suspend active sellernpm run migration:run```

cd ../shared-redis && docker-compose up -d



# Test connection with password

docker exec shared-redis redis-cli -a shared_redis_password_2024 ping### Database Setup- `reactivateSeller(sellerId)` - Reactivate suspended seller



# Check cache keys

docker exec shared-redis redis-cli -a shared_redis_password_2024 KEYS 'seller:*'

```bash

# Clear seller cache (development only)

docker exec shared-redis redis-cli -a shared_redis_password_2024 DEL seller:id:*# Start database (Docker)

```

docker-compose up -d**Metrics**:

### User Service Connection Issues



```bash

# Check User Service health# Run migrations- `incrementProductCount(sellerId)` - +1 product# Start service in developmentWith Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

curl http://localhost:3003/health

npm run migration:run

# View User Service logs

docker logs user-service- `decrementProductCount(sellerId)` - -1 product



# Test user validation endpoint# Verify database

curl -H "Authorization: Bearer <token>" http://localhost:3003/api/v1/users/123

```npm run migration:show- `recordSale(sellerId, amount)` - Record sale and revenuenpm run start:dev



### Port Already in Use```



```bash- `updateRating(sellerId, newRating, reviewCount)` - Update from reviews

# Check what's using port 3010

lsof -i :3010### Running the Service



# Kill process (if safe to do so)```## Resources

kill -9 <PID>

``````bash



### Tests Failing# Development mode**Admin**:



```bashnpm run start:dev

# Clear Jest cache

npm test -- --clearCache- `getPendingVerification()` - List pending sellers



# Run tests with verbose output# Production mode

npm test -- --verbose

npm run build- `deleteSeller(sellerId)` - Delete (if no products/sales)

# Run specific test file

npm test -- seller.service.spec.tsnpm run start:prod

```

- `validateSellerActive(sellerId)` - Check if can perform actions### Environment VariablesCheck out a few resources that may come in handy when working with NestJS:

---

# Debug mode

## 📁 Project Structure

npm run start:debug

```

seller-service/```

├── src/

│   ├── application/## 🚀 Quick Start

│   │   └── dto/                    # Data Transfer Objects

│   │       ├── create-seller.dto.tsService will be available at: `http://localhost:3010`

│   │       ├── update-seller.dto.ts

│   │       ├── seller-filter.dto.ts

│   │       ├── seller-response.dto.ts

│   │       └── user.dto.ts### Postman Testing

│   ├── domain/

│   │   ├── modules/### 1. PrerequisitesCopy `.env` file and configure:- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

│   │   │   └── seller.module.ts    # Seller feature module

│   │   └── services/1. Import `Seller-Service-API.postman_collection.json`

│   │       ├── seller.service.ts   # Business logic

│   │       └── seller.service.spec.ts2. Import `Seller-Service.postman_environment.json`- Docker and Docker Compose

│   ├── infrastructure/

│   │   ├── cache/3. Set `token` variable with JWT from Auth Service

│   │   │   ├── cache.module.ts     # Global cache module

│   │   │   └── redis-cache.service.ts4. Run requests in collection folders- Node.js 18+- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

│   │   ├── database/

│   │   │   └── typeorm/

│   │   │       ├── entities/

│   │   │       │   └── seller.entity.ts## 🔧 Environment Variables- npm

│   │   │       ├── repositories/

│   │   │       │   └── seller.repository.ts

│   │   │       └── migrations/

│   │   │           └── 1761790708287-CreateSellersTable.ts```env```env- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

│   │   └── external/

│   │       ├── external-services.module.ts# Server

│   │       └── user-service.client.ts

│   ├── interfaces/PORT=3010### 2. Environment Setup

│   │   └── http/

│   │       ├── seller.controller.tsNODE_ENV=development

│   │       └── seller.controller.spec.ts

│   ├── shared/NODE_ENV=development- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

│   │   ├── decorators/

│   │   │   ├── current-user.decorator.ts# Database

│   │   │   └── roles.decorator.ts

│   │   ├── guards/DB_HOST=localhost```bash

│   │   │   ├── jwt-auth.guard.ts

│   │   │   ├── roles.guard.tsDB_PORT=3313

│   │   │   └── seller-owner.guard.ts

│   │   └── interceptors/DB_USERNAME=seller_usercp .env.example .envPORT=3010- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

│   │       ├── logging.interceptor.ts

│   │       └── transform.interceptor.tsDB_PASSWORD=seller_password

│   ├── app.module.ts

│   └── main.tsDB_DATABASE=seller_db# Edit .env with your configuration

├── test/                           # E2E tests

├── .env                           # Environment config

├── .env.example                   # Environment template

├── docker-compose.yml             # Docker services# JWT (from Auth Service)```- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

├── package.json

├── tsconfig.jsonJWT_SECRET=your_secret_key

└── README.md

```



---# Redis (Day 4)



## 📖 Related DocumentationREDIS_HOST=localhostKey environment variables:# Database- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).



- [Day 1 Summary](./DAY-1-SUMMARY.md) - Database foundationREDIS_PORT=6379

- [Day 2 Summary](./DAY-2-SUMMARY.md) - Business logic layer

- [Day 3 Summary](./DAY-3-SUMMARY.md) - API layer```env

- [Day 4 Summary](./DAY-4-SUMMARY.md) - User Service integration & Redis caching

- [Kong Gateway](../api-gateway/README.md) - API Gateway documentation# User Service Integration (Day 4)

- [User Service](../user-service/README.md) - User Service documentation

- [Shared Redis](../shared-redis/docker-compose.yml) - Redis infrastructureUSER_SERVICE_URL=http://localhost:3003/api/v1PORT=3010DB_HOST=localhost- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).



---```



## 🤝 ContributingDB_HOST=localhost



### Development Workflow## 📊 Metrics & Analytics (Day 5)



1. Create feature branchDB_PORT=3313DB_PORT=3313

2. Implement feature with tests

3. Run tests: `npm test`The following metrics are tracked per seller:

4. Check coverage: `npm run test:cov` (must be >90%)

5. Format code: `npm run format`- `rating`: Average rating (0-5)DB_NAME=seller_db

6. Commit changes

7. Create pull request- `total_reviews`: Number of reviews



### Code Standards- `total_products`: Active productsDB_USER=seller_userDB_USERNAME=seller_user## Support



- ✅ TypeScript strict mode- `total_sales`: Completed orders

- ✅ Clean Architecture patterns

- ✅ 90%+ test coverage- `total_revenue`: Total earningsDB_PASSWORD=your_secure_password

- ✅ JSDoc comments for public APIs

- ✅ Prettier formatting

- ✅ ESLint compliance

## 🛠️ Development CommandsDB_PASSWORD=seller_password

---



## 📄 License

```bashJWT_SECRET=your_jwt_secret

This project is part of the Fullstack Microservices Project.

# Format code

---

npm run formatREDIS_HOST=localhostDB_DATABASE=seller_dbNest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## 📞 Support



For issues or questions:

1. Check [Troubleshooting](#-troubleshooting) section# Lint codeREDIS_PORT=6379

2. Review [Day 4 Summary](./DAY-4-SUMMARY.md) for recent changes

3. Check service logs: `docker logs seller-service`npm run lint



---DB_SYNCHRONIZE=false



**Version**: 1.0.0  # Generate migration

**Last Updated**: December 29, 2024  

**Service**: Seller Service  npm run migration:generate -- src/infrastructure/database/typeorm/migrations/MigrationNameDEFAULT_COMMISSION_RATE=15.00

**Port**: 3010  

**Status**: Day 4 Complete (User Service + Redis Integration)


# Run migrationsMIN_PAYOUT_THRESHOLD=50.00DB_MIGRATIONS_RUN=true## Stay in touch

npm run migration:run

```

# Revert migration

npm run migration:revert



# Build project### 3. Start Database

npm run build

# JWT- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

# Start production

npm run start:prod```bash

```

docker-compose up -dJWT_SECRET=your_secret_key- Website - [https://nestjs.com](https://nestjs.com/)

## 📚 Documentation

```

- [DAY-1-SUMMARY.md](./DAY-1-SUMMARY.md) - Database foundation implementation

- [DAY-2-SUMMARY.md](./DAY-2-SUMMARY.md) - Business logic and service layer- Twitter - [@nestframework](https://twitter.com/nestframework)

- [DAY-3-SUMMARY.md](./DAY-3-SUMMARY.md) - API endpoints and controllers

- [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) - Complete API referenceThis starts:



## 🗺️ Roadmap- MySQL 8.0 on port 3313# Redis



### ✅ Completed- Attached to `fullstack-network`

- [x] Day 1: Database schema, entity, repository, migrations

- [x] Day 2: DTOs, SellerService, comprehensive unit testsREDIS_HOST=localhost## License

- [x] Day 3: Guards, interceptors, 14 REST endpoints, Postman collection

### 4. Install Dependencies

### ⏳ Upcoming

- [ ] Day 4: User Service integration, Redis caching, registration flowREDIS_PORT=6379

- [ ] Day 5: Analytics endpoints, metrics dashboard, logging, final docs

```bash

## 🤝 Integration Points

npm installNest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

### User Service (Day 4)

- Validate `userId` during registration```

- Fetch user details for seller profiles

- Authentication via JWT tokens# External Services



### Product Service (Future)### 5. Run MigrationsUSER_SERVICE_URL=http://localhost:3003/api/v1

- Product count synchronization

- Product listing per sellerAUTH_SERVICE_URL=http://localhost:3001/api/v1



### Order Service (Future)```bash

- Sales metrics updates

- Revenue trackingnpm run migration:run# Seller Config



## 📝 License```DEFAULT_COMMISSION_RATE=15.00



This project is part of the fullstack-project monorepo.MIN_PAYOUT_THRESHOLD=50.00



## 👥 Team### 6. Start Service```



Development Team - Seller Service Implementation



---```bash## 📡 API Endpoints



**Last Updated**: October 30, 2025  # Development mode

**Version**: 1.0.0  

**Status**: Day 3 Complete (60% overall)npm run start:dev### Health Check


```

# Production modeGET /api/v1/health

npm run start:prod```

```

### Seller Endpoints (Coming in Day 3)

Service runs on **http://localhost:3010**```

POST   /api/v1/sellers              - Register seller

Health check: **GET http://localhost:3010/api/v1/health**GET    /api/v1/sellers              - List sellers (admin)

GET    /api/v1/sellers/:id          - Get seller details

## 🧪 TestingGET    /api/v1/sellers/user/:userId - Get by user ID

PATCH  /api/v1/sellers/:id          - Update seller

```bashDELETE /api/v1/sellers/:id          - Delete seller

# Run all testsPOST   /api/v1/sellers/:id/verify   - Submit for verification

npm testPOST   /api/v1/sellers/:id/approve  - Admin approve

POST   /api/v1/sellers/:id/reject   - Admin reject

# Run specific test filePOST   /api/v1/sellers/:id/suspend  - Admin suspend

npm test -- seller.service.spec```



# Run with coverage## 🏗️ Project Structure (Clean Architecture)

npm run test:cov

```

# Watch modesrc/

npm run test:watch├── application/          # Use cases and business logic

```│   ├── dto/             # Data Transfer Objects

│   └── use-cases/       # Business use cases

**Current Coverage**: 97.8% (39 tests, all passing)├── domain/              # Domain layer

│   ├── entities/        # Domain entities (interfaces)

## 📊 API Endpoints (Planned - Day 3)│   ├── repositories/    # Repository interfaces

│   └── services/        # Domain services

**Public**:├── infrastructure/      # Infrastructure layer

- `GET /api/v1/health` - Health check ✅│   ├── database/

│   │   └── typeorm/

**Seller Endpoints** (Day 3):│   │       ├── entities/      # TypeORM entities

- `POST /api/v1/sellers` - Register seller (authenticated)│   │       ├── repositories/  # Repository implementations

- `GET /api/v1/sellers` - List sellers (admin, with filters)│   │       └── migrations/    # Database migrations

- `GET /api/v1/sellers/:id` - Get seller by ID│   └── external-services/     # External API clients

- `GET /api/v1/sellers/user/:userId` - Get seller by user ID├── interfaces/          # Interface adapters

- `PATCH /api/v1/sellers/:id/profile` - Update profile (owner)│   └── http/

- `PATCH /api/v1/sellers/:id/banking` - Update banking (owner)│       └── controllers/ # HTTP controllers

- `POST /api/v1/sellers/:id/verify` - Submit for verification (owner)└── shared/              # Shared utilities

    ├── guards/          # Auth guards

**Admin Endpoints** (Day 3):    ├── interceptors/    # Response interceptors

- `PATCH /api/v1/sellers/:id` - Admin update    ├── filters/         # Exception filters

- `POST /api/v1/sellers/:id/approve` - Approve seller    └── decorators/      # Custom decorators

- `POST /api/v1/sellers/:id/reject` - Reject seller```

- `POST /api/v1/sellers/:id/suspend` - Suspend seller

- `POST /api/v1/sellers/:id/reactivate` - Reactivate seller## 🧪 Testing

- `GET /api/v1/sellers/pending-verification` - Pending list

- `DELETE /api/v1/sellers/:id` - Delete seller```bash

# Unit tests

## 🛠️ Database Migrationsnpm test



```bash# E2E tests

# Generate migration from entity changesnpm run test:e2e

npm run migration:generate -- -n MigrationName

# Test coverage

# Create empty migrationnpm run test:cov

npm run migration:create -- -n MigrationName```



# Run pending migrations## 📝 Database Migrations

npm run migration:run

```bash

# Revert last migration# Generate migration

npm run migration:revertnpm run migration:generate -- src/infrastructure/database/typeorm/migrations/MigrationName

```

# Run migrations

## 🔒 Security Featuresnpm run migration:run



1. **Sensitive Data Exclusion**: Banking numbers excluded from normal responses# Revert last migration

2. **Secure Endpoints**: Separate DTO for banking info (owner/admin only)npm run migration:revert

3. **JWT Authentication**: All endpoints require valid JWT```

4. **Role-Based Access**: Guards for admin vs seller permissions

5. **Input Validation**: All inputs validated with class-validator## ✅ Day 1 Completed Tasks

6. **State Machine**: Prevents invalid status transitions

- [x] Created Seller Service NestJS project

## 📁 Project Structure- [x] Setup Clean Architecture folder structure

- [x] Configured TypeORM with MySQL

```- [x] Created Seller entity with 35+ columns

seller-service/- [x] Created database docker-compose (port 3313)

├── src/- [x] Generated and ran initial migration

│   ├── application/         # DTOs and use cases- [x] Created SellerRepository with CRUD operations

│   ├── domain/             # Business logic and entities- [x] Configured environment variables

│   ├── infrastructure/     # Database and external services- [x] Added health check endpoint

│   ├── interfaces/         # Controllers and API- [x] Service running on port 3010

│   └── shared/             # Common utilities- [x] Database running on port 3313

├── docker-compose.yml      # Database container

├── .env                    # Environment variables## 🎯 Next Steps (Day 2)

├── package.json            # Dependencies and scripts

├── tsconfig.json           # TypeScript config- [ ] Create DTOs (Create, Update, Response, Filter)

├── DAY-1-SUMMARY.md        # Day 1 progress- [ ] Create SellerService with business logic

└── DAY-2-SUMMARY.md        # Day 2 progress- [ ] Implement verification workflow

```- [ ] Add validation rules

- [ ] Write unit tests

## 📈 Metrics & Analytics (Day 5)

## 📚 Documentation

Planned analytics endpoints:

- Seller dashboard (products, sales, revenue)- [Implementation Plan](../docs/ecommerce/ECOMMERCE-IMPLEMENTATION-PLAN.md)

- Performance metrics (rating trends, sales trends)- [Task Breakdown](../docs/ecommerce/MARKETPLACE-TASKS.md)

- Commission calculations

- Payout history## 🔗 Related Services



## 🔗 External Service Integration- **Auth Service** (3001) - Authentication

- **User Service** (3003) - User management

**User Service** (Port 3003):- **Product Service** (3008) - Will use seller_id

- Validate userId during registration- **Order Service** (3009) - Will track seller orders

- Fetch user details for seller profiles- **Payout Service** (3011) - Will calculate seller payouts



**Product Service** (Future):## 📞 Support

- Increment/decrement product counts

- Validate seller ownershipFor issues or questions, refer to the main project documentation.


**Order Service** (Future):
- Record sales and revenue
- Calculate commissions

**Review Service** (Future):
- Update seller ratings
- Aggregate review counts

## 🐛 Troubleshooting

### Port 3313 already in use
```bash
docker ps --filter "publish=3313"
docker stop <container_id>
```

### Migration failed
```bash
npm run migration:revert
npm run migration:run
```

### Database connection refused
```bash
docker-compose down
docker-compose up -d
```

## 📚 Documentation

- **Day 1 Summary**: [DAY-1-SUMMARY.md](./DAY-1-SUMMARY.md) - Foundation setup
- **Day 2 Summary**: [DAY-2-SUMMARY.md](./DAY-2-SUMMARY.md) - Business logic implementation
- **Postman Collection**: Coming in Day 3
- **API Documentation**: Coming in Day 3

## 🤝 Contributing

1. Follow Clean Architecture principles
2. Write unit tests for all business logic (>80% coverage)
3. Use DTOs for all input/output
4. Validate all inputs with class-validator
5. Follow NestJS best practices

## 📄 License

MIT

## 👥 Team

Part of the fullstack-project multi-seller marketplace.

**Related Services**:
- Auth Service (Port 3001)
- User Service (Port 3003)
- Carrier Service (Port 3002)
- Customer Service (Port 3004)
- Pricing Service (Port 3005)

---

**Last Updated**: January 2025  
**Current Status**: Day 2 Complete (Business Logic with 97.8% test coverage)  
**Next**: Day 3 - API endpoints, controllers, guards, Postman collection
