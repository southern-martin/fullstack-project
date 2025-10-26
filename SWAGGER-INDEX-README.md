# 📊 Swagger API Documentation Index

A centralized hub for accessing all microservice API documentation in the Fullstack Project.

---

## 🎯 Quick Start

### Option 1: Use the Node.js Server (Recommended)

```bash
# Start the server
node swagger-server.js

# Access in browser
# Open: http://localhost:8080
```

### Option 2: Open HTML File Directly

```bash
# macOS
open swagger-index.html

# Linux
xdg-open swagger-index.html

# Windows
start swagger-index.html
```

**Note**: Opening the file directly may have limited functionality due to CORS restrictions on health checks.

---

## 🌟 Features

### 📋 Centralized Dashboard
- **Single entry point** to all microservice Swagger documentation
- **Visual service cards** with icons, descriptions, and quick links
- **Live health status** indicators (Running/Offline)
- **Responsive design** - works on desktop, tablet, and mobile

### 🔗 Service Coverage
The index provides access to all 6 microservices:

1. **Auth Service** (Port 3001) - Authentication & JWT
2. **User Service** (Port 3003) - User management
3. **Customer Service** (Port 3004) - Customer operations
4. **Carrier Service** (Port 3005) - Carrier management
5. **Pricing Service** (Port 3006) - Pricing calculations
6. **Translation Service** (Port 3007) - Multi-language i18n

### 📚 Additional Information
- System architecture overview
- Database strategy details
- Quick commands reference
- Default credentials
- Links to project documentation
- Infrastructure services overview

---

## 🖥️ Server Details

### Configuration

The `swagger-server.js` provides a simple HTTP server with:

- **Default Port**: 8080
- **Configurable**: Use `SWAGGER_INDEX_PORT` environment variable
- **Health Endpoint**: `/health`
- **Zero Dependencies**: Uses only built-in Node.js modules

### Environment Variables

```bash
# Change server port
SWAGGER_INDEX_PORT=9000 node swagger-server.js

# Change host (default: localhost)
SWAGGER_INDEX_HOST=0.0.0.0 node swagger-server.js
```

### Server Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Serves the Swagger index HTML page |
| `/index.html` | GET | Alternative path to index |
| `/health` | GET | Health check endpoint (JSON response) |
| `/*.md` | GET | Serves markdown files as plain text |

### Health Check Response

```json
{
  "status": "healthy",
  "service": "swagger-index",
  "timestamp": "2025-10-26T09:22:51.982Z"
}
```

---

## 🎨 Design Features

### Visual Elements
- **Modern gradient background** (purple theme)
- **Card-based layout** for each service
- **Hover effects** with smooth transitions
- **Color-coded status badges**:
  - 🟢 Green: Service is running
  - ⚫ Gray: Service is offline
  - 🔵 Blue: Checking status

### Responsive Grid
- **Desktop**: 3 columns
- **Tablet**: 2 columns
- **Mobile**: 1 column (stacked)

### Interactive Features
- **Live service status checks** via JavaScript
- **Smooth animations** on hover and click
- **Quick access buttons** to Swagger docs and health endpoints

---

## 📖 Information Sections

### 1. System Overview
Displays high-level architecture information:
- Architecture type (Hybrid Microservices)
- Total service count
- Database strategy
- Caching infrastructure

### 2. Quick Links to Documentation
Direct links to all project documentation:
- Architecture Guide
- Developer Quick Reference
- AI Agent Prompts
- Quick Start Guide
- Documentation Index

### 3. Service Cards
Each microservice has a dedicated card showing:
- Service name and icon
- Port number
- Description of purpose
- Link to Swagger documentation
- Link to health check endpoint
- Live status indicator

### 4. Quick Commands
Common Docker Compose commands:
- Start all services
- Stop all services
- View logs
- Check service status

### 5. Default Credentials
Quick reference for login credentials:
- Admin user credentials
- MySQL database credentials
- Redis connection details
- PostgreSQL credentials (dev)

### 6. Infrastructure Services
Overview of shared infrastructure:
- Shared MySQL Database (ports)
- Business MySQL Databases
- Redis Cache
- API Gateway (Kong)

---

## 🚀 Usage Examples

### Basic Usage

```bash
# Start the Swagger index server
node swagger-server.js

# The server will start and display:
# 🌐 Server URL:        http://localhost:8080
# 📖 Swagger Index:     http://localhost:8080/
# ❤️  Health Check:      http://localhost:8080/health
```

### Custom Port

```bash
# Use a different port
SWAGGER_INDEX_PORT=9000 node swagger-server.js

# Access at http://localhost:9000
```

### Check Server Health

```bash
# Using curl
curl http://localhost:8080/health

# Using curl with JSON formatting
curl -s http://localhost:8080/health | jq .
```

### Integration with npm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "swagger:serve": "node swagger-server.js",
    "swagger:open": "open swagger-index.html",
    "swagger:dev": "SWAGGER_INDEX_PORT=9000 node swagger-server.js"
  }
}
```

Then use:

```bash
npm run swagger:serve
npm run swagger:open
npm run swagger:dev
```

---

## 🔧 Customization

### Modify Port Numbers

If you change service ports, update the HTML file:

```javascript
// In swagger-index.html, update the services array:
const services = [
    { name: 'auth-service', port: 3001, element: null },
    { name: 'user-service', port: 3003, element: null },
    // ... update ports as needed
];
```

### Change Visual Theme

The gradient and colors can be customized in the `<style>` section:

```css
/* Current gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* You can change to any gradient or solid color */
```

### Add More Services

To add a new service card, copy an existing service card block in the HTML and update:
- Service icon
- Service name
- Port number
- Description
- Links

---

## 🎯 Use Cases

### For Developers
- **Quick access** to all API documentation
- **Service status** overview at a glance
- **No need to remember** individual service ports
- **Fast navigation** between service docs

### For New Team Members
- **Easy onboarding** with clear service descriptions
- **Visual overview** of system architecture
- **Default credentials** readily available
- **Links to documentation** for deeper learning

### For API Testing
- **Centralized access** to all Swagger UIs
- **Quick endpoint discovery**
- **Health check monitoring**
- **Service dependency understanding**

### For Documentation
- **Professional presentation** for stakeholders
- **Visual service catalog**
- **Self-documenting** architecture
- **Easy to share** (single HTML file or URL)

---

## 📦 File Structure

```
/opt/cursor-project/fullstack-project/
├── swagger-index.html          # Main HTML page (standalone)
├── swagger-server.js           # Node.js HTTP server
└── SWAGGER-INDEX-README.md     # This documentation file
```

### File Details

**swagger-index.html**:
- Type: Static HTML with embedded CSS and JavaScript
- Size: ~15 KB
- Dependencies: None (completely standalone)
- Browser Support: All modern browsers
- Features: Responsive design, live health checks, service cards

**swagger-server.js**:
- Type: Node.js HTTP server
- Size: ~3 KB
- Dependencies: Built-in Node.js modules only (http, fs, path)
- Node Version: Works with Node.js 12+
- Features: Static file serving, health endpoint, graceful shutdown

---

## 🔒 Security Considerations

### Development Use Only

This Swagger index is designed for **development environments**. For production:

1. **Authentication**: Add authentication before exposing Swagger docs
2. **HTTPS**: Use HTTPS instead of HTTP
3. **Access Control**: Implement IP whitelisting or VPN access
4. **Rate Limiting**: Add rate limiting to prevent abuse

### Current Security Features

- **Read-only**: The server only serves static files
- **No database access**: No connection to databases
- **No authentication required**: Suitable for local development
- **Graceful shutdown**: Proper signal handling (SIGTERM, SIGINT)

---

## 🐛 Troubleshooting

### Server Won't Start

**Issue**: Port 8080 already in use

```bash
# Check what's using port 8080
lsof -i :8080

# Use a different port
SWAGGER_INDEX_PORT=9000 node swagger-server.js
```

### Health Checks Not Working

**Issue**: CORS errors when opening HTML file directly

**Solution**: Use the Node.js server instead:
```bash
node swagger-server.js
# Then access http://localhost:8080
```

### Services Show as Offline

**Issue**: Services are running but show as offline

**Possible Causes**:
1. Services are not actually running
2. Port numbers are incorrect
3. CORS policy blocking requests

**Check**:
```bash
# Verify services are running
docker-compose -f docker-compose.hybrid.yml ps

# Test individual service health
curl http://localhost:3001/health
curl http://localhost:3003/health
```

### Can't Access from Other Machines

**Issue**: Want to access from another computer on network

**Solution**:
```bash
# Bind to all interfaces
SWAGGER_INDEX_HOST=0.0.0.0 node swagger-server.js

# Then access from other machines using:
# http://<your-ip-address>:8080
```

---

## 📚 Related Documentation

- [Architecture Guide](ARCHITECTURE-GUIDE.md) - Complete system architecture
- [Developer Quick Reference](DEVELOPER-QUICK-REFERENCE.md) - Daily commands
- [Quick Start Guide](QUICK-START.md) - Get services running
- [Documentation Index](DOCUMENTATION-INDEX.md) - All documentation

---

## 🎉 Benefits

### Productivity Gains
- ⏱️ **Save time**: No need to look up port numbers
- 🔍 **Easy discovery**: All APIs in one place
- 📊 **Visual overview**: Understand system at a glance
- 🚀 **Quick access**: One click to any Swagger doc

### Documentation Value
- 📖 **Self-documenting**: Architecture is visible
- 🎨 **Professional**: Great for demos and stakeholders
- 🔗 **Centralized**: Single source of truth
- ♻️ **Reusable**: Template for other projects

### Team Collaboration
- 👥 **Onboarding**: New team members get quick overview
- 🤝 **Communication**: Clear service boundaries
- 📋 **Reference**: Always up-to-date service catalog
- 🎯 **Focus**: Developers can focus on code, not setup

---

## 🚀 Future Enhancements

Potential improvements (optional):

1. **API Gateway Integration**: Show routes through Kong
2. **Metrics Dashboard**: Display service metrics
3. **Authentication**: Add login for production use
4. **Search**: Filter services by name or description
5. **Dark Mode**: Toggle between light and dark themes
6. **Service Dependencies**: Visual graph of service relationships
7. **API Statistics**: Show endpoint counts and usage
8. **Version Information**: Display service versions

---

## 📝 Changelog

### Version 1.0.0 (October 26, 2025)
- ✨ Initial release
- 📊 Central Swagger index page
- 🖥️ Simple HTTP server
- 🎨 Responsive design
- ❤️ Live health checks
- 📚 Documentation integration

---

## 📄 License

This Swagger index is part of the Fullstack Project and follows the same license as the main project.

---

## 🤝 Contributing

To improve the Swagger index:

1. Edit `swagger-index.html` for visual/content changes
2. Edit `swagger-server.js` for server functionality
3. Test changes locally
4. Update this README if adding new features

---

**Last Updated**: October 26, 2025

**Maintained by**: Fullstack Project Team
