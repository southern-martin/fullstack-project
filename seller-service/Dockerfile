FROM node:20-alpine

WORKDIR /app

# Copy root package files for shared dependencies
COPY package*.json ./
COPY shared/ ./shared/

# Copy seller service package files
COPY seller-service/package*.json ./seller-service/

# Install ALL dependencies (including devDependencies for build)
WORKDIR /app/seller-service
COPY seller-service/package*.json ./
RUN npm ci

# Copy seller service source code
COPY seller-service/ ./

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 3010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3010/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "run", "start:prod"]
