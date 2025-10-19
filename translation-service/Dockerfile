# Multi-stage build for production optimization
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Build shared infrastructure first
COPY shared/infrastructure ./shared/infrastructure
WORKDIR /app/shared/infrastructure
RUN npm ci && npm run build

# Switch to translation-service directory
WORKDIR /app/translation-service

# Copy package files for translation-service
COPY translation-service/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy translation-service source code
COPY translation-service/ ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Set working directory - IMPORTANT: Must match service directory for NPM resolution
WORKDIR /app/translation-service

# Copy shared infrastructure (both dist and node_modules) to parent directory for NPM resolution
COPY --from=builder /app/shared/infrastructure /app/shared/infrastructure

# Copy package files
COPY --from=builder /app/translation-service/package*.json ./

# Install only production dependencies (creates symlink to ../shared/infrastructure)
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/translation-service/dist ./dist

# Copy scripts folder for seeding
COPY --from=builder /app/translation-service/scripts ./scripts

# Change ownership to app user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Set NODE_PATH to include shared infrastructure node_modules
ENV NODE_PATH=/app/shared/infrastructure/node_modules:/app/translation-service/node_modules

# Expose port
EXPOSE 3007

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3007/api/v1/health || exit 1

# Start the application
CMD ["node", "dist/translation-service/src/main.js"]







