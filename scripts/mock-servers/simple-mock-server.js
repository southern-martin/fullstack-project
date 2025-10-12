// Simple Mock Auth Server (no dependencies required)
const http = require('http');
const url = require('url');

const PORT = 3001;

// Mock user data
const mockUser = {
    id: 1,
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['admin'],
    isActive: true,
    isEmailVerified: true
};

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

    // Health check
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

    // Login endpoint
    if (path === '/api/v1/auth/login' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { email, password } = JSON.parse(body);

                if (email === 'admin@example.com' && (password === 'admin123' || password === 'Admin123')) {
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        success: true,
                        data: {
                            user: mockUser,
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
                            message: 'Invalid email or password'
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

    // Profile endpoint
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

server.listen(PORT, () => {
    console.log(`🚀 Simple Mock Auth Server running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  /api/v1/auth/health`);
    console.log(`   POST /api/v1/auth/login`);
    console.log(`   GET  /api/v1/auth/profile`);
    console.log(`\n🔑 Test credentials:`);
    console.log(`   Email: admin@example.com`);
    console.log(`   Password: admin123`);
    console.log(`\n✨ Now try logging in to your React Admin app!`);
});
