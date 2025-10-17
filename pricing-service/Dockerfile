# Multi-stage build for production optimization
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Build shared infrastructure first
COPY shared/infrastructure ./shared/infrastructure
WORKDIR /app/shared/infrastructure
RUN npm ci && npm run build

# Switch to pricing-service directory
WORKDIR /app/pricing-service

# Copy package files for pricing-service
COPY pricing-service/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy pricing-service source code
COPY pricing-service/ ./

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

# Copy built shared infrastructure from builder
# Builder creates: /app/pricing-service/dist/shared/infrastructure/src/
# From /app/dist/pricing-service/src, ../../../../shared/infrastructure/src resolves to /shared/infrastructure/src
COPY --from=builder /app/pricing-service/dist/shared/infrastructure/src /shared/infrastructure/src

# Create symlinks for .ts extensions (TypeScript emits require with .ts, but files are .js)
RUN find /shared/infrastructure/src -name "*.js" -type f | while read f; do \
    ln -sf "$(basename "$f")" "${f%.js}.ts"; \
    done

# Copy package files
COPY pricing-service/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application code
COPY --from=builder /app/pricing-service/dist ./dist

# Change ownership to app user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3006

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3006/health || exit 1

# Start the application
CMD ["node", "dist/pricing-service/src/main.js"]







