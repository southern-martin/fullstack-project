# Fullstack Project Build System

This project provides a comprehensive build system for managing both the NestJS backend and React frontend with debug capabilities.

## Quick Start

### Prerequisites
- Node.js (latest LTS version)
- npm (comes with Node.js)
- Make (for Go API, optional)

### Setup and Run

```bash
# Setup everything
make setup

# Start all services in development mode
make dev

# Start all services in debug mode
make debug

# Stop all services
make stop
```

## Available Commands

### General Commands

| Command | Description |
|---------|-------------|
| `make setup` | Setup build environment and install dependencies |
| `make build` | Build all projects |
| `make start` | Start all development servers |
| `make debug` | Start all services in debug mode |
| `make dev` | Start all services in development mode with hot reload |
| `make stop` | Stop all running services |
| `make restart` | Restart all services |
| `make test` | Run all tests |
| `make clean` | Clean all build artifacts |
| `make health` | Check health of all services |

### Backend-Specific Commands

| Command | Description |
|---------|-------------|
| `make backend-setup` | Setup backend only |
| `make backend-build` | Build backend only |
| `make backend-start` | Start backend only |
| `make backend-debug` | Start backend in debug mode |
| `make backend-test` | Test backend only |

### Frontend-Specific Commands

| Command | Description |
|---------|-------------|
| `make frontend-setup` | Setup frontend only |
| `make frontend-build` | Build frontend only |
| `make frontend-start` | Start frontend only |
| `make frontend-debug` | Start frontend in debug mode |
| `make frontend-test` | Test frontend only |

### Go API Commands

| Command | Description |
|---------|-------------|
| `make go-build` | Build Go API |
| `make go-run` | Run Go API |
| `make go-debug` | Run Go API in debug mode |

## Alternative: Direct Script Usage

You can also use the development script directly:

```bash
# Setup everything
./scripts/dev.sh setup

# Start all services in development mode
./scripts/dev.sh dev

# Start all services in debug mode
./scripts/dev.sh debug

# Stop all services
./scripts/dev.sh stop
```

## Service URLs

When all services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **Backend Health**: http://localhost:3001/api/v1/health
- **Go API**: http://localhost:8080 (if enabled)

## Debug Configuration

### Backend Debug (NestJS)
- Debug port: 9229
- Attach your IDE to `localhost:9229` for debugging

### Frontend Debug (React)
- Use browser DevTools for debugging
- React DevTools extension recommended

### Go API Debug
- Debug port: 2345
- Use `dlv connect localhost:2345` to attach debugger

## Development Workflow

1. **Initial Setup**
   ```bash
   make setup
   ```

2. **Development Mode**
   ```bash
   make dev
   ```

3. **Debug Mode**
   ```bash
   make debug
   ```

4. **Testing**
   ```bash
   make test
   ```

5. **Stop Services**
   ```bash
   make stop
   ```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   make stop
   # Wait a few seconds, then try again
   ```

2. **Dependencies not installed**
   ```bash
   make setup
   ```

3. **Build failures**
   ```bash
   make clean
   make setup
   make build
   ```

### Health Check

```bash
make health
```

This will check if all services are responding correctly.

## Project Structure

```
fullstack-project/
├── Makefile               # Main Makefile
├── scripts/
│   └── dev.sh            # Development script
├── nestjs-app-api/        # NestJS backend
│   └── api/
├── react-admin/           # React frontend
├── go-app-api/            # Go API
└── README-BUILD.md        # This file
```

## Examples

```bash
# Quick development setup
make quick-dev

# Quick debug setup
make quick-debug

# Start only backend
make backend-start

# Start only frontend
make frontend-start

# Test only backend
make backend-test

# Test only frontend
make frontend-test
```

## Notes

- The build system automatically handles process management and cleanup
- All services run in the background with proper PID tracking
- The system provides colored output for better visibility
- Health checks are available to verify service status
- The system is designed to work without CMake for simplicity
