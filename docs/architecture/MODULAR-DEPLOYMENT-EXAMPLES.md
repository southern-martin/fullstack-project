# 🏗️ Modular Deployment Examples - Real-World Implementation

## 📋 Your Specific Use Case

### **Client Requirements**
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Deployments                      │
├─────────────────────────────────────────────────────────────┤
│ Client 1: Authentication + User + CMS + Gallery            │
│ Client 2: Authentication + User + Gallery + Custom Module 1│
│ Client 3: Custom Module 1 + Custom Module 2                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Implementation Examples

### **Example 1: Client 1 - Restaurant Chain CMS**

#### **Module Configuration**
```json
// deployments/client-1/modules.json
{
  "client": "client-1",
  "name": "Restaurant Chain CMS",
  "description": "Content management system for restaurant chain",
  "modules": [
    {
      "name": "authentication",
      "enabled": true,
      "config": {
        "jwtSecret": "restaurant-chain-secret-2024",
        "sessionTimeout": 3600,
        "allowRememberMe": true,
        "maxLoginAttempts": 5
      }
    },
    {
      "name": "user-management",
      "enabled": true,
      "config": {
        "allowSelfRegistration": false,
        "requireEmailVerification": true,
        "defaultRole": "editor",
        "passwordPolicy": {
          "minLength": 8,
          "requireUppercase": true,
          "requireNumbers": true,
          "requireSpecialChars": true
        }
      }
    },
    {
      "name": "cms",
      "enabled": true,
      "config": {
        "allowComments": true,
        "enableSEO": true,
        "enableMultiLanguage": false,
        "defaultLanguage": "en",
        "contentTypes": ["page", "post", "menu", "promotion"],
        "mediaLibrary": {
          "maxFileSize": "10MB",
          "allowedFormats": ["jpg", "png", "gif", "pdf"]
        }
      }
    },
    {
      "name": "gallery",
      "enabled": true,
      "config": {
        "maxFileSize": "10MB",
        "allowedFormats": ["jpg", "png", "gif"],
        "enableWatermark": true,
        "watermarkText": "Restaurant Chain",
        "thumbnailSizes": ["150x150", "300x300", "600x600"],
        "enableImageOptimization": true
      }
    }
  ],
  "database": {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "database": "restaurant_chain_cms",
    "username": "restaurant_user",
    "password": "restaurant_password_2024"
  },
  "features": {
    "multiLanguage": false,
    "analytics": true,
    "backup": true,
    "ssl": true,
    "cdn": false
  },
  "deployment": {
    "host": "restaurant-chain.com",
    "username": "deploy",
    "keyPath": "~/.ssh/restaurant_chain_key",
    "outputPath": "./builds/client-1"
  }
}
```

#### **Generated App Module**
```typescript
// builds/client-1/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/database.module';

// Module imports
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { CmsModule } from './modules/cms/cms.module';
import { GalleryModule } from './modules/gallery/gallery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    AuthenticationModule,
    UserManagementModule,
    CmsModule,
    GalleryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

#### **Generated Package.json**
```json
{
  "name": "restaurant-chain-cms",
  "version": "1.0.0",
  "description": "Content management system for restaurant chain",
  "main": "dist/main.js",
  "scripts": {
    "start": "node dist/main.js",
    "start:dev": "nodemon src/main.ts",
    "build": "nest build",
    "test": "jest"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "typeorm": "^0.3.0",
    "mysql2": "^3.0.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "bcrypt": "^5.1.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### **Example 2: Client 2 - Fashion Store Gallery**

#### **Module Configuration**
```json
// deployments/client-2/modules.json
{
  "client": "client-2",
  "name": "Fashion Store Gallery",
  "description": "Gallery and user management for fashion store",
  "modules": [
    {
      "name": "authentication",
      "enabled": true,
      "config": {
        "jwtSecret": "fashion-store-secret-2024",
        "sessionTimeout": 7200,
        "allowRememberMe": true,
        "maxLoginAttempts": 3,
        "enableSocialLogin": true,
        "socialProviders": ["google", "facebook"]
      }
    },
    {
      "name": "user-management",
      "enabled": true,
      "config": {
        "allowSelfRegistration": true,
        "requireEmailVerification": false,
        "defaultRole": "user",
        "enableProfilePictures": true,
        "enableUserPreferences": true,
        "passwordPolicy": {
          "minLength": 6,
          "requireUppercase": false,
          "requireNumbers": true,
          "requireSpecialChars": false
        }
      }
    },
    {
      "name": "gallery",
      "enabled": true,
      "config": {
        "maxFileSize": "50MB",
        "allowedFormats": ["jpg", "png", "gif", "mp4", "webm"],
        "enableWatermark": false,
        "thumbnailSizes": ["200x200", "400x400", "800x800", "1200x1200"],
        "enableImageOptimization": true,
        "enableVideoProcessing": true,
        "enableImageFilters": true,
        "enableBatchUpload": true,
        "maxFilesPerUpload": 20
      }
    },
    {
      "name": "custom-module-1",
      "enabled": true,
      "config": {
        "customSetting1": "fashion_catalog",
        "customSetting2": "product_showcase",
        "enableProductLinking": true,
        "enableWishlist": true,
        "enableSharing": true,
        "socialSharing": {
          "facebook": true,
          "instagram": true,
          "pinterest": true
        }
      }
    }
  ],
  "database": {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "database": "fashion_store_gallery",
    "username": "fashion_user",
    "password": "fashion_password_2024"
  },
  "features": {
    "multiLanguage": true,
    "analytics": false,
    "backup": true,
    "ssl": true,
    "cdn": true
  },
  "deployment": {
    "host": "fashion-store.com",
    "username": "deploy",
    "keyPath": "~/.ssh/fashion_store_key",
    "outputPath": "./builds/client-2"
  }
}
```

#### **Generated App Module**
```typescript
// builds/client-2/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/database.module';

// Module imports
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { CustomModule1Module } from './modules/custom-module-1/custom-module-1.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    AuthenticationModule,
    UserManagementModule,
    GalleryModule,
    CustomModule1Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### **Example 3: Client 3 - Custom Business Solution**

#### **Module Configuration**
```json
// deployments/client-3/modules.json
{
  "client": "client-3",
  "name": "Custom Business Solution",
  "description": "Custom modules for business automation",
  "modules": [
    {
      "name": "custom-module-1",
      "enabled": true,
      "config": {
        "customSetting1": "business_automation",
        "customSetting2": "workflow_management",
        "enableTaskManagement": true,
        "enableProjectTracking": true,
        "enableTimeTracking": true,
        "enableReporting": true,
        "integrations": {
          "slack": true,
          "trello": false,
          "asana": true
        }
      }
    },
    {
      "name": "custom-module-2",
      "enabled": true,
      "config": {
        "customSetting3": "inventory_management",
        "customSetting4": "order_processing",
        "enableInventoryTracking": true,
        "enableOrderManagement": true,
        "enableSupplierManagement": true,
        "enablePurchaseOrders": true,
        "enableBarcodeScanning": true,
        "enableLowStockAlerts": true
      }
    }
  ],
  "database": {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "database": "custom_business_solution",
    "username": "business_user",
    "password": "business_password_2024"
  },
  "features": {
    "multiLanguage": false,
    "analytics": false,
    "backup": false,
    "ssl": false,
    "cdn": false
  },
  "deployment": {
    "host": "business-solution.local",
    "username": "deploy",
    "keyPath": "~/.ssh/business_solution_key",
    "outputPath": "./builds/client-3"
  }
}
```

#### **Generated App Module**
```typescript
// builds/client-3/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/database.module';

// Module imports
import { CustomModule1Module } from './modules/custom-module-1/custom-module-1.module';
import { CustomModule2Module } from './modules/custom-module-2/custom-module-2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    CustomModule1Module,
    CustomModule2Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

---

## 🛠️ Build Tool Implementation

### **Module Resolver with Dependency Resolution**
```typescript
// tools/build-tool/src/module-resolver.ts
export class ModuleResolver {
  private moduleRegistry: Map<string, ModuleDefinition> = new Map();
  
  constructor() {
    this.loadModuleRegistry();
  }
  
  resolveModules(clientConfig: ClientConfig): ModuleDefinition[] {
    const enabledModules = clientConfig.modules
      .filter(module => module.enabled)
      .map(module => module.name);
    
    // Resolve dependencies
    const resolvedModules = this.resolveDependencies(enabledModules);
    
    return resolvedModules.map(moduleName => 
      this.moduleRegistry.get(moduleName)
    );
  }
  
  private resolveDependencies(modules: string[]): string[] {
    const resolved: string[] = [];
    const toResolve = [...modules];
    
    while (toResolve.length > 0) {
      const moduleName = toResolve.shift()!;
      
      if (!resolved.includes(moduleName)) {
        resolved.push(moduleName);
        
        // Add dependencies
        const module = this.moduleRegistry.get(moduleName);
        if (module?.dependencies) {
          toResolve.push(...module.dependencies);
        }
      }
    }
    
    return resolved;
  }
  
  private loadModuleRegistry(): void {
    // Load module definitions
    this.moduleRegistry.set('authentication', {
      name: 'authentication',
      className: 'AuthenticationModule',
      dependencies: [],
      path: './modules/authentication',
      version: '1.0.0'
    });
    
    this.moduleRegistry.set('user-management', {
      name: 'user-management',
      className: 'UserManagementModule',
      dependencies: ['authentication'],
      path: './modules/user-management',
      version: '1.0.0'
    });
    
    this.moduleRegistry.set('cms', {
      name: 'cms',
      className: 'CmsModule',
      dependencies: ['authentication', 'user-management'],
      path: './modules/cms',
      version: '1.0.0'
    });
    
    this.moduleRegistry.set('gallery', {
      name: 'gallery',
      className: 'GalleryModule',
      dependencies: ['authentication'],
      path: './modules/gallery',
      version: '1.0.0'
    });
    
    this.moduleRegistry.set('custom-module-1', {
      name: 'custom-module-1',
      className: 'CustomModule1Module',
      dependencies: [],
      path: './modules/custom-module-1',
      version: '1.0.0'
    });
    
    this.moduleRegistry.set('custom-module-2', {
      name: 'custom-module-2',
      className: 'CustomModule2Module',
      dependencies: ['custom-module-1'],
      path: './modules/custom-module-2',
      version: '1.0.0'
    });
  }
}
```

### **Build Generator with Template System**
```typescript
// tools/build-tool/src/build-generator.ts
export class BuildGenerator {
  async generateClientBuild(clientConfig: ClientConfig): Promise<void> {
    const moduleResolver = new ModuleResolver();
    const modules = moduleResolver.resolveModules(clientConfig);
    
    // Create output directory
    await fs.mkdir(clientConfig.outputPath, { recursive: true });
    
    // Generate main application file
    await this.generateMainApp(clientConfig, modules);
    
    // Generate module imports
    await this.generateModuleImports(clientConfig, modules);
    
    // Generate package.json
    await this.generatePackageJson(clientConfig, modules);
    
    // Generate Dockerfile
    await this.generateDockerfile(clientConfig, modules);
    
    // Generate environment file
    await this.generateEnvironmentFile(clientConfig);
    
    // Copy module files
    await this.copyModuleFiles(clientConfig, modules);
    
    // Copy shared files
    await this.copySharedFiles(clientConfig);
  }
  
  private async generateMainApp(clientConfig: ClientConfig, modules: ModuleDefinition[]): Promise<void> {
    const mainAppContent = `
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(\`🚀 \${process.env.APP_NAME || 'Application'} is running on: http://localhost:\${port}\`);
  console.log(\`📊 Health check: http://localhost:\${port}/health\`);
}

bootstrap();
`;
    
    await fs.writeFile(
      path.join(clientConfig.outputPath, 'src/main.ts'),
      mainAppContent
    );
  }
  
  private async generateModuleImports(clientConfig: ClientConfig, modules: ModuleDefinition[]): Promise<void> {
    const imports = modules.map(module => 
      `import { ${module.className} } from './modules/${module.name}/${module.name}.module';`
    ).join('\n');
    
    const moduleDeclarations = modules.map(module => 
      `    ${module.className},`
    ).join('\n');
    
    const appModuleContent = `
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/database.module';

${imports}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
${moduleDeclarations}
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
`;
    
    await fs.writeFile(
      path.join(clientConfig.outputPath, 'src/app.module.ts'),
      appModuleContent
    );
  }
  
  private async generatePackageJson(clientConfig: ClientConfig, modules: ModuleDefinition[]): Promise<void> {
    const packageJson = {
      name: clientConfig.name.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      description: clientConfig.description,
      main: "dist/main.js",
      scripts: {
        start: "node dist/main.js",
        start:dev: "nodemon src/main.ts",
        build: "nest build",
        test: "jest"
      },
      dependencies: this.getDependencies(modules),
      devDependencies: this.getDevDependencies()
    };
    
    await fs.writeFile(
      path.join(clientConfig.outputPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  }
  
  private getDependencies(modules: ModuleDefinition[]): Record<string, string> {
    const baseDependencies = {
      "@nestjs/common": "^10.0.0",
      "@nestjs/core": "^10.0.0",
      "@nestjs/config": "^3.0.0",
      "@nestjs/typeorm": "^10.0.0",
      "typeorm": "^0.3.0",
      "mysql2": "^3.0.0",
      "class-validator": "^0.14.0",
      "class-transformer": "^0.5.0"
    };
    
    // Add module-specific dependencies
    if (modules.some(m => m.name === 'authentication')) {
      baseDependencies["@nestjs/jwt"] = "^10.0.0";
      baseDependencies["@nestjs/passport"] = "^10.0.0";
      baseDependencies["passport"] = "^0.6.0";
      baseDependencies["passport-jwt"] = "^4.0.0";
      baseDependencies["bcrypt"] = "^5.1.0";
    }
    
    if (modules.some(m => m.name === 'gallery')) {
      baseDependencies["multer"] = "^1.4.0";
      baseDependencies["sharp"] = "^0.32.0";
    }
    
    return baseDependencies;
  }
  
  private getDevDependencies(): Record<string, string> {
    return {
      "@nestjs/cli": "^10.0.0",
      "@nestjs/testing": "^10.0.0",
      "@types/node": "^20.0.0",
      "typescript": "^5.0.0",
      "nodemon": "^3.0.0"
    };
  }
}
```

---

## 🚀 Deployment Commands

### **Build Commands**
```bash
# Build Client 1 (Restaurant Chain CMS)
npm run build:client1

# Build Client 2 (Fashion Store Gallery)
npm run build:client2

# Build Client 3 (Custom Business Solution)
npm run build:client3

# Build all clients
npm run build:all
```

### **Deploy Commands**
```bash
# Deploy Client 1
npm run deploy:client1

# Deploy Client 2
npm run deploy:client2

# Deploy Client 3
npm run deploy:client3

# Deploy all clients
npm run deploy:all
```

### **Development Commands**
```bash
# Start development for Client 1
cd builds/client-1
npm install
npm run start:dev

# Start development for Client 2
cd builds/client-2
npm install
npm run start:dev

# Start development for Client 3
cd builds/client-3
npm install
npm run start:dev
```

---

## 📊 Benefits Summary

### **✅ For Your Use Case**
1. **Selective Module Deployment**: Each client gets only the modules they need
2. **Code Reusability**: Share modules across multiple clients
3. **Independent Development**: Work on modules separately
4. **Easy Maintenance**: Update modules independently
5. **Client Isolation**: Each client gets their own build
6. **Configuration Management**: Per-client configuration
7. **Scalability**: Easy to add new modules and clients

### **✅ Business Benefits**
- **Cost Efficiency**: Deploy only what's needed
- **Faster Development**: Reuse existing modules
- **Easy Updates**: Update specific modules per client
- **Client Satisfaction**: Customized solutions per client

### **✅ Technical Benefits**
- **Modular Architecture**: Clean separation of concerns
- **Dependency Management**: Automatic dependency resolution
- **Build Automation**: Automated build and deployment
- **Version Control**: Track changes per module

This modular deployment architecture is perfect for your scenario where different clients need different combinations of modules! 🚀
