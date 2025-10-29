# 🚀 Ecommerce Quick Start Guide

**Date:** October 29, 2025  
**Goal:** Start Product Service implementation with Categories (Phase 1, Week 1)

**Architecture Decision:** Product Service includes Products, Categories, and Attributes in one service for better domain cohesion and performance.

---

## 📋 Immediate Next Steps (This Week)

### **TODAY: Product Service Foundation (Products + Categories + Images)**

#### 1. Create Product Service Project (30 minutes)
```bash
cd /opt/cursor-project/fullstack-project

# Create new NestJS service
npx @nestjs/cli new product-service

# Navigate to service
cd product-service

# Install core dependencies
npm install @nestjs/typeorm typeorm mysql2
npm install @nestjs/config class-validator class-transformer
npm install ioredis
npm install -D @types/node @types/ioredis
```

#### 2. Create Clean Architecture Structure (15 minutes)
```bash
# Create directory structure matching existing services
mkdir -p src/domain/{entities,repositories,services}
mkdir -p src/application/{use-cases,dtos}
mkdir -p src/infrastructure/{database/typeorm,redis,config}
mkdir -p src/interfaces/http
mkdir -p scripts
```

#### 3. Setup Database Configuration (30 minutes)

**Create `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  product-db:
    image: mysql:8.0
    container_name: product-database
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: product_root_pass_2024
      MYSQL_DATABASE: product_db
      MYSQL_USER: product_user
      MYSQL_PASSWORD: product_pass_2024
    ports:
      - "3308:3306"
    volumes:
      - product_db_data:/var/lib/mysql
    networks:
      - product-network

volumes:
  product_db_data:

networks:
  product-network:
    driver: bridge
```

**Create `.env` file:**
```env
# Application
NODE_ENV=development
PORT=3008

# Database
DB_HOST=localhost
DB_PORT=3308
DB_USERNAME=product_user
DB_PASSWORD=product_pass_2024
DB_NAME=product_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=shared_redis_password_2024

# JWT (for authentication)
JWT_SECRET=product_service_secret_key_2024

# Other Services
AUTH_SERVICE_URL=http://localhost:3001
TRANSLATION_SERVICE_URL=http://localhost:3007
```

#### 4. Create Product Entity (45 minutes)

**File:** `src/domain/entities/product.entity.ts`
```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity('products')
@Index('idx_sku', ['sku'])
@Index('idx_name', ['name'])
@Index('idx_price', ['price'])
@Index('idx_stock', ['stockQuantity'])
@Index('idx_active', ['isActive'])
@Index('idx_created', ['createdAt'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 255 })
  @Index({ fulltext: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  @Index({ fulltext: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  shortDescription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'int', default: 0 })
  minStock: number;

  @Column({ type: 'int', nullable: true })
  maxStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'json', nullable: true })
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;

  @Column({ type: 'int', nullable: true })
  createdById: number;

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
    eager: false,
  })
  images: ProductImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**File:** `src/domain/entities/product-image.entity.ts`
```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
@Index('idx_product', ['productId'])
@Index('idx_primary', ['isPrimary'])
@Index('idx_sort', ['sortOrder'])
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar', length: 500 })
  imageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  altText: string;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

**File:** `src/domain/entities/category.entity.ts`
```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('categories')
@Index('idx_slug', ['slug'])
@Index('idx_parent', ['parentId'])
@Index('idx_active', ['isActive'])
@Index('idx_sort', ['sortOrder'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  parentId: number;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

### **TOMORROW: DTOs & Repository**

#### 5. Create DTOs (1 hour)

**File:** `src/application/dtos/create-product.dto.ts`
```typescript
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsObject,
  Min,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  shortDescription?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  cost?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stockQuantity?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minStock?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxStock?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @IsObject()
  @IsOptional()
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  metaKeywords?: string;

  @IsNumber()
  @IsOptional()
  createdById?: number;
}
```

**File:** `src/application/dtos/update-product.dto.ts`
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

**File:** `src/application/dtos/product-response.dto.ts`
```typescript
import { Exclude, Expose, Type } from 'class-transformer';

class ProductImageDto {
  @Expose()
  id: number;

  @Expose()
  imageUrl: string;

  @Expose()
  altText: string;

  @Expose()
  isPrimary: boolean;

  @Expose()
  sortOrder: number;
}

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  sku: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  shortDescription: string;

  @Expose()
  price: number;

  @Expose()
  cost: number;

  @Expose()
  stockQuantity: number;

  @Expose()
  minStock: number;

  @Expose()
  maxStock: number;

  @Expose()
  weight: number;

  @Expose()
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  @Expose()
  isActive: boolean;

  @Expose()
  isFeatured: boolean;

  @Expose()
  metaTitle: string;

  @Expose()
  metaDescription: string;

  @Expose()
  metaKeywords: string;

  @Expose()
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  createdById: number;
}
```

#### 6. Create Repository (1 hour)

**File:** `src/domain/repositories/product.repository.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

export interface IProductRepository {
  create(product: Partial<Product>): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(page: number, limit: number, filters?: any): Promise<[Product[], number]>;
  update(id: number, product: Partial<Product>): Promise<Product>;
  delete(id: number): Promise<void>;
  search(query: string, page: number, limit: number): Promise<[Product[], number]>;
  findLowStock(threshold: number): Promise<Product[]>;
  updateStock(id: number, quantity: number): Promise<Product>;
}

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.repository.create(product);
    return await this.repository.save(newProduct);
  }

  async findById(id: number): Promise<Product | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return await this.repository.findOne({
      where: { sku },
      relations: ['images'],
    });
  }

  async findAll(
    page: number,
    limit: number,
    filters?: any,
  ): Promise<[Product[], number]> {
    const query = this.repository.createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images');

    if (filters?.isActive !== undefined) {
      query.andWhere('product.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters?.isFeatured !== undefined) {
      query.andWhere('product.isFeatured = :isFeatured', { isFeatured: filters.isFeatured });
    }

    if (filters?.minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters?.maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.createdAt', 'DESC');

    return await query.getManyAndCount();
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    await this.repository.update(id, product);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async search(query: string, page: number, limit: number): Promise<[Product[], number]> {
    return await this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.name LIKE :query', { query: `%${query}%` })
      .orWhere('product.description LIKE :query', { query: `%${query}%` })
      .orWhere('product.sku LIKE :query', { query: `%${query}%` })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async findLowStock(threshold: number): Promise<Product[]> {
    return await this.repository
      .createQueryBuilder('product')
      .where('product.stockQuantity <= :threshold', { threshold })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    await this.repository.update(id, { stockQuantity: quantity });
    return await this.findById(id);
  }
}
```

**File:** `src/domain/repositories/category.repository.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

export interface ICategoryRepository {
  create(category: Partial<Category>): Promise<Category>;
  findById(id: number): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findTree(): Promise<Category[]>;
  findChildren(parentId: number): Promise<Category[]>;
  findAncestors(id: number): Promise<Category[]>;
  update(id: number, category: Partial<Category>): Promise<Category>;
  delete(id: number): Promise<void>;
  move(id: number, newParentId: number | null): Promise<Category>;
}

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async create(category: Partial<Category>): Promise<Category> {
    const newCategory = this.repository.create(category);
    return await this.repository.save(newCategory);
  }

  async findById(id: number): Promise<Category | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['children', 'parent'],
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return await this.repository.findOne({
      where: { slug },
      relations: ['children', 'parent'],
    });
  }

  async findAll(): Promise<Category[]> {
    return await this.repository.find({
      relations: ['parent'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findTree(): Promise<Category[]> {
    // Get all root categories (no parent)
    const roots = await this.repository.find({
      where: { parentId: null },
      relations: ['children'],
      order: { sortOrder: 'ASC' },
    });
    
    // Recursively load children
    for (const root of roots) {
      await this.loadChildren(root);
    }
    
    return roots;
  }

  private async loadChildren(category: Category): Promise<void> {
    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        await this.loadChildren(child);
      }
    }
  }

  async findChildren(parentId: number): Promise<Category[]> {
    return await this.repository.find({
      where: { parentId },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findAncestors(id: number): Promise<Category[]> {
    const ancestors: Category[] = [];
    let current = await this.findById(id);
    
    while (current?.parent) {
      ancestors.unshift(current.parent);
      current = current.parent;
    }
    
    return ancestors;
  }

  async update(id: number, category: Partial<Category>): Promise<Category> {
    await this.repository.update(id, category);
    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async move(id: number, newParentId: number | null): Promise<Category> {
    await this.repository.update(id, { parentId: newParentId });
    return await this.findById(id);
  }
}
```

---

### **DAY 3-4: Service Layer & Controller**

#### 7. Create Product Service (2 hours)
#### 8. Create Product Controller (2 hours)
#### 9. Setup TypeORM Module (1 hour)
#### 10. Create Migrations (1 hour)

---

## 📚 Reference Files to Copy From

### For Clean Architecture
- `auth-service/src/` - Complete structure
- `translation-service/src/` - Entity/Repository patterns
- `customer-service/src/` - Simple CRUD example

### For Migrations
- `pricing-service/src/infrastructure/database/typeorm/migrations/`
- `translation-service/src/infrastructure/database/typeorm/migrations/`

### For DTOs & Validation
- `auth-service/src/application/dtos/`
- `user-service/src/application/dtos/`

### For Controllers
- `customer-service/src/interfaces/http/customer.controller.ts`
- `carrier-service/src/interfaces/http/carrier.controller.ts`

---

## ✅ Definition of Done (Week 1)

By end of Week 1, you should have:

- [x] Product Service project created
- [x] Database running on port 3308
- [x] Product, ProductImage, and Category entities
- [x] Product and Category DTOs created and validated
- [x] ProductRepository and CategoryRepository with CRUD operations
- [x] ProductService and CategoryService with business logic
- [x] ProductController and CategoryController with REST endpoints
- [x] Migrations created and run for all tables
- [x] Service running on port 3008
- [x] Health check endpoint working
- [x] Postman collection created for both Products and Categories
- [x] Basic unit tests written
- [x] README.md documented

---

## 🔍 Testing Checklist

```bash
# 1. Start database
docker-compose up -d

# 2. Run migrations
npm run migration:run

# 3. Start service
npm run start:dev

# 4. Test health check
curl http://localhost:3008/health

# 5. Test create product
curl -X POST http://localhost:3008/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "TEST-001",
    "name": "Test Product",
    "description": "Test description",
    "price": 99.99,
    "stockQuantity": 100
  }'

# 6. Test get products
curl http://localhost:3008/api/v1/products

# 7. Test create category
curl -X POST http://localhost:3008/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic products"
  }'

# 8. Test get category tree
curl http://localhost:3008/api/v1/categories/tree

# 9. Run unit tests
npm test
```

---

## 🎯 Success Criteria

### Week 1 Goals
- ✅ Product Service fully functional (Products + Categories + Images)
- ✅ All CRUD operations working for products and categories
- ✅ Hierarchical category tree working
- ✅ Database migrations complete
- ✅ API endpoints documented
- ✅ Basic tests passing

### Ready for Week 2
- Order Service implementation (port 3009)
- Same clean architecture pattern
- Similar testing approach

---

**Start with:** Product Service setup (today!)  
**Questions?** Check existing services for patterns  
**Stuck?** Review ECOMMERCE-IMPLEMENTATION-PLAN.md for details

**Architecture Note:** We combined Product + Category services into one for better performance and simpler operations!

---

**Good luck! 🚀**
