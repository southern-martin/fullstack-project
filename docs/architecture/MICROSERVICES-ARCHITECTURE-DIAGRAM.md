# 🏗️ Microservices Architecture Diagrams

## Current System Architecture

```mermaid
graph TB
    subgraph "Current System"
        subgraph "Frontend"
            RA[React Admin<br/>Frontend]
        end
        
        subgraph "Backend Services"
            NEST[NestJS API<br/>Port 3001]
            GO[Go API<br/>Port 8080]
        end
        
        subgraph "Database"
            DB[(MySQL Database<br/>Shared)]
        end
        
        RA --> NEST
        RA --> GO
        NEST --> DB
        GO --> DB
    end
    
    style RA fill:#e1f5fe
    style NEST fill:#f3e5f5
    style GO fill:#e8f5e8
    style DB fill:#fff3e0
```

## Recommended Microservices Architecture

```mermaid
graph TB
    subgraph "API Gateway Layer"
        GW[API Gateway<br/>Kong/Envoy<br/>Port 80/443]
    end
    
    subgraph "Microservices Layer"
        subgraph "NestJS Services"
            AUTH[Auth Service<br/>Port 3001]
            USER[User Service<br/>Port 3002]
            CUST[Customer Service<br/>Port 3003]
            TRANS[Translation Service<br/>Port 3004]
        end
        
        subgraph "Go Services"
            CARR[Carrier Service<br/>Port 3005]
            PRICE[Pricing Service<br/>Port 3006]
        end
    end
    
    subgraph "Frontend"
        RA[React Admin<br/>Frontend]
    end
    
    subgraph "Databases"
        AUTH_DB[(Auth DB<br/>MySQL)]
        USER_DB[(User DB<br/>MySQL)]
        CUST_DB[(Customer DB<br/>MySQL)]
        CARR_DB[(Carrier DB<br/>MySQL)]
        PRICE_DB[(Pricing DB<br/>MySQL)]
        TRANS_DB[(Translation DB<br/>MySQL)]
    end
    
    subgraph "Infrastructure"
        SD[Service Discovery<br/>Consul]
        MQ[Message Queue<br/>RabbitMQ]
        MON[Monitoring<br/>Prometheus]
    end
    
    RA --> GW
    GW --> AUTH
    GW --> USER
    GW --> CUST
    GW --> CARR
    GW --> PRICE
    GW --> TRANS
    
    AUTH --> AUTH_DB
    USER --> USER_DB
    CUST --> CUST_DB
    CARR --> CARR_DB
    PRICE --> PRICE_DB
    TRANS --> TRANS_DB
    
    AUTH -.-> SD
    USER -.-> SD
    CUST -.-> SD
    CARR -.-> SD
    PRICE -.-> SD
    TRANS -.-> SD
    
    AUTH -.-> MQ
    USER -.-> MQ
    CUST -.-> MQ
    CARR -.-> MQ
    PRICE -.-> MQ
    TRANS -.-> MQ
    
    style GW fill:#ff9800
    style AUTH fill:#e1f5fe
    style USER fill:#e1f5fe
    style CUST fill:#e1f5fe
    style TRANS fill:#e1f5fe
    style CARR fill:#e8f5e8
    style PRICE fill:#e8f5e8
    style RA fill:#f3e5f5
    style SD fill:#fff3e0
    style MQ fill:#fff3e0
    style MON fill:#fff3e0
```

## Service Communication Flow

```mermaid
sequenceDiagram
    participant Client
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant User as User Service
    participant MQ as Message Queue
    
    Client->>Gateway: Login Request
    Gateway->>Auth: Validate Credentials
    Auth->>Auth: Check User Credentials
    Auth-->>Gateway: JWT Token
    Gateway-->>Client: Authentication Response
    
    Client->>Gateway: Get Users (with JWT)
    Gateway->>Auth: Validate JWT Token
    Auth-->>Gateway: Token Valid
    Gateway->>User: Get Users List
    User->>User: Query Database
    User-->>Gateway: Users Data
    Gateway-->>Client: Users Response
    
    Note over User,MQ: Asynchronous Communication
    User->>MQ: Publish User Created Event
    Auth->>MQ: Subscribe to User Events
    MQ->>Auth: User Created Event
    Auth->>Auth: Create Auth Record
```

## Database per Service Architecture

```mermaid
graph TB
    subgraph "Service Boundaries"
        subgraph "Auth Service"
            AUTH_SVC[Auth Service]
            AUTH_DB[(Auth Database<br/>- users<br/>- roles<br/>- sessions)]
        end
        
        subgraph "User Service"
            USER_SVC[User Service]
            USER_DB[(User Database<br/>- profiles<br/>- preferences<br/>- settings)]
        end
        
        subgraph "Customer Service"
            CUST_SVC[Customer Service]
            CUST_DB[(Customer Database<br/>- customers<br/>- addresses<br/>- orders)]
        end
        
        subgraph "Carrier Service"
            CARR_SVC[Carrier Service]
            CARR_DB[(Carrier Database<br/>- carriers<br/>- routes<br/>- shipments)]
        end
        
        subgraph "Pricing Service"
            PRICE_SVC[Pricing Service]
            PRICE_DB[(Pricing Database<br/>- pricing_rules<br/>- price_history<br/>- discounts)]
        end
        
        subgraph "Translation Service"
            TRANS_SVC[Translation Service]
            TRANS_DB[(Translation Database<br/>- languages<br/>- translations<br/>- content)]
        end
    end
    
    AUTH_SVC --> AUTH_DB
    USER_SVC --> USER_DB
    CUST_SVC --> CUST_DB
    CARR_SVC --> CARR_DB
    PRICE_SVC --> PRICE_DB
    TRANS_SVC --> TRANS_DB
    
    style AUTH_SVC fill:#e1f5fe
    style USER_SVC fill:#e1f5fe
    style CUST_SVC fill:#e1f5fe
    style CARR_SVC fill:#e8f5e8
    style PRICE_SVC fill:#e8f5e8
    style TRANS_SVC fill:#e1f5fe
```

## Event-Driven Architecture

```mermaid
graph TB
    subgraph "Event Bus"
        MQ[Message Queue<br/>RabbitMQ/Kafka]
    end
    
    subgraph "Event Publishers"
        USER[User Service]
        CUST[Customer Service]
        CARR[Carrier Service]
    end
    
    subgraph "Event Subscribers"
        AUTH[Auth Service]
        NOTIF[Notification Service]
        AUDIT[Audit Service]
    end
    
    subgraph "Event Types"
        E1[user.created]
        E2[user.updated]
        E3[customer.created]
        E4[order.placed]
        E5[shipment.created]
    end
    
    USER -->|Publish| MQ
    CUST -->|Publish| MQ
    CARR -->|Publish| MQ
    
    MQ -->|Subscribe| AUTH
    MQ -->|Subscribe| NOTIF
    MQ -->|Subscribe| AUDIT
    
    MQ -.-> E1
    MQ -.-> E2
    MQ -.-> E3
    MQ -.-> E4
    MQ -.-> E5
    
    style MQ fill:#ff9800
    style USER fill:#e1f5fe
    style CUST fill:#e1f5fe
    style CARR fill:#e8f5e8
    style AUTH fill:#e1f5fe
    style NOTIF fill:#e1f5fe
    style AUDIT fill:#e1f5fe
```

## Migration Strategy - Strangler Fig Pattern

```mermaid
graph TB
    subgraph "Phase 1: API Gateway"
        GW[API Gateway]
        MONO[Existing Monolith]
        RA[React Frontend]
        
        RA --> GW
        GW --> MONO
    end
    
    subgraph "Phase 2: Extract Services"
        GW2[API Gateway]
        AUTH[Auth Service]
        USER[User Service]
        MONO2[Remaining Monolith]
        RA2[React Frontend]
        
        RA2 --> GW2
        GW2 --> AUTH
        GW2 --> USER
        GW2 --> MONO2
    end
    
    subgraph "Phase 3: Complete Migration"
        GW3[API Gateway]
        AUTH3[Auth Service]
        USER3[User Service]
        CUST3[Customer Service]
        CARR3[Carrier Service]
        RA3[React Frontend]
        
        RA3 --> GW3
        GW3 --> AUTH3
        GW3 --> USER3
        GW3 --> CUST3
        GW3 --> CARR3
    end
    
    style GW fill:#ff9800
    style GW2 fill:#ff9800
    style GW3 fill:#ff9800
    style MONO fill:#ffcdd2
    style MONO2 fill:#ffcdd2
```

## Technology Stack Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        REACT[React Admin<br/>TypeScript + Tailwind]
    end
    
    subgraph "API Gateway Layer"
        KONG[Kong/Envoy<br/>Routing + Auth]
    end
    
    subgraph "Application Layer"
        subgraph "NestJS Services"
            NS1[Auth Service]
            NS2[User Service]
            NS3[Customer Service]
            NS4[Translation Service]
        end
        
        subgraph "Go Services"
            GS1[Carrier Service]
            GS2[Pricing Service]
        end
    end
    
    subgraph "Data Layer"
        subgraph "Databases"
            DB1[(MySQL<br/>Auth)]
            DB2[(MySQL<br/>Users)]
            DB3[(MySQL<br/>Customers)]
            DB4[(MySQL<br/>Carriers)]
            DB5[(MySQL<br/>Pricing)]
            DB6[(MySQL<br/>Translation)]
        end
        
        subgraph "Message Queue"
            RABBIT[RabbitMQ<br/>Event Bus]
        end
    end
    
    subgraph "Infrastructure Layer"
        K8S[Kubernetes<br/>Container Orchestration]
        CONSUL[Consul<br/>Service Discovery]
        PROM[Prometheus<br/>Monitoring]
        GRAF[Grafana<br/>Dashboards]
        ELK[ELK Stack<br/>Logging]
    end
    
    REACT --> KONG
    KONG --> NS1
    KONG --> NS2
    KONG --> NS3
    KONG --> NS4
    KONG --> GS1
    KONG --> GS2
    
    NS1 --> DB1
    NS2 --> DB2
    NS3 --> DB3
    GS1 --> DB4
    GS2 --> DB5
    NS4 --> DB6
    
    NS1 -.-> RABBIT
    NS2 -.-> RABBIT
    NS3 -.-> RABBIT
    GS1 -.-> RABBIT
    GS2 -.-> RABBIT
    NS4 -.-> RABBIT
    
    K8S -.-> NS1
    K8S -.-> NS2
    K8S -.-> NS3
    K8S -.-> NS4
    K8S -.-> GS1
    K8S -.-> GS2
    
    CONSUL -.-> NS1
    CONSUL -.-> NS2
    CONSUL -.-> NS3
    CONSUL -.-> NS4
    CONSUL -.-> GS1
    CONSUL -.-> GS2
    
    PROM -.-> NS1
    PROM -.-> NS2
    PROM -.-> NS3
    PROM -.-> NS4
    PROM -.-> GS1
    PROM -.-> GS2
    
    style KONG fill:#ff9800
    style K8S fill:#2196f3
    style CONSUL fill:#4caf50
    style PROM fill:#f44336
    style GRAF fill:#9c27b0
    style ELK fill:#ff5722
```

## Service Dependencies and Data Flow

```mermaid
graph LR
    subgraph "External"
        CLIENT[Client Applications]
    end
    
    subgraph "API Gateway"
        GATEWAY[API Gateway<br/>Authentication<br/>Rate Limiting<br/>Routing]
    end
    
    subgraph "Core Services"
        AUTH[Auth Service<br/>JWT Management<br/>User Authentication]
        USER[User Service<br/>User Management<br/>Profiles & Roles]
    end
    
    subgraph "Business Services"
        CUSTOMER[Customer Service<br/>CRM<br/>Order Management]
        CARRIER[Carrier Service<br/>Logistics<br/>Shipment Tracking]
        PRICING[Pricing Service<br/>Price Calculation<br/>Rules Engine]
    end
    
    subgraph "Support Services"
        TRANSLATION[Translation Service<br/>Multi-language<br/>Content Translation]
        NOTIFICATION[Notification Service<br/>Email/SMS<br/>Push Notifications]
    end
    
    subgraph "Data Storage"
        AUTH_DB[(Auth DB)]
        USER_DB[(User DB)]
        CUSTOMER_DB[(Customer DB)]
        CARRIER_DB[(Carrier DB)]
        PRICING_DB[(Pricing DB)]
        TRANSLATION_DB[(Translation DB)]
    end
    
    CLIENT --> GATEWAY
    GATEWAY --> AUTH
    GATEWAY --> USER
    GATEWAY --> CUSTOMER
    GATEWAY --> CARRIER
    GATEWAY --> PRICING
    GATEWAY --> TRANSLATION
    
    AUTH --> AUTH_DB
    USER --> USER_DB
    CUSTOMER --> CUSTOMER_DB
    CARRIER --> CARRIER_DB
    PRICING --> PRICING_DB
    TRANSLATION --> TRANSLATION_DB
    
    USER -.->|Events| CUSTOMER
    CUSTOMER -.->|Events| CARRIER
    CUSTOMER -.->|Events| PRICING
    USER -.->|Events| NOTIFICATION
    CUSTOMER -.->|Events| NOTIFICATION
    
    style GATEWAY fill:#ff9800
    style AUTH fill:#e1f5fe
    style USER fill:#e1f5fe
    style CUSTOMER fill:#e1f5fe
    style CARRIER fill:#e8f5e8
    style PRICING fill:#e8f5e8
    style TRANSLATION fill:#e1f5fe
    style NOTIFICATION fill:#e1f5fe
```

This comprehensive microservices architecture provides:

1. **Clear Service Boundaries**: Each service has a single responsibility
2. **Independent Deployment**: Services can be deployed independently
3. **Technology Diversity**: Mix of NestJS and Go services
4. **Scalability**: Each service can be scaled independently
5. **Fault Isolation**: Failure in one service doesn't affect others
6. **Event-Driven Communication**: Loose coupling between services
7. **Database per Service**: Data ownership and consistency
8. **Comprehensive Monitoring**: Full observability stack
