# Fullstack Project Build System

This project uses CMake to manage building and running both the NestJS backend and React frontend with debug capabilities.

## Prerequisites

Before using the build system, ensure you have the following installed:

- **CMake** 3.16 or later
- **Node.js** (latest LTS version)
- **npm** (comes with Node.js)
- **Make** (for Go API)
- **MySQL** client libraries

### Installation on macOS
```bash
# Install CMake
brew install cmake

# Install Node.js (if not already installed)
brew install node

# Install MySQL client
brew install mysql-client
```

### Installation on Ubuntu/Debian
```bash
# Install CMake
sudo apt-get update
sudo apt-get install cmake

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL client
sudo apt-get install libmysqlclient-dev
```

## Quick Start

### Using the Build Script (Recommended)

The easiest way to use the build system is through the provided build script:

```bash
# Setup everything
./build.sh setup

# Start all services in development mode
./build.sh dev

# Start all services in debug mode
./build.sh debug

# Stop all services
./build.sh stop
```

### Using Make

You can also use the Makefile for convenience:

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

### Using CMake Directly

For more control, you can use CMake directly:

```bash
# Create build directory
mkdir build && cd build

# Configure CMake
cmake .. -DCMAKE_BUILD_TYPE=Debug

# Run specific targets
make install-all    # Install all dependencies
make build-all      # Build all projects
make dev-all        # Start all in development mode
make debug-all      # Start all in debug mode
make stop-all       # Stop all services
```

## Available Commands

### General Commands

| Command | Description |
|---------|-------------|
| `setup` | Setup build environment and install dependencies |
| `build` | Build all projects |
| `start` | Start all development servers |
| `debug` | Start all services in debug mode |
| `dev` | Start all services in development mode with hot reload |
| `stop` | Stop all running services |
| `restart` | Restart all services |
| `test` | Run all tests |
| `clean` | Clean all build artifacts |
| `health` | Check health of all services |
| `logs` | View logs from all services |

### Backend-Specific Commands

| Command | Description |
|---------|-------------|
| `backend-setup` | Setup backend only |
| `backend-build` | Build backend only |
| `backend-start` | Start backend only |
| `backend-debug` | Start backend in debug mode |
| `backend-test` | Test backend only |

### Frontend-Specific Commands

| Command | Description |
|---------|-------------|
| `frontend-setup` | Setup frontend only |
| `frontend-build` | Build frontend only |
| `frontend-start` | Start frontend only |
| `frontend-debug` | Start frontend in debug mode |
| `frontend-test` | Test frontend only |

### Go API Commands

| Command | Description |
|---------|-------------|
| `go-build` | Build Go API |
| `go-run` | Run Go API |
| `go-debug` | Run Go API in debug mode |

### Database Commands

| Command | Description |
|---------|-------------|
| `db-migrate` | Run database migrations |
| `db-seed` | Seed database with initial data |

### Docker Commands

| Command | Description |
|---------|-------------|
| `docker-build` | Build Docker containers |
| `docker-up` | Start Docker containers |
| `docker-down` | Stop Docker containers |

## Development Workflow

### 1. Initial Setup
```bash
# Clone the repository and navigate to project root
cd fullstack-project

# Setup everything
./build.sh setup
```

### 2. Development Mode
```bash
# Start all services in development mode with hot reload
./build.sh dev
```

This will start:
- **Backend**: http://localhost:3001 (NestJS with hot reload)
- **Frontend**: http://localhost:3000 (React with hot reload)
- **Go API**: http://localhost:8080 (if enabled)

### 3. Debug Mode
```bash
# Start all services in debug mode
./build.sh debug
```

This enables:
- Backend debugging with Node.js inspector
- Frontend debugging with React DevTools
- Go API debugging with Delve debugger

### 4. Testing
```bash
# Run all tests
./build.sh test

# Run backend tests only
./build.sh backend-test

# Run frontend tests only
./build.sh frontend-test
```

### 5. Building for Production
```bash
# Build all projects for production
./build.sh build
```

## Service URLs

When all services are running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **Backend Health**: http://localhost:3001/api/v1/health
- **Go API**: http://localhost:8080 (if enabled)

## Debug Configuration

### Backend Debug (NestJS)
The backend runs with Node.js inspector enabled in debug mode:
- Debug port: 9229
- Attach your IDE to `localhost:9229` for debugging

### Frontend Debug (React)
The frontend runs with React DevTools and source maps enabled:
- Use browser DevTools for debugging
- React DevTools extension recommended

### Go API Debug
The Go API runs with Delve debugger:
- Debug port: 2345
- Use `dlv connect localhost:2345` to attach debugger

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   ./build.sh stop
   # Wait a few seconds, then try again
   ```

2. **Dependencies not installed**
   ```bash
   ./build.sh setup
   ```

3. **Build failures**
   ```bash
   ./build.sh clean
   ./build.sh setup
   ./build.sh build
   ```

4. **Database connection issues**
   - Ensure MySQL is running
   - Check database credentials in `.env` files
   - Run migrations: `./build.sh db-migrate`

### Logs and Debugging

```bash
# View all service logs
./build.sh logs

# Check service health
./build.sh health

# View backend logs only
make logs-backend
```

## Advanced Usage

### Custom CMake Configuration

You can customize the CMake configuration:

```bash
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr/local
```

### Parallel Building

CMake supports parallel building:

```bash
cd build
make -j$(nproc) build-all  # Linux
make -j$(sysctl -n hw.ncpu) build-all  # macOS
```

### Environment Variables

You can set environment variables for the build:

```bash
export NODE_ENV=development
export DEBUG=*
./build.sh debug
```

## Project Structure

```
fullstack-project/
├── CMakeLists.txt          # Main CMake configuration
├── Makefile               # Convenience Makefile
├── build.sh               # Build script
├── BUILD-README.md        # This file
├── nestjs-app-api/        # NestJS backend
│   └── api/
├── react-admin/           # React frontend
├── go-app-api/            # Go API
└── build/                 # CMake build directory (created automatically)
```

## Contributing

When adding new build targets:

1. Add the target to `CMakeLists.txt`
2. Add corresponding commands to `build.sh`
3. Add Makefile targets if needed
4. Update this README with new commands

## Support

For issues with the build system:

1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Try cleaning and rebuilding: `./build.sh clean && ./build.sh setup`
4. Check service logs: `./build.sh logs`
