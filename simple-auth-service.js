const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language']
}));
app.use(express.json());

// Mock users database
const users = [
    {
        id: 1,
        email: 'admin@example.com',
        password: 'admin123', // In real app, this would be hashed
        name: 'Admin User',
        role: 'admin'
    },
    {
        id: 2,
        email: 'user@example.com',
        password: 'user123',
        name: 'Regular User',
        role: 'user'
    },
    {
        id: 3,
        email: 'test@gmail.com',
        password: 'Admin123',
        name: 'Test User',
        role: 'admin'
    }
];

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'auth-service', timestamp: new Date().toISOString() });
});

// Login endpoint
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, password: password ? '***' : 'missing' });

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    // Find user by email
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    // Check password (in real app, this would be hashed comparison)
    if (user.password !== password) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    // Generate mock JWT token
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    // Return success response
    res.json({
        success: true,
        message: 'Login successful',
        data: {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            token: token,
            expiresIn: '24h'
        }
    });
});

// Register endpoint
app.post('/auth/register', (req, res) => {
    const { email, password, name } = req.body;

    console.log('Register attempt:', { email, name, password: password ? '***' : 'missing' });

    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: 'Email, password, and name are required'
        });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: 'User with this email already exists'
        });
    }

    // Create new user
    const newUser = {
        id: users.length + 1,
        email,
        password, // In real app, this would be hashed
        name,
        role: 'user'
    };

    users.push(newUser);

    // Generate mock JWT token
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            token: token,
            expiresIn: '24h'
        }
    });
});

// Validate token endpoint
app.post('/auth/validate', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token is required'
        });
    }

    // Mock token validation
    if (token.startsWith('mock-jwt-token-')) {
        const userId = token.split('-')[3];
        const user = users.find(u => u.id == userId);

        if (user) {
            return res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                }
            });
        }
    }

    res.status(401).json({
        success: false,
        message: 'Invalid token'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Simple Auth Service running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  /health`);
    console.log(`   POST /auth/login`);
    console.log(`   POST /auth/register`);
    console.log(`   POST /auth/validate`);
    console.log(`\n👤 Test users:`);
    console.log(`   admin@example.com / admin123`);
    console.log(`   user@example.com / user123`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Simple Auth Service...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down Simple Auth Service...');
    process.exit(0);
});

