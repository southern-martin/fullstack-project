# 🏗️ Microservice-Oriented Architecture - Evolutionary Approach

## 📋 Current System Evolution Strategy

### **🎯 Approach: Modular Monolith → Microservice-Oriented → True Microservices**

Instead of a complete rewrite, we'll **evolve the current modular architecture** into a **microservice-oriented structure** that can be easily broken into true microservices when needed.

```
┌─────────────────────────────────────────────────────────────┐
│                    Evolution Timeline                       │
├─────────────────────────────────────────────────────────────┤
│ Phase 1: Current Modular Monolith                          │
│ Phase 2: Microservice-Oriented Architecture                │
│ Phase 3: True Microservices (When System Grows)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Phase 2: Microservice-Oriented Architecture

### **Core Principles**
1. **Keep Current Structure**: Maintain existing modular architecture
2. **Add Service Boundaries**: Define clear service boundaries
3. **Implement Service Communication**: Add inter-module communication
4. **Prepare for Extraction**: Make modules easily extractable
5. **Maintain Single Deployment**: Still deploy as one application

### **Architecture Overview**
```
┌─────────────────────────────────────────────────────────────┐
│                Microservice-Oriented Monolith              │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│ │   Auth Service  │  │  User Service   │  │Customer Service ││
│ │   (Module)      │  │   (Module)      │  │   (Module)      ││
│ │                 │  │                 │  │                 ││
│ │ • Controllers   │  │ • Controllers   │  │ • Controllers   ││
│ │ • Services      │  │ • Services      │  │ • Services      ││
│ │ • DTOs          │  │ • DTOs          │  │ • DTOs          ││
│ │ • Entities      │  │ • Entities      │  │ • Entities      ││
│ │ • Events        │  │ • Events        │  │ • Events        ││
│ └─────────────────┘  └─────────────────┘  └─────────────────┘│
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│ │Carrier Service  │  │Pricing Service  │  │Shared Services  ││
│ │   (Module)      │  │   (Module)      │  │                 ││
│ │                 │  │                 │  │ • Database      ││
│ │ • Controllers   │  │ • Controllers   │  │ • Events        ││
│ │ • Services      │  │ • Services      │  │ • Validation    ││
│ │ • DTOs          │  │ • DTOs          │  │ • Logging       ││
│ │ • Entities      │  │ • Entities      │  │ • Monitoring    ││
│ │ • Events        │  │ • Events        │  │                 ││
│ └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Service Registry  │
                    │  (Internal)        │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Event Bus        │
                    │  (Internal)       │
                    └───────────────────┘
```

---

## 🛠️ Implementation Strategy

### **1. Service Boundary Definition**

#### **Current Module Structure**
```
nestjs-app-api/
├── src/
│   ├── modules/
│   │   ├── auth/           # → Auth Service
│   │   ├── users/          # → User Service
│   │   ├── customer/       # → Customer Service
│   │   ├── carrier/        # → Carrier Service
│   │   └── pricing/        # → Pricing Service
│   └── shared/             # → Shared Services
```

#### **Enhanced Service Structure**
```
nestjs-app-api/
├── src/
│   ├── modules/            # Enhanced Modules
│   │   ├── auth/           # Auth Service Module
│   │   │   ├── api/                    # Controllers
│   │   │   ├── application/
│   │   │   │   ├── dto/               # Data Transfer Objects
│   │   │   │   └── services/          # Auth Service Implementation
│   │   │   │       └── auth.service.ts
│   │   │   ├── domain/                # Domain Logic
│   │   │   ├── infrastructure/        # External Dependencies
│   │   │   └── auth.module.ts
│   │   ├── users/          # User Service Module
│   │   │   ├── api/                    # Controllers
│   │   │   ├── application/
│   │   │   │   ├── dto/               # Data Transfer Objects
│   │   │   │   └── services/          # User Service Implementation
│   │   │   │       ├── user.service.ts
│   │   │   │       └── role.service.ts
│   │   │   ├── domain/                # Domain Logic
│   │   │   ├── infrastructure/        # Repositories
│   │   │   └── users.module.ts
│   │   └── ...
│   ├── shared/             # Shared Infrastructure
│   │   ├── services/
│   │   │   ├── service-registry.service.ts
│   │   │   ├── event-bus.service.ts
│   │   │   ├── service-communication.service.ts
│   │   │   └── health-check.service.ts
│   │   ├── events/
│   │   │   ├── base.event.ts
│   │   │   ├── user-created.event.ts
│   │   │   └── customer-updated.event.ts
│   │   └── interfaces/
│   │       ├── service.interface.ts
│   │       └── event.interface.ts
│   └── app.module.ts
```

### **📍 Actual Service Locations**

**Module-Specific Services** (Business Logic):
- `src/modules/auth/application/services/auth.service.ts`
- `src/modules/users/application/services/user.service.ts`
- `src/modules/users/application/services/role.service.ts`
- `src/modules/customer/application/services/customer.service.ts`
- `src/modules/carrier/application/services/carrier.service.ts`

**Shared Services** (Infrastructure):
- `src/shared/services/service-registry.service.ts`
- `src/shared/services/event-bus.service.ts`
- `src/shared/services/service-communication.service.ts`
- `src/shared/services/http-client.service.ts`
- `src/shared/services/circuit-breaker.service.ts`
- `src/shared/services/health-check.service.ts`

### **2. Service Communication Layer**

#### **Service Registry (Internal)**
```typescript
// src/shared/services/service-registry.service.ts
@Injectable()
export class ServiceRegistryService {
  private services = new Map<string, ServiceDefinition>();
  
  registerService(service: ServiceDefinition): void {
    this.services.set(service.name, service);
  }
  
  getService(name: string): ServiceDefinition | undefined {
    return this.services.get(name);
  }
  
  getAllServices(): ServiceDefinition[] {
    return Array.from(this.services.values());
  }
  
  healthCheck(): ServiceHealthStatus[] {
    return this.getAllServices().map(service => ({
      name: service.name,
      status: 'healthy',
      timestamp: new Date(),
      dependencies: service.dependencies
    }));
  }
}

interface ServiceDefinition {
  name: string;
  version: string;
  dependencies: string[];
  endpoints: string[];
  healthCheck: () => Promise<boolean>;
}
```

#### **Event Bus (Internal)**
```typescript
// src/shared/services/event-bus.service.ts
@Injectable()
export class EventBusService {
  private eventHandlers = new Map<string, EventHandler[]>();
  
  publish<T extends BaseEvent>(event: T): void {
    const handlers = this.eventHandlers.get(event.eventType) || [];
    handlers.forEach(handler => {
      try {
        handler.handle(event);
      } catch (error) {
        console.error(`Error handling event ${event.eventType}:`, error);
      }
    });
  }
  
  subscribe<T extends BaseEvent>(
    eventType: string, 
    handler: EventHandler<T>
  ): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }
  
  unsubscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(eventType) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
}

interface EventHandler<T extends BaseEvent = BaseEvent> {
  handle(event: T): void | Promise<void>;
}
```

#### **Service Communication**
```typescript
// src/shared/services/service-communication.service.ts
@Injectable()
export class ServiceCommunicationService {
  constructor(
    private serviceRegistry: ServiceRegistryService,
    private eventBus: EventBusService
  ) {}
  
  // Synchronous service-to-service calls
  async callService<T>(
    serviceName: string, 
    method: string, 
    params: any[]
  ): Promise<T> {
    const service = this.serviceRegistry.getService(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    
    // In microservice-oriented: direct method call
    // In true microservices: HTTP/gRPC call
    return await service.instance[method](...params);
  }
  
  // Asynchronous event-based communication
  publishEvent<T extends BaseEvent>(event: T): void {
    this.eventBus.publish(event);
  }
  
  // Request-Response pattern
  async requestResponse<TRequest, TResponse>(
    serviceName: string,
    request: TRequest
  ): Promise<TResponse> {
    // Implementation for request-response pattern
    return await this.callService<TResponse>(serviceName, 'handleRequest', [request]);
  }
}
```

### **3. Enhanced Module Structure**

#### **Auth Service Module**
```typescript
// src/modules/auth/auth.service.module.ts
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PasswordService,
    AuthServiceDefinition, // Service definition
  ],
  exports: [AuthService, AuthServiceDefinition],
})
export class AuthServiceModule implements ServiceModule {
  static readonly SERVICE_NAME = 'auth-service';
  static readonly VERSION = '1.0.0';
  static readonly DEPENDENCIES: string[] = [];
  
  constructor(
    @Inject(AuthServiceDefinition) private authServiceDef: ServiceDefinition
  ) {
    // Register service with registry
    this.authServiceDef = {
      name: AuthServiceModule.SERVICE_NAME,
      version: AuthServiceModule.VERSION,
      dependencies: AuthServiceModule.DEPENDENCIES,
      endpoints: ['/auth/login', '/auth/register', '/auth/refresh'],
      healthCheck: async () => {
        // Health check implementation
        return true;
      }
    };
  }
}

// src/modules/auth/application/services/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private eventBus: EventBusService
  ) {}
  
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Authentication logic
    const user = await this.userService.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const token = this.jwtService.sign({ 
      sub: user.id, 
      email: user.email,
      roles: user.roles.map(role => role.name)
    });
    
    // Publish event
    this.eventBus.publish(new UserLoggedInEvent({
      userId: user.id,
      email: user.email,
      timestamp: new Date()
    }));
    
    return {
      accessToken: token,
      user: user
    };
  }
}
```

#### **User Service Module**
```typescript
// src/modules/users/user.service.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [UserController, RoleController],
  providers: [
    UserService,
    RoleService,
    UserServiceDefinition,
  ],
  exports: [UserService, UserServiceDefinition],
})
export class UserServiceModule implements ServiceModule {
  static readonly SERVICE_NAME = 'user-service';
  static readonly VERSION = '1.0.0';
  static readonly DEPENDENCIES: string[] = ['auth-service'];
  
  constructor(
    @Inject(UserServiceDefinition) private userServiceDef: ServiceDefinition
  ) {
    this.userServiceDef = {
      name: UserServiceModule.SERVICE_NAME,
      version: UserServiceModule.VERSION,
      dependencies: UserServiceModule.DEPENDENCIES,
      endpoints: ['/users', '/users/:id', '/roles'],
      healthCheck: async () => {
        // Health check implementation
        return true;
      }
    };
  }
}

// src/modules/users/application/services/user.service.ts
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventBus: EventBusService
  ) {}
  
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);
    
    // Publish event
    this.eventBus.publish(new UserCreatedEvent({
      userId: savedUser.id,
      email: savedUser.email,
      timestamp: new Date()
    }));
    
    return savedUser;
  }
  
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles']
    });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return null;
    }
    
    return user;
  }
}
```

### **4. Event-Driven Architecture**

#### **Base Event**
```typescript
// src/shared/events/base.event.ts
export abstract class BaseEvent {
  abstract readonly eventType: string;
  abstract readonly eventVersion: string;
  readonly timestamp: Date;
  readonly eventId: string;
  
  constructor() {
    this.timestamp = new Date();
    this.eventId = uuidv4();
  }
}
```

#### **Domain Events**
```typescript
// src/modules/users/domain/events/user-created.event.ts
export class UserCreatedEvent extends BaseEvent {
  readonly eventType = 'user.created';
  readonly eventVersion = '1.0.0';
  
  constructor(public readonly data: {
    userId: number;
    email: string;
    timestamp: Date;
  }) {
    super();
  }
}

// src/modules/users/domain/events/user-logged-in.event.ts
export class UserLoggedInEvent extends BaseEvent {
  readonly eventType = 'user.logged-in';
  readonly eventVersion = '1.0.0';
  
  constructor(public readonly data: {
    userId: number;
    email: string;
    timestamp: Date;
  }) {
    super();
  }
}
```

#### **Event Handlers**
```typescript
// src/modules/customer/application/handlers/user-created.handler.ts
@Injectable()
export class UserCreatedHandler implements EventHandler<UserCreatedEvent> {
  constructor(
    private customerService: CustomerService,
    private logger: Logger
  ) {}
  
  async handle(event: UserCreatedEvent): Promise<void> {
    this.logger.log(`User created: ${event.data.userId}`);
    
    // Create default customer profile for new user
    await this.customerService.createDefaultProfile(event.data.userId);
  }
}
```

### **5. Health Check & Monitoring**

#### **Health Check Service**
```typescript
// src/shared/services/health-check.service.ts
@Injectable()
export class HealthCheckService {
  constructor(
    private serviceRegistry: ServiceRegistryService,
    private eventBus: EventBusService
  ) {}
  
  async getSystemHealth(): Promise<SystemHealthStatus> {
    const services = this.serviceRegistry.getAllServices();
    const serviceHealth = await Promise.all(
      services.map(async (service) => ({
        name: service.name,
        status: await service.healthCheck() ? 'healthy' : 'unhealthy',
        timestamp: new Date(),
        dependencies: service.dependencies
      }))
    );
    
    return {
      status: serviceHealth.every(s => s.status === 'healthy') ? 'healthy' : 'unhealthy',
      services: serviceHealth,
      timestamp: new Date()
    };
  }
}

// src/health/health.controller.ts
@Controller('health')
export class HealthController {
  constructor(private healthCheckService: HealthCheckService) {}
  
  @Get()
  async getHealth(): Promise<SystemHealthStatus> {
    return await this.healthCheckService.getSystemHealth();
  }
  
  @Get('services')
  async getServicesHealth(): Promise<ServiceHealthStatus[]> {
    const systemHealth = await this.healthCheckService.getSystemHealth();
    return systemHealth.services;
  }
}
```

---

## 🚀 Migration Benefits

### **✅ Immediate Benefits**
1. **Keep Current Structure**: No major refactoring needed
2. **Add Service Boundaries**: Clear separation of concerns
3. **Event-Driven Communication**: Loose coupling between modules
4. **Health Monitoring**: System health visibility
5. **Easy Testing**: Test services independently

### **✅ Future Benefits**
1. **Easy Extraction**: Modules can be extracted to microservices
2. **Independent Scaling**: Scale services based on demand
3. **Technology Diversity**: Use different tech stacks per service
4. **Team Autonomy**: Teams can work independently
5. **Fault Isolation**: Service failures don't affect others

### **✅ Development Benefits**
1. **Familiar Structure**: Developers already know the codebase
2. **Gradual Learning**: Learn microservices concepts gradually
3. **Risk Mitigation**: Lower risk than complete rewrite
4. **Faster Delivery**: Deliver features faster
5. **Easy Rollback**: Can rollback to monolithic if needed

---

## 🛠️ Implementation Plan

### **Phase 1: Service Infrastructure (Week 1)**
- Add service registry
- Implement event bus
- Create service communication layer
- Add health check system

### **Phase 2: Service Definitions (Week 2)**
- Define service boundaries
- Create service definitions
- Implement service modules
- Add event definitions

### **Phase 3: Event-Driven Communication (Week 3)**
- Implement event handlers
- Add event publishing
- Create event subscriptions
- Test event flow

### **Phase 4: Monitoring & Testing (Week 4)**
- Add health checks
- Implement monitoring
- Create service tests
- Add integration tests

---

## 🎯 When to Extract to True Microservices

### **Extraction Triggers**
1. **Team Size**: When teams grow beyond 8-10 people
2. **System Complexity**: When modules become too complex
3. **Performance Needs**: When specific services need different scaling
4. **Technology Requirements**: When services need different tech stacks
5. **Deployment Frequency**: When services need independent deployment

### **Extraction Strategy**
1. **Identify Service**: Choose the most independent service
2. **Extract Database**: Move to separate database if needed
3. **Update Communication**: Change from direct calls to HTTP/gRPC
4. **Deploy Independently**: Deploy as separate service
5. **Update Frontend**: Update API calls to new service

---

This **microservice-oriented architecture** gives you the best of both worlds:
- **Keep current structure** and development velocity
- **Add microservices benefits** gradually
- **Prepare for future extraction** when system grows
- **Learn microservices concepts** without major disruption

**Ready to start implementing this evolutionary approach?** 🚀
