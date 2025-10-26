# Multi-stage build for production optimization
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Build shared infrastructure first
COPY shared/infrastructure ./shared/infrastructure
WORKDIR /app/shared/infrastructure
RUN npm ci && npm run build

# Switch to carrier-service directory
WORKDIR /app/carrier-service

# Copy package files for carrier-service
COPY carrier-service/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copy carrier-service source code
COPY carrier-service/ ./

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
WORKDIR /app/carrier-service

# Copy shared infrastructure to parent directory for NPM resolution
COPY --from=builder /app/shared/infrastructure /app/shared/infrastructure

# Remove the src directory and create symlink for TypeScript path resolution (dist as src for runtime)
RUN rm -rf /app/shared/infrastructure/src && \
    ln -s /app/shared/infrastructure/dist /app/shared/infrastructure/src && \
    ln -s /app/shared/infrastructure/node_modules /app/shared/infrastructure/dist/node_modules

# Copy package files
COPY --from=builder /app/carrier-service/package*.json ./

# Install only production dependencies (creates symlink to ../shared/infrastructure)
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/carrier-service/dist ./dist

# Copy scripts folder for seeding
COPY --from=builder /app/carrier-service/scripts ./scripts

# Change ownership to app user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Set NODE_PATH to help Node.js resolve shared infrastructure dependencies
ENV NODE_PATH=/app/shared/infrastructure/node_modules:/app/carrier-service/node_modules

# Expose port
EXPOSE 3005

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3005/health || exit 1

# Start the application
CMD ["node", "dist/carrier-service/src/main.js"]







