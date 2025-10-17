# Multi-stage build for production optimization
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy shared infrastructure first (needed for auth-service build)
COPY shared/infrastructure ./shared/infrastructure

# Build shared infrastructure
WORKDIR /app/shared/infrastructure
RUN npm ci && npm run build

# Switch to auth-service directory
WORKDIR /app/auth-service

# Copy package files for auth-service
COPY auth-service/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy auth-service source code
COPY auth-service/ ./

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

# Copy shared infrastructure (built version)
COPY --from=builder /app/shared/infrastructure ./shared/infrastructure

# Copy package files
COPY auth-service/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/auth-service/dist ./dist

# Change ownership to app user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/v1/auth/health || exit 1

# Start the application
CMD ["node", "dist/auth-service/src/main.js"]
