# Multi-stage build for production optimization
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy shared infrastructure first (needed for user-service build)
COPY shared/infrastructure ./shared/infrastructure

# Build shared infrastructure
WORKDIR /app/shared/infrastructure
RUN npm ci && npm run build

# Switch to user-service directory
WORKDIR /app/user-service

# Copy package files for user-service
COPY user-service/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy user-service source code
COPY user-service/ ./

# Build the application
RUN npm run build

# Install tsc-alias and fix TypeScript path aliases in compiled output
RUN npm install tsc-alias && \
    npx tsc-alias -p tsconfig.json

# Production stage
FROM node:20-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy built shared infrastructure to absolute root where TypeScript expects it
# From /app/dist/user-service/src, ../../../../shared/infrastructure/src resolves to /shared/infrastructure/src
COPY --from=builder /app/user-service/dist/shared/infrastructure/src /shared/infrastructure/src

# Create symlinks for .ts extensions (TypeScript emits require with .ts, but files are .js)
RUN find /shared/infrastructure/src -name "*.js" -type f | while read f; do \
    ln -sf "$(basename "$f")" "${f%.js}.ts"; \
    done

# Install shared infrastructure dependencies  
COPY shared/infrastructure/package*.json /shared/infrastructure/
WORKDIR /shared/infrastructure
RUN npm ci --only=production && npm cache clean --force

# Back to app directory
WORKDIR /app

# Copy package files and tsconfig for path resolution
COPY user-service/package*.json ./
COPY user-service/tsconfig.json ./

# Install service production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application code
COPY --from=builder /app/user-service/dist ./dist

# Change ownership to app user (including shared infrastructure)
RUN chown -R nestjs:nodejs /app && \
    chown -R nestjs:nodejs /shared
USER nestjs

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1

# Start the application
CMD ["node", "dist/user-service/src/main.js"]








