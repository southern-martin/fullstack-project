// Mock Auth Server for testing frontend without backend
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

// Mock JWT token
const mockToken = 'mock-jwt-token-' + Date.now();

// Health check endpoint
app.get('/api/v1/auth/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'mock',
        version: '1.0.0'
    });
});

// Login endpoint
app.post('/api/v1/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'admin@example.com' && password === 'admin123') {
        res.json({
            success: true,
            data: {
                user: mockUser,
                accessToken: mockToken,
                expiresIn: '24h'
            },
            message: 'Login successful'
        });
    } else {
        res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid email or password'
            }
        });
    }
});

// Profile endpoint
app.get('/api/v1/auth/profile', (req, res) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        res.json({
            success: true,
            data: mockUser
        });
    } else {
        res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'No valid token provided'
            }
        });
    }
});

// Register endpoint
app.post('/api/v1/auth/register', (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    res.json({
        success: true,
        data: {
            user: {
                id: 2,
                email,
                firstName,
                lastName,
                roles: ['user'],
                isActive: true,
                isEmailVerified: false
            },
            accessToken: 'mock-jwt-token-' + Date.now(),
            expiresIn: '24h'
        },
        message: 'Registration successful'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Mock Auth Server running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  /api/v1/auth/health`);
    console.log(`   POST /api/v1/auth/login`);
    console.log(`   GET  /api/v1/auth/profile`);
    console.log(`   POST /api/v1/auth/register`);
    console.log(`\n🔑 Test credentials:`);
    console.log(`   Email: admin@example.com`);
    console.log(`   Password: admin123`);
});
