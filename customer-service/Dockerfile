# Multi-stage build for production optimization
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Build shared infrastructure first
COPY shared/infrastructure ./shared/infrastructure
WORKDIR /app/shared/infrastructure
RUN npm ci && npm run build

# Switch to customer-service directory
WORKDIR /app/customer-service

# Copy package files for customer-service
COPY customer-service/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy customer-service source code
COPY customer-service/ ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

    # Copy shared infrastructure from builder
    # Builder creates: /app/customer-service/dist/shared/infrastructure/src/
    # From /app/dist/customer-service/src, ../../../../shared/infrastructure/src resolves to /shared/infrastructure/src
    COPY --from=builder /app/customer-service/dist/shared/infrastructure/src /shared/infrastructure/src

    # Create symlinks for .ts extensions (TypeScript emits require with .ts, but files are .js)
    RUN find /shared/infrastructure/src -name "*.js" -type f | while read f; do \
        ln -sf "$(basename "$f")" "${f%.js}.ts"; \
        done

# Copy package files
COPY customer-service/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/customer-service/dist ./dist

# Change ownership to app user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3004

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3004/health || exit 1

# Start the application
CMD ["node", "dist/customer-service/src/main.js"]
