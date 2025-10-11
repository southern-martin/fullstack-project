# 🔐 Login Flow - Mermaid Diagram

## Complete Login Flow Diagram

```mermaid
graph TD
    A[User opens /login] --> B[LoginForm renders]
    B --> C[User enters email & password]
    C --> D[User clicks 'Sign in']
    D --> E[Form validation]
    E --> F{Validation passed?}
    F -->|No| G[Show validation errors]
    G --> C
    F -->|Yes| H[Call useAuth.login()]
    H --> I[Set isLoading = true]
    I --> J[Call authService.login()]
    J --> K[HTTP POST to /api/v1/auth/login]
    K --> L[Backend AuthController]
    L --> M[Validate credentials]
    M --> N{Credentials valid?}
    N -->|No| O[Return 401 Unauthorized]
    O --> P[Show error message]
    P --> C
    N -->|Yes| Q[Generate JWT token]
    Q --> R[Return {user, token}]
    R --> S[Store token in localStorage]
    S --> T[Update auth state]
    T --> U[Set isAuthenticated = true]
    U --> V[AppRoutes detects auth change]
    V --> W[Redirect to /dashboard]
    W --> X[Dashboard renders]
    
    style A fill:#e1f5fe
    style X fill:#c8e6c9
    style P fill:#ffcdd2
    style G fill:#fff3e0
```

## Authentication State Flow

```mermaid
stateDiagram-v2
    [*] --> Initial: App starts
    Initial --> Checking: Check stored token
    Checking --> Authenticated: Valid token found
    Checking --> Unauthenticated: No valid token
    Authenticated --> LoginForm: User navigates to /login
    LoginForm --> Authenticated: Already logged in
    Unauthenticated --> LoginForm: User navigates to /login
    LoginForm --> LoggingIn: User submits form
    LoggingIn --> Authenticated: Login successful
    LoggingIn --> LoginForm: Login failed
    Authenticated --> LoggingOut: User clicks logout
    LoggingOut --> Unauthenticated: Logout complete
```

## Component Interaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant LF as LoginForm
    participant AC as AuthContext
    participant AS as AuthService
    participant API as NestJS API
    participant DB as Database
    
    U->>LF: Enter credentials
    U->>LF: Click 'Sign in'
    LF->>LF: Validate form
    LF->>AC: login(credentials)
    AC->>AS: login(credentials)
    AS->>API: POST /api/v1/auth/login
    API->>DB: Query user by email
    DB-->>API: User data
    API->>API: Validate password
    API->>API: Generate JWT
    API-->>AS: {user, token}
    AS->>AS: Store token in localStorage
    AS-->>AC: AuthResponse
    AC->>AC: Update state (isAuthenticated = true)
    AC-->>LF: Auth state updated
    LF->>LF: Show success state
    Note over LF,API: AppRoutes detects auth change
    LF->>U: Redirect to /dashboard
```

## Error Handling Flow

```mermaid
graph TD
    A[Login attempt] --> B{Form validation}
    B -->|Failed| C[Show validation errors]
    C --> D[User corrects input]
    D --> A
    B -->|Passed| E[API call]
    E --> F{Network available?}
    F -->|No| G[Show network error]
    G --> H[User retries]
    H --> A
    F -->|Yes| I[Backend processing]
    I --> J{Credentials valid?}
    J -->|No| K[Show auth error]
    K --> L[User corrects credentials]
    L --> A
    J -->|Yes| M{Server error?}
    M -->|Yes| N[Show server error]
    N --> O[User retries later]
    M -->|No| P[Login successful]
    P --> Q[Redirect to dashboard]
    
    style C fill:#fff3e0
    style G fill:#ffebee
    style K fill:#ffebee
    style N fill:#ffebee
    style Q fill:#e8f5e8
```

## Security Flow

```mermaid
graph LR
    A[User credentials] --> B[Client validation]
    B --> C[HTTPS request]
    C --> D[Backend validation]
    D --> E[Password hash check]
    E --> F[JWT generation]
    F --> G[Secure token storage]
    G --> H[Protected routes]
    H --> I[Token validation]
    I --> J[API access]
    
    style A fill:#e3f2fd
    style F fill:#f3e5f5
    style G fill:#e8f5e8
    style J fill:#fff3e0
```

## State Management Flow

```mermaid
graph TD
    A[Initial State] --> B[isAuthenticated: false]
    B --> C[isLoading: false]
    C --> D[user: null]
    D --> E[token: null]
    
    F[Login Start] --> G[isLoading: true]
    G --> H[error: null]
    
    I[Login Success] --> J[isAuthenticated: true]
    J --> K[isLoading: false]
    K --> L[user: User object]
    L --> M[token: JWT string]
    
    N[Login Error] --> O[isAuthenticated: false]
    O --> P[isLoading: false]
    P --> Q[error: Error message]
    
    R[Logout] --> S[isAuthenticated: false]
    S --> T[isLoading: false]
    T --> U[user: null]
    U --> V[token: null]
    V --> W[Clear localStorage]
    
    style A fill:#e1f5fe
    style I fill:#c8e6c9
    style N fill:#ffcdd2
    style R fill:#f3e5f5
```

## Route Protection Flow

```mermaid
graph TD
    A[User navigates to route] --> B{Is /login route?}
    B -->|Yes| C{Already authenticated?}
    C -->|Yes| D[Redirect to /dashboard]
    C -->|No| E[Show LoginForm]
    B -->|No| F{Is authenticated?}
    F -->|Yes| G[Allow access to route]
    F -->|No| H[Redirect to /login]
    
    style A fill:#e1f5fe
    style G fill:#c8e6c9
    style H fill:#ffcdd2
    style D fill:#fff3e0
```

## Token Lifecycle

```mermaid
graph LR
    A[Login] --> B[Generate JWT]
    B --> C[Store in localStorage]
    C --> D[Include in API requests]
    D --> E[Validate on each request]
    E --> F{Token valid?}
    F -->|Yes| G[Allow request]
    F -->|No| H[Refresh token]
    H --> I{Refresh successful?}
    I -->|Yes| G
    I -->|No| J[Redirect to login]
    G --> K[Continue with request]
    J --> L[Clear stored token]
    L --> M[Show login form]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style J fill:#ffcdd2
    style M fill:#fff3e0
```

## User Experience Flow

```mermaid
journey
    title User Login Journey
    section Initial Access
      Open app: 5: User
      See login form: 4: User
    section Input Phase
      Enter email: 3: User
      Enter password: 3: User
      See validation: 4: User
    section Submission
      Click sign in: 5: User
      See loading: 4: User
    section Success
      Redirect to dashboard: 5: User
      See admin interface: 5: User
    section Error
      See error message: 2: User
      Retry login: 3: User
```

This comprehensive flow diagram shows the complete login process in your React admin application, from user interaction to backend processing and state management.

