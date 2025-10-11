# Microservice-Oriented Architecture: Visual Data Flow Diagrams

## 1. Complete Request/Response Flow

```mermaid
graph TD
    A[Client Request] --> B[API Gateway]
    B --> C[Tracing Interceptor]
    C --> D[Service Registry]
    D --> E[Load Balancer]
    E --> F[Circuit Breaker]
    F --> G[Target Service]
    G --> H[Database]
    G --> I[Event Bus]
    I --> J[Event Handlers]
    J --> K[Other Services]
    G --> L[Response]
    L --> M[Monitoring Service]
    M --> N[Observability Service]
    L --> O[Client Response]
    
    style A fill:#e1f5fe
    style O fill:#e8f5e8
    style M fill:#fff3e0
    style N fill:#f3e5f5
```

## 2. Service-to-Service Communication

```mermaid
sequenceDiagram
    participant SA as Service A
    participant SR as Service Registry
    participant LB as Load Balancer
    participant CB as Circuit Breaker
    participant SB as Service B
    participant OS as Observability Service
    
    SA->>SR: Get Service B endpoint
    SR-->>SA: Return endpoint
    SA->>OS: Start trace span
    SA->>LB: Select instance
    LB-->>SA: Return instance
    SA->>CB: Check circuit state
    CB-->>SA: State: CLOSED
    SA->>SB: HTTP Request with JWT
    SB-->>SA: Response
    SA->>OS: Finish trace span
    SA->>OS: Log metrics
```

## 3. Event-Driven Communication

```mermaid
graph LR
    A[Service A] --> B[Domain Event]
    B --> C[Event Bus]
    C --> D[Service B Handler]
    C --> E[Service C Handler]
    C --> F[Service D Handler]
    D --> G[Process Event]
    E --> H[Process Event]
    F --> I[Process Event]
    
    style B fill:#ffeb3b
    style C fill:#4caf50
```

## 4. Monitoring & Observability Flow

```mermaid
graph TD
    A[Service Instance] --> B[Health Check]
    A --> C[Metrics Collection]
    A --> D[Trace Spans]
    
    B --> E[Health Monitoring]
    C --> F[Monitoring Service]
    D --> G[Observability Service]
    
    F --> H[Alert Rules]
    H --> I[Alerts]
    G --> J[Distributed Traces]
    
    E --> K[Dashboard]
    I --> K
    J --> K
    
    style K fill:#2196f3
    style I fill:#f44336
```

## 5. Circuit Breaker State Machine

```mermaid
stateDiagram-v2
    [*] --> CLOSED
    CLOSED --> OPEN : Failure threshold exceeded
    OPEN --> HALF_OPEN : Recovery timeout
    HALF_OPEN --> CLOSED : Success
    HALF_OPEN --> OPEN : Failure
    CLOSED --> CLOSED : Success
    OPEN --> OPEN : Timeout not reached
    
    note right of CLOSED : Normal operation
    note right of OPEN : Failing, no requests
    note right of HALF_OPEN : Testing recovery
```

## 6. Load Balancing Strategies

```mermaid
graph TD
    A[Request] --> B{Load Balancer}
    B --> C[Round Robin]
    B --> D[Weighted Round Robin]
    B --> E[Least Connections]
    B --> F[Random]
    
    C --> G[Service Instance 1]
    C --> H[Service Instance 2]
    C --> I[Service Instance 3]
    
    D --> J[Instance 1 - Weight 3]
    D --> K[Instance 2 - Weight 2]
    D --> L[Instance 3 - Weight 1]
    
    E --> M[Instance with least connections]
    F --> N[Random instance selection]
    
    style B fill:#ff9800
```

## 7. Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant AG as API Gateway
    participant AS as Auth Service
    participant S as Target Service
    
    C->>AG: Request with credentials
    AG->>AS: Validate credentials
    AS-->>AG: JWT Token
    AG->>S: Request with JWT
    S->>AS: Validate JWT
    AS-->>S: Token valid + permissions
    S-->>AG: Response
    AG-->>C: Response
```

## 8. Error Handling & Recovery

```mermaid
graph TD
    A[Request] --> B[Service Call]
    B --> C{Success?}
    C -->|Yes| D[Return Response]
    C -->|No| E[Retry Logic]
    E --> F{Max Retries?}
    F -->|No| G[Exponential Backoff]
    G --> B
    F -->|Yes| H[Circuit Breaker]
    H --> I{Circuit State}
    I -->|CLOSED| J[Fallback Response]
    I -->|OPEN| K[Immediate Failure]
    I -->|HALF_OPEN| L[Test Request]
    L --> M{Success?}
    M -->|Yes| N[Close Circuit]
    M -->|No| O[Open Circuit]
    
    style H fill:#f44336
    style J fill:#ff9800
    style K fill:#f44336
```

## 9. Data Persistence & Event Sourcing

```mermaid
graph LR
    A[Service] --> B[Repository]
    B --> C[Database]
    A --> D[Domain Event]
    D --> E[Event Store]
    E --> F[Event Handlers]
    F --> G[Read Models]
    F --> H[Projections]
    
    style D fill:#4caf50
    style E fill:#2196f3
```

## 10. Complete System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Client]
        MOBILE[Mobile Client]
        API_CLIENT[API Client]
    end
    
    subgraph "API Gateway Layer"
        GATEWAY[API Gateway]
        TRACING[Tracing Interceptor]
    end
    
    subgraph "Service Layer"
        AUTH[Auth Service]
        USER[User Service]
        CUSTOMER[Customer Service]
        CARRIER[Carrier Service]
        PRICING[Pricing Service]
    end
    
    subgraph "Infrastructure Layer"
        REGISTRY[Service Registry]
        EVENT_BUS[Event Bus]
        HTTP_CLIENT[HTTP Client]
        CIRCUIT_BREAKER[Circuit Breaker]
        LOAD_BALANCER[Load Balancer]
    end
    
    subgraph "Observability Layer"
        MONITORING[Monitoring Service]
        OBSERVABILITY[Observability Service]
        HEALTH[Health Check Service]
    end
    
    subgraph "Data Layer"
        DATABASE[(Database)]
        EVENT_STORE[(Event Store)]
        CACHE[(Cache)]
    end
    
    WEB --> GATEWAY
    MOBILE --> GATEWAY
    API_CLIENT --> GATEWAY
    
    GATEWAY --> TRACING
    TRACING --> REGISTRY
    REGISTRY --> LOAD_BALANCER
    LOAD_BALANCER --> CIRCUIT_BREAKER
    CIRCUIT_BREAKER --> HTTP_CLIENT
    
    HTTP_CLIENT --> AUTH
    HTTP_CLIENT --> USER
    HTTP_CLIENT --> CUSTOMER
    HTTP_CLIENT --> CARRIER
    HTTP_CLIENT --> PRICING
    
    AUTH --> EVENT_BUS
    USER --> EVENT_BUS
    CUSTOMER --> EVENT_BUS
    CARRIER --> EVENT_BUS
    PRICING --> EVENT_BUS
    
    AUTH --> DATABASE
    USER --> DATABASE
    CUSTOMER --> DATABASE
    CARRIER --> DATABASE
    PRICING --> DATABASE
    
    EVENT_BUS --> EVENT_STORE
    
    MONITORING --> AUTH
    MONITORING --> USER
    MONITORING --> CUSTOMER
    MONITORING --> CARRIER
    MONITORING --> PRICING
    
    OBSERVABILITY --> TRACING
    HEALTH --> REGISTRY
    
    style GATEWAY fill:#e3f2fd
    style EVENT_BUS fill:#e8f5e8
    style MONITORING fill:#fff3e0
    style OBSERVABILITY fill:#f3e5f5
```

## 11. Request Lifecycle Timeline

```mermaid
gantt
    title Request Processing Timeline
    dateFormat X
    axisFormat %L ms
    
    section Request Processing
    API Gateway Processing    :0, 5
    Service Discovery        :5, 10
    Load Balancing          :10, 15
    Circuit Breaker Check   :15, 20
    Service Call            :20, 100
    Database Query          :25, 80
    Event Publishing        :85, 95
    Response Processing     :100, 105
    
    section Observability
    Trace Start             :0, 1
    Span Creation           :1, 2
    Metrics Collection      :20, 105
    Trace Completion        :105, 106
```

## 12. Error Scenarios & Recovery

```mermaid
graph TD
    A[Request] --> B[Service Call]
    B --> C{Service Available?}
    C -->|No| D[Service Unavailable]
    C -->|Yes| E{Request Valid?}
    E -->|No| F[Validation Error]
    E -->|Yes| G{Database Available?}
    G -->|No| H[Database Error]
    G -->|Yes| I{Business Logic?}
    I -->|No| J[Business Error]
    I -->|Yes| K[Success]
    
    D --> L[Circuit Breaker Open]
    F --> M[Return 400 Error]
    H --> N[Retry with Backoff]
    J --> O[Return Business Error]
    K --> P[Return Success]
    
    L --> Q[Fallback Response]
    N --> R{Max Retries?}
    R -->|No| B
    R -->|Yes| L
    
    style D fill:#f44336
    style H fill:#ff9800
    style J fill:#ff5722
    style K fill:#4caf50
    style L fill:#f44336
    style Q fill:#ff9800
```

These diagrams provide a comprehensive visual representation of how data flows through the microservice-oriented architecture, showing the relationships between components, the sequence of operations, and the various patterns used for communication, monitoring, and error handling.
