# Seller Service<p align="center">

  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

Multi-seller marketplace - Seller management microservice</p>



## 🎯 Overview[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

The Seller Service manages seller registration, verification, profiles, and metrics in the multi-seller marketplace platform.

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## 📦 Tech Stack    <p align="center">

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

- **Framework**: NestJS 10<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

- **Database**: MySQL 8.0 (Port 3313)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

- **ORM**: TypeORM<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

- **Validation**: class-validator, class-transformer<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>

- **Authentication**: JWT (via Auth Service)<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

- **Caching**: Redis<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

- **Port**: 3010<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

## 🗄️ Database Schema    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

### Sellers Table</p>

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

```sql  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

- id (PK)

- user_id (FK to User Service, UNIQUE)## Description

- business_name

- business_type (individual, sole_proprietor, llc, corporation, partnership)[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

- business_email, business_phone

- tax_id## Project setup

- business_address, city, state, country, postal_code

- logo_url, description, website```bash

- status (pending, active, suspended, rejected)$ npm install

- verification_status (unverified, pending, verified, rejected)```

- verified_at, verified_by (admin user ID)

- rejection_reason, suspension_reason## Compile and run the project

- rating (decimal 3,2)

- total_reviews, total_products, total_sales, total_revenue```bash

- commission_rate (decimal 5,2, nullable - uses platform default if null)# development

- bank_name, bank_account_holder, bank_account_number, bank_routing_number$ npm run start

- payment_method (bank_transfer, paypal, stripe)

- created_at, updated_at, last_login_at# watch mode

```$ npm run start:dev



**Indexes**:# production mode

- user_id (unique)$ npm run start:prod

- status```

- verification_status

- rating## Run tests

- business_name

- created_at```bash

# unit tests

## 🚀 Getting Started$ npm run test



### Prerequisites# e2e tests

$ npm run test:e2e

- Node.js 18+

- Docker and Docker Compose# test coverage

- MySQL 8.0$ npm run test:cov

```

### Installation

## Deployment

```bash

# Install dependenciesWhen you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

npm install

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

# Start database

docker-compose up -d```bash

$ npm install -g mau

# Run migrations$ mau deploy

npm run migration:run```



# Start service in developmentWith Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

npm run start:dev

```## Resources



### Environment VariablesCheck out a few resources that may come in handy when working with NestJS:



Copy `.env` file and configure:- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

```env- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

NODE_ENV=development- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

PORT=3010- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

# Database- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

DB_HOST=localhost- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

DB_PORT=3313

DB_USERNAME=seller_user## Support

DB_PASSWORD=seller_password

DB_DATABASE=seller_dbNest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

DB_SYNCHRONIZE=false

DB_MIGRATIONS_RUN=true## Stay in touch



# JWT- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

JWT_SECRET=your_secret_key- Website - [https://nestjs.com](https://nestjs.com/)

- Twitter - [@nestframework](https://twitter.com/nestframework)

# Redis

REDIS_HOST=localhost## License

REDIS_PORT=6379

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# External Services
USER_SERVICE_URL=http://localhost:3003/api/v1
AUTH_SERVICE_URL=http://localhost:3001/api/v1

# Seller Config
DEFAULT_COMMISSION_RATE=15.00
MIN_PAYOUT_THRESHOLD=50.00
```

## 📡 API Endpoints

### Health Check
```
GET /api/v1/health
```

### Seller Endpoints (Coming in Day 3)
```
POST   /api/v1/sellers              - Register seller
GET    /api/v1/sellers              - List sellers (admin)
GET    /api/v1/sellers/:id          - Get seller details
GET    /api/v1/sellers/user/:userId - Get by user ID
PATCH  /api/v1/sellers/:id          - Update seller
DELETE /api/v1/sellers/:id          - Delete seller
POST   /api/v1/sellers/:id/verify   - Submit for verification
POST   /api/v1/sellers/:id/approve  - Admin approve
POST   /api/v1/sellers/:id/reject   - Admin reject
POST   /api/v1/sellers/:id/suspend  - Admin suspend
```

## 🏗️ Project Structure (Clean Architecture)

```
src/
├── application/          # Use cases and business logic
│   ├── dto/             # Data Transfer Objects
│   └── use-cases/       # Business use cases
├── domain/              # Domain layer
│   ├── entities/        # Domain entities (interfaces)
│   ├── repositories/    # Repository interfaces
│   └── services/        # Domain services
├── infrastructure/      # Infrastructure layer
│   ├── database/
│   │   └── typeorm/
│   │       ├── entities/      # TypeORM entities
│   │       ├── repositories/  # Repository implementations
│   │       └── migrations/    # Database migrations
│   └── external-services/     # External API clients
├── interfaces/          # Interface adapters
│   └── http/
│       └── controllers/ # HTTP controllers
└── shared/              # Shared utilities
    ├── guards/          # Auth guards
    ├── interceptors/    # Response interceptors
    ├── filters/         # Exception filters
    └── decorators/      # Custom decorators
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Database Migrations

```bash
# Generate migration
npm run migration:generate -- src/infrastructure/database/typeorm/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## ✅ Day 1 Completed Tasks

- [x] Created Seller Service NestJS project
- [x] Setup Clean Architecture folder structure
- [x] Configured TypeORM with MySQL
- [x] Created Seller entity with 35+ columns
- [x] Created database docker-compose (port 3313)
- [x] Generated and ran initial migration
- [x] Created SellerRepository with CRUD operations
- [x] Configured environment variables
- [x] Added health check endpoint
- [x] Service running on port 3010
- [x] Database running on port 3313

## 🎯 Next Steps (Day 2)

- [ ] Create DTOs (Create, Update, Response, Filter)
- [ ] Create SellerService with business logic
- [ ] Implement verification workflow
- [ ] Add validation rules
- [ ] Write unit tests

## 📚 Documentation

- [Implementation Plan](../docs/ecommerce/ECOMMERCE-IMPLEMENTATION-PLAN.md)
- [Task Breakdown](../docs/ecommerce/MARKETPLACE-TASKS.md)

## 🔗 Related Services

- **Auth Service** (3001) - Authentication
- **User Service** (3003) - User management
- **Product Service** (3008) - Will use seller_id
- **Order Service** (3009) - Will track seller orders
- **Payout Service** (3011) - Will calculate seller payouts

## 📞 Support

For issues or questions, refer to the main project documentation.
