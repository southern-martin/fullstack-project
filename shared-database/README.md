# Shared Database Setup for Auth and User Services

## 🎯 Overview

This setup implements a shared database solution where both Auth and User microservices use the same MySQL database, eliminating data duplication and sync issues.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop running
- Node.js and npm installed

### 1. Start Docker Desktop
Make sure Docker Desktop is running on your Mac.

### 2. Start the Shared Database
```bash
cd /opt/cursor-project/fullstack-project/shared-database
docker-compose up -d
```

### 3. Start the Services
```bash
# Start Auth Service
cd /opt/cursor-project/fullstack-project/auth-service
npm run start:dev

# Start User Service (in another terminal)
cd /opt/cursor-project/fullstack-project/user-service
npm run start:dev
```

## 📊 Database Configuration

### Shared Database Details:
- **Host**: localhost
- **Port**: 3306
- **Database**: shared_user_db
- **Username**: shared_user
- **Password**: shared_password_2024

### Tables Created:
- `users` - User information (shared between services)
- `roles` - User roles and permissions
- `user_roles` - Many-to-many relationship between users and roles

## 🔧 Service Configuration

Both services are configured to use the shared database:

### Auth Service (.env):
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=shared_user
DB_PASSWORD=shared_password_2024
DB_NAME=shared_user_db
```

### User Service (.env):
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=shared_user
DB_PASSWORD=shared_password_2024
DB_DATABASE=shared_user_db
```

## ✅ Benefits

1. **Single Source of Truth** - No duplicate user data
2. **No Sync Issues** - Changes are immediately available to both services
3. **Better Performance** - No cross-service API calls for user data
4. **Simpler Architecture** - Less complexity and maintenance
5. **Consistent Data** - No data inconsistencies between services

## 🧪 Testing

### Default Admin User:
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: admin

### Test the Setup:
1. Start the shared database
2. Start both services
3. Test login with the default admin user
4. Verify user data is accessible from both services

## 🔄 Troubleshooting

### If Docker is not running:
1. Start Docker Desktop
2. Wait for it to fully start
3. Try the commands again

### If services can't connect to database:
1. Check if database is running: `docker ps`
2. Check database logs: `docker logs shared-user-database`
3. Verify environment variables in .env files

### If you get connection refused errors:
1. Make sure the database is fully started (wait for health check)
2. Check if port 3306 is available
3. Restart the services after database is ready
