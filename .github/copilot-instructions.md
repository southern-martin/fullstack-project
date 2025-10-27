# Copilot Instructions for Fullstack Microservices Project

## 🏗️ Architecture Overview

This is a **hybrid microservices architecture** with deliberate shared and separated database strategies:

- **Shared Database Pattern**: Auth Service (3001) + User Service (3003) share `shared_user_db:3306` for tightly coupled user/auth data
- **Separate Database Pattern**: Business services (Carrier, Customer, Pricing) have independent databases for loose coupling
- **Shared Redis**: All services use `shared-redis:6379` for caching and sessions

## 🚀 Essential Development Workflows

### Quick Setup Commands
```bash
# Start shared infrastructure first
cd shared-database && docker-compose up -d

# Start all services via hybrid setup
docker-compose -f docker-compose.hybrid.yml up -d

# Development mode (individual services)
make dev  # or check Makefile for specific targets
```

### Key Environment Files
- Copy `.env.shared.example` → `.env` for Auth/User services (shared DB config)
- Each service has specific port assignments (Auth:3001, User:3003, etc.)
- Default login: `admin@example.com` / `Admin123!`

## 🎯 Project-Specific Patterns

### Clean Architecture (NestJS Services)
Services follow Clean Architecture with consistent structure:
```
src/
├── application/     # Use cases and business logic
├── domain/         # Entities and domain rules
├── infrastructure/ # Database, external services
└── interfaces/     # Controllers and DTOs
```

### React Admin Structure
Frontend uses provider-wrapped architecture:
```tsx
<QueryProvider>
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <AppRoutes />
```

### Database Conventions
- **Shared entities**: `UserTypeOrmEntity`, `RoleTypeOrmEntity` (used by Auth + User services)
- **Business entities**: Independent per service
- TypeORM with PostgreSQL config in development, MySQL in production

## 🔧 Integration Patterns

### Cross-Service Communication
Business services call User Service API for user data (not direct DB access):
```typescript
// In Customer Service
const user = await userService.getUser(customer.userId);
```

### Health Checks
All services expose health endpoints:
- Auth: `/api/v1/auth/health`
- Others: `/health`

### Docker Orchestration
- Use `docker-compose.hybrid.yml` for full stack
- Individual service docker-compose files for isolated development
- Shared volumes for database persistence

## 📁 Key Files for Context

- `HYBRID-ARCHITECTURE-README.md` - Database strategy decisions
- `Makefile` - Development commands and targets
- `docker-compose.hybrid.yml` - Full stack orchestration
- `scripts/` - Utility scripts for build, test, deploy
- Service-specific `README.md` files contain API documentation

## 🎨 Code Style & Conventions

### General Standards
- TypeScript strict mode across all services
- NestJS decorators for dependency injection
- React Query for state management in frontend
- Environment-specific configurations (dev/prod)
- Shared Redis key prefixes per service (`auth:`, `user:`, etc.)

### React Admin Translation Labels Standard

**CRITICAL**: All translation label files MUST follow this standardized pattern:

#### File Structure
```
features/
  [module]/
    labels/
      [module]-labels.ts    # Label definitions
    hooks/
      use[Module]Labels.ts  # Custom hook
```

#### Required Pattern (TypeScript Interface + Nested Objects)

```typescript
/**
 * [Module] Module Translation Labels
 * 
 * This file contains all static UI labels used in the [Module] module.
 * Labels are organized by category for better maintainability.
 * 
 * Usage with use[Module]Labels hook:
 * const { L } = use[Module]Labels();
 * <h1>{L.page.title}</h1>
 */

export interface [Module]Labels {
  // Page Header
  page: {
    title: string;
    subtitle: string;
  };

  // Table Headers & Display
  table: {
    // column headers
    emptyMessage: string;
  };

  // Buttons & Actions
  buttons: {
    create: string;
    save: string;
    cancel: string;
    delete: string;
  };

  // Search & Filters
  search: {
    placeholder: string;
  };

  // Status Values
  status: {
    active: string;
    inactive: string;
  };

  // Dropdown Actions
  actions: {
    view: string;
    edit: string;
    delete: string;
  };

  // Modal Titles
  modals: {
    create: string;
    edit: string;
    delete: string;
  };

  // Toast Messages
  messages: {
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    deleteSuccess: string;
    deleteError: string;
  };

  // Form Fields
  form: {
    // field labels
  };

  // Form Placeholders (optional)
  placeholders?: {
    // input placeholders
  };

  // Validation Messages (optional)
  validation?: {
    // validation errors
  };

  // Module-specific categories as needed
}

/**
 * Default English labels for the [Module] module
 */
export const [module]Labels: [Module]Labels = {
  page: {
    title: 'Module Title',
    subtitle: 'Module subtitle',
  },
  // ... implementation
};
```

#### Standard Category Names

**Required categories** (use these exact names):
- `page` - Page titles and headers
- `buttons` - Action buttons
- `messages` - Success/error toast messages

**Optional categories** (include if applicable):
- `table` - Table headers and empty states (if has tables)
- `search` - Search placeholders and filters (if has search)
- `status` - Status labels (if has status field)
- `actions` - Dropdown/menu actions (if has action menu)
- `modals` - Modal titles (if has modals)
- `form` - Form field labels (if has forms)
- `placeholders` - Input placeholders (if has inputs)
- `validation` - Validation error messages (if has validation)
- `details` - Detail view labels (if has detail views)

**Module-specific categories** are allowed but should be documented.

#### Custom Hook Pattern

Every module MUST have a custom hook:

```typescript
// features/[module]/hooks/use[Module]Labels.ts
import { useLabels } from '../../../shared/hooks/useLabels';
import { [Module]Labels, [module]Labels } from '../labels/[module]-labels';

/**
 * [Module] Module Labels Hook
 * 
 * Provides translated labels for the [Module] module.
 * Wraps the generic useLabels hook with module-specific types.
 * 
 * @returns {Object} Object containing:
 *   - labels: Full [Module]Labels object with all categories
 *   - L: Alias for labels (shorthand for cleaner code)
 *   - isLoading: Boolean indicating if translations are loading
 *   - error: Error object if translation fetch failed
 *   - refetch: Function to manually refetch translations
 * 
 * @example
 * const { L, isLoading } = use[Module]Labels();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <div>
 *     <h1>{L.page.title}</h1>
 *     <button>{L.buttons.create}</button>
 *   </div>
 * );
 */
export const use[Module]Labels = () => {
  const result = useLabels<[Module]Labels>([module]Labels, '[module]');
  
  return {
    ...result,
    L: result.labels, // Alias for convenience
  };
};
```

#### Component Usage Pattern

```typescript
import { use[Module]Labels } from '../hooks/use[Module]Labels';

const Component: React.FC = () => {
  const { L, isLoading } = use[Module]Labels();
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      <h1>{L.page.title}</h1>
      <p>{L.page.subtitle}</p>
      <Button>{L.buttons.create}</Button>
      <span>{L.messages.createSuccess}</span>
    </div>
  );
};
```

#### Naming Conventions

✅ **DO:**
- Use `camelCase` for all keys and constant names
- Use `PascalCase` for interfaces: `UserLabels`, `AuthLabels`
- Use `camelCase` for constants: `userLabels`, `authLabels`
- Organize labels into logical categories
- Use descriptive, clear property names

❌ **DON'T:**
- Use `SCREAMING_SNAKE_CASE` for keys or constants
- Create flat label objects without categories
- Mix naming conventions in the same file
- Skip TypeScript interfaces
- Place label files in `/constants/` directory

#### Translation Seeding

Each module should have a seeding script:

```typescript
// scripts/seed-[module]-translations.ts
import axios from 'axios';

const TRANSLATION_API_BASE_URL = 'http://localhost:3007/api/v1/translation';

interface CreateTranslationRequest {
  original: string;
  destination: string;
  languageCode: string;
  context?: {
    category?: string;
    module?: string;
  };
}

interface TranslationPair {
  sourceText: string;
  french: string;
  spanish: string;
}

const [module]Translations: TranslationPair[] = [
  { sourceText: 'Title', french: 'Titre', spanish: 'Título' },
  // ... all translations
];

async function seedTranslation(
  sourceText: string,
  translatedText: string,
  languageCode: string
): Promise<void> {
  try {
    const payload: CreateTranslationRequest = {
      original: sourceText,
      destination: translatedText,
      languageCode: languageCode,
      context: {
        module: '[module]',
        category: 'ui-labels'
      }
    };

    await axios.post(`${TRANSLATION_API_BASE_URL}/translations`, payload);
    console.log(`✅ [${languageCode.toUpperCase()}] "${sourceText}" → "${translatedText}"`);
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log(`⚠️  [${languageCode.toUpperCase()}] Translation already exists: "${sourceText}"`);
    } else {
      console.error(`❌ [${languageCode.toUpperCase()}] Failed to seed "${sourceText}":`, error.message);
    }
  }
}

// Main seeding function...
```

Add npm script in `package.json`:
```json
{
  "scripts": {
    "seed:[module]-translations": "ts-node scripts/seed-[module]-translations.ts"
  }
}
```

#### Reference Examples

**Best Practice Examples:**
- ✅ `features/users/labels/user-labels.ts` - Perfect reference
- ✅ `features/auth/labels/auth-labels.ts` - Perfect reference

**Files to Avoid as Examples:**
- ❌ `features/customers/labels/customer-labels.ts` - Uses flat SCREAMING_SNAKE_CASE
- ❌ `features/dashboard/labels/dashboard-labels.ts` - Uses flat SCREAMING_SNAKE_CASE
- ⚠️ `features/roles/labels/role-labels.ts` - Mixed pattern
- ⚠️ `features/carriers/constants/carrier-labels.ts` - Wrong directory

#### Migration Checklist

When creating or updating label files:
- [ ] Create TypeScript interface: `export interface [Module]Labels`
- [ ] Organize labels into standard categories
- [ ] Use camelCase for all keys
- [ ] Create constant matching interface: `export const [module]Labels: [Module]Labels`
- [ ] Place file in `features/[module]/labels/[module]-labels.ts`
- [ ] Create hook: `use[Module]Labels()` that wraps `useLabels()`
- [ ] Update components to use `const { L } = use[Module]Labels()`
- [ ] Create seeding script: `scripts/seed-[module]-translations.ts`
- [ ] Add npm script: `"seed:[module]-translations"`
- [ ] Verify TypeScript compilation (no errors)
- [ ] Test with language switching

#### Why This Standard?

**Benefits:**
- ✅ Type-safe with IntelliSense support
- ✅ Organized by logical categories
- ✅ Easy to navigate and maintain
- ✅ Consistent across all modules
- ✅ Scalable for large applications
- ✅ Self-documenting structure
- ✅ Batch translation support
- ✅ React Query caching integration
- ✅ Prevents naming collisions
- ✅ Better developer experience

**For complete details, see:** `react-admin/LABEL-STRUCTURE-ANALYSIS.md`

## ⚠️ Important Notes

- **Database Changes**: Auth/User services share schema - coordinate migrations
- **Port Management**: Fixed port assignments - check `docker-compose.hybrid.yml`
- **Development vs Production**: Services use different DB types (PostgreSQL dev, MySQL prod)
- **Testing**: Use `scripts/testing/` utilities for validation