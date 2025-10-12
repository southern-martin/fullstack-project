// Comprehensive Mock Server for all services (no dependencies required)
const http = require('http');
const url = require('url');

const PORT = 3001;

// Mock data
const mockUser = {
    id: 1,
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['admin'],
    isActive: true,
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
};

const mockUsers = [
    mockUser,
    {
        id: 2,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['user'],
        isActive: true,
        isEmailVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
        id: 3,
        email: 'test@gmail.com',
        firstName: 'Test',
        lastName: 'User',
        roles: ['user'],
        isActive: true,
        isEmailVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
        id: 4,
        email: 'test1@gmail.com',
        firstName: 'Test1',
        lastName: 'User',
        roles: ['user'],
        isActive: true,
        isEmailVerified: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
    }
];

const mockRoles = [
    { id: 1, name: 'admin', description: 'Administrator with full access' },
    { id: 2, name: 'user', description: 'Regular user with basic access' },
    { id: 3, name: 'editor', description: 'Editor with content management access' },
    { id: 4, name: 'viewer', description: 'Viewer with read-only access' }
];

const mockCarriers = [
    {
        id: 1,
        name: 'FedEx',
        code: 'FEDEX',
        contactEmail: 'contact@fedex.com',
        contactPhone: '+1-800-463-3339',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
        id: 2,
        name: 'UPS',
        code: 'UPS',
        contactEmail: 'contact@ups.com',
        contactPhone: '+1-800-742-5877',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
    }
];

const mockCustomers = [
    {
        id: 1,
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1-555-0123',
        address: '123 Business St, City, State 12345',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
    }
];

const mockToken = 'mock-jwt-token-' + Date.now();

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(200, corsHeaders);
        res.end();
        return;
    }

    // Set CORS headers
    Object.keys(corsHeaders).forEach(key => {
        res.setHeader(key, corsHeaders[key]);
    });

    // Auth Service Endpoints
    if (path.startsWith('/api/v1/auth/')) {
        handleAuthEndpoints(req, res, path, method);
        return;
    }

    // User Service Endpoints
    if (path.startsWith('/api/v1/users')) {
        handleUserEndpoints(req, res, path, method);
        return;
    }

    // Carrier Service Endpoints
    if (path.startsWith('/api/v1/carriers')) {
        handleCarrierEndpoints(req, res, path, method);
        return;
    }

    // Customer Service Endpoints
    if (path.startsWith('/api/v1/customers')) {
        handleCustomerEndpoints(req, res, path, method);
        return;
    }

    // Pricing Service Endpoints
    if (path.startsWith('/api/v1/pricing')) {
        handlePricingEndpoints(req, res, path, method);
        return;
    }

    // Translation Service Endpoints (plural)
    if (path.startsWith('/api/v1/translations')) {
        handleTranslationEndpoints(req, res, path, method);
        return;
    }

    // Translation Service Endpoints (singular)
    if (path.startsWith('/api/v1/translation')) {
        handleTranslationEndpoints(req, res, path, method);
        return;
    }

    // Health check for all services
    if (path === '/health' || path === '/api/v1/health') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'mock',
            version: '1.0.0',
            services: ['auth', 'user', 'carrier', 'customer', 'pricing', 'translation']
        }));
        return;
    }

    // 404 for other routes
    res.writeHead(404);
    res.end(JSON.stringify({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Endpoint not found'
        }
    }));
});

// Auth Service Handlers
function handleAuthEndpoints(req, res, path, method) {
    if (path === '/api/v1/auth/health' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'mock',
            version: '1.0.0'
        }));
        return;
    }

    if (path === '/api/v1/auth/login' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { email, password } = JSON.parse(body);

                // Find user by email
                const user = mockUsers.find(u => u.email === email);

                if (user && user.isActive) {
                    // Check password - for demo purposes, accept 'Admin123' for all users
                    // In a real app, you'd hash and compare passwords
                    if (password === 'Admin123' ||
                        (email === 'admin@example.com' && password === 'admin123')) {

                        res.writeHead(200);
                        res.end(JSON.stringify({
                            success: true,
                            data: {
                                user: user,
                                accessToken: mockToken,
                                expiresIn: '24h'
                            },
                            message: 'Login successful'
                        }));
                    } else {
                        res.writeHead(401);
                        res.end(JSON.stringify({
                            success: false,
                            error: {
                                code: 'INVALID_CREDENTIALS',
                                message: 'Invalid password'
                            }
                        }));
                    }
                } else {
                    res.writeHead(401);
                    res.end(JSON.stringify({
                        success: false,
                        error: {
                            code: 'INVALID_CREDENTIALS',
                            message: 'User not found or inactive'
                        }
                    }));
                }
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'Invalid JSON'
                    }
                }));
            }
        });
        return;
    }

    if (path === '/api/v1/auth/profile' && method === 'GET') {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: mockUser
            }));
        } else {
            res.writeHead(401);
            res.end(JSON.stringify({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'No valid token provided'
                }
            }));
        }
        return;
    }

    // 404 for other auth routes
    res.writeHead(404);
    res.end(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Auth endpoint not found' }
    }));
}

// User Service Handlers
function handleUserEndpoints(req, res, path, method) {
    // GET /api/v1/users - List users with pagination
    if (path === '/api/v1/users' && method === 'GET') {
        const parsedUrl = url.parse(req.url, true);
        const query = parsedUrl.query;
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            users: mockUsers,
            total: mockUsers.length
        }));
        return;
    }

    // GET /api/v1/users/active - Get active users
    if (path === '/api/v1/users/active' && method === 'GET') {
        const activeUsers = mockUsers.filter(user => user.isActive);
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: activeUsers
        }));
        return;
    }

    // GET /api/v1/users/count - Get user count
    if (path === '/api/v1/users/count' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: { count: mockUsers.length }
        }));
        return;
    }

    // GET /api/v1/users/roles - Get roles
    if (path === '/api/v1/users/roles' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: mockRoles
        }));
        return;
    }

    // GET /api/v1/users/role/{roleName} - Get users by role
    if (path.startsWith('/api/v1/users/role/') && method === 'GET') {
        const roleName = path.split('/').pop();
        const usersByRole = mockUsers.filter(user => user.roles.includes(roleName));
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: usersByRole
        }));
        return;
    }

    // GET /api/v1/users/email/{email} - Get user by email
    if (path.startsWith('/api/v1/users/email/') && method === 'GET') {
        const email = path.split('/').pop();
        const user = mockUsers.find(u => u.email === email);
        if (user) {
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: user
            }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({
                success: false,
                error: { code: 'NOT_FOUND', message: 'User not found' }
            }));
        }
        return;
    }

    // GET /api/v1/users/exists/{email} - Check if user exists
    if (path.startsWith('/api/v1/users/exists/') && method === 'GET') {
        const email = path.split('/').pop();
        const exists = mockUsers.some(u => u.email === email);
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: { exists }
        }));
        return;
    }

    // GET /api/v1/users/{id} - Get user by ID
    if (path.match(/^\/api\/v1\/users\/\d+$/) && method === 'GET') {
        const id = parseInt(path.split('/').pop());
        const user = mockUsers.find(u => u.id === id);
        if (user) {
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                data: user
            }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({
                success: false,
                error: { code: 'NOT_FOUND', message: 'User not found' }
            }));
        }
        return;
    }

    // POST /api/v1/users - Create user
    if (path === '/api/v1/users' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const userData = JSON.parse(body);
                const newUser = {
                    id: mockUsers.length + 1,
                    ...userData,
                    password: userData.password || 'Admin123', // Set default password
                    isActive: true,
                    isEmailVerified: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                mockUsers.push(newUser);

                res.writeHead(201);
                res.end(JSON.stringify({
                    success: true,
                    data: newUser,
                    message: 'User created successfully'
                }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    success: false,
                    error: { code: 'INVALID_REQUEST', message: 'Invalid JSON' }
                }));
            }
        });
        return;
    }

    // PATCH /api/v1/users/{id} - Update user
    if (path.match(/^\/api\/v1\/users\/\d+$/) && method === 'PATCH') {
        const id = parseInt(path.split('/').pop());
        const userIndex = mockUsers.findIndex(u => u.id === id);

        if (userIndex === -1) {
            res.writeHead(404);
            res.end(JSON.stringify({
                success: false,
                error: { code: 'NOT_FOUND', message: 'User not found' }
            }));
            return;
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updateData = JSON.parse(body);
                mockUsers[userIndex] = {
                    ...mockUsers[userIndex],
                    ...updateData,
                    updatedAt: new Date().toISOString()
                };

                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    data: mockUsers[userIndex],
                    message: 'User updated successfully'
                }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    success: false,
                    error: { code: 'INVALID_REQUEST', message: 'Invalid JSON' }
                }));
            }
        });
        return;
    }

    // DELETE /api/v1/users/{id} - Delete user
    if (path.match(/^\/api\/v1\/users\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/').pop());
        const userIndex = mockUsers.findIndex(u => u.id === id);

        if (userIndex === -1) {
            res.writeHead(404);
            res.end(JSON.stringify({
                success: false,
                error: { code: 'NOT_FOUND', message: 'User not found' }
            }));
            return;
        }

        mockUsers.splice(userIndex, 1);
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            message: 'User deleted successfully'
        }));
        return;
    }

    // 404 for other user routes
    res.writeHead(404);
    res.end(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User endpoint not found' }
    }));
}

// Carrier Service Handlers
function handleCarrierEndpoints(req, res, path, method) {
    if (path === '/api/v1/carriers' && method === 'GET') {
        const parsedUrl = url.parse(req.url, true);
        const query = parsedUrl.query;
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: mockCarriers,
            total: mockCarriers.length
        }));
        return;
    }

    // GET /api/v1/carriers/count - Get carrier count
    if (path === '/api/v1/carriers/count' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: { count: mockCarriers.length }
        }));
        return;
    }

    // 404 for other carrier routes
    res.writeHead(404);
    res.end(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Carrier endpoint not found' }
    }));
}

// Customer Service Handlers
function handleCustomerEndpoints(req, res, path, method) {
    if (path === '/api/v1/customers' && method === 'GET') {
        const parsedUrl = url.parse(req.url, true);
        const query = parsedUrl.query;
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: mockCustomers,
            total: mockCustomers.length
        }));
        return;
    }

    // GET /api/v1/customers/count - Get customer count
    if (path === '/api/v1/customers/count' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: { count: mockCustomers.length }
        }));
        return;
    }

    // 404 for other customer routes
    res.writeHead(404);
    res.end(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Customer endpoint not found' }
    }));
}

// Pricing Service Handlers
function handlePricingEndpoints(req, res, path, method) {
    if (path === '/api/v1/pricing/calculate' && method === 'POST') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: {
                carrier: 'FedEx',
                service: 'Ground',
                estimatedCost: 25.50,
                estimatedDays: 3,
                currency: 'USD'
            }
        }));
        return;
    }

    // GET /api/v1/pricing/rules/count - Get pricing rules count
    if (path === '/api/v1/pricing/rules/count' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: { count: 5 } // Mock count
        }));
        return;
    }

    // GET /api/v1/pricing/calculations/count - Get price calculations count
    if (path === '/api/v1/pricing/calculations/count' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: { count: 12 } // Mock count
        }));
        return;
    }

    // 404 for other pricing routes
    res.writeHead(404);
    res.end(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Pricing endpoint not found' }
    }));
}

// Translation Service Handlers
function handleTranslationEndpoints(req, res, path, method) {
    if (path === '/api/v1/translations/languages' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: [
                { id: 1, code: 'en', name: 'English', isActive: true },
                { id: 2, code: 'fr', name: 'French', isActive: true }
            ]
        }));
        return;
    }

    // GET /api/v1/translations/languages/count - Get languages count
    if (path === '/api/v1/translations/languages/count' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: { count: 2 }
        }));
        return;
    }

    // GET /api/v1/translations/count - Get translations count
    if (path === '/api/v1/translations/count' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: { count: 25 } // Mock count
        }));
        return;
    }

    // GET /api/v1/translation/languages/count - Get languages count (singular URL)
    if (path === '/api/v1/translation/languages/count' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: { count: 2 }
        }));
        return;
    }

    // GET /api/v1/translation/translations/count - Get translations count (singular URL)
    if (path === '/api/v1/translation/translations/count' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: { count: 25 } // Mock count
        }));
        return;
    }

    // 404 for other translation routes
    res.writeHead(404);
    res.end(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Translation endpoint not found' }
    }));
}

server.listen(PORT, () => {
    console.log(`🚀 Comprehensive Mock Server running on http://localhost:${PORT}`);
    console.log(`📋 Available services:`);
    console.log(`   🔐 Auth Service: /api/v1/auth/*`);
    console.log(`   👥 User Service: /api/v1/users/*`);
    console.log(`   🚚 Carrier Service: /api/v1/carriers/*`);
    console.log(`   🏢 Customer Service: /api/v1/customers/*`);
    console.log(`   💰 Pricing Service: /api/v1/pricing/*`);
    console.log(`   🌐 Translation Service: /api/v1/translations/*`);
    console.log(`   ❤️  Health Check: /health`);
    console.log(`\n🔑 Test credentials:`);
    console.log(`   Email: admin@example.com`);
    console.log(`   Password: Admin123 (or admin123)`);
    console.log(`\n✨ All services are now available for testing!`);
});
