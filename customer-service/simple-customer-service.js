const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3004;

// Mock database for demo purposes
const mockCustomers = {};
let nextId = 1;

// Generate 50 mock customers
const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack', 'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rachel', 'Sam', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara', 'Zoe', 'Adam', 'Beth', 'Chris', 'Diana', 'Eric', 'Fiona', 'George', 'Hannah', 'Ian', 'Julia', 'Kevin', 'Laura', 'Mike', 'Nancy', 'Oscar', 'Penny', 'Quincy', 'Rita', 'Steve', 'Tara', 'Ulysses', 'Vera'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
const companies = ['TechCorp', 'InnovateLabs', 'DataSystems', 'CloudTech', 'WebSolutions', 'AppDev', 'SoftwareInc', 'DigitalWorks', 'CodeMasters', 'TechGiant', 'FutureSoft', 'NextGen', 'SmartTech', 'ProDev', 'EliteCode', 'MegaCorp', 'StartupHub', 'TechFlow', 'DevStudio', 'CodeCraft'];

for (let i = 0; i < 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase()}.com`;

    mockCustomers[nextId] = {
        id: nextId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        isActive: Math.random() > 0.1, // 90% active
        dateOfBirth: new Date(1970 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        address: {
            street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
            city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'][Math.floor(Math.random() * 10)],
            state: ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'][Math.floor(Math.random() * 10)],
            zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
            country: 'USA'
        },
        preferences: {
            status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)],
            company: company,
            industry: 'Technology',
            newsletter: Math.random() > 0.3, // 70% subscribe to newsletter
            customerType: ['individual', 'business', 'enterprise'][Math.floor(Math.random() * 3)],
            preferredContact: 'email'
        }
    };
    nextId++;
}

// Middleware
app.use(cors());
app.use(express.json());

// Validation rules
const createCustomerValidation = [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid email address'),
    body('firstName').notEmpty().withMessage('First name is required').isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('lastName').notEmpty().withMessage('Last name is required').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('phone').optional().isLength({ min: 10 }).withMessage('Phone must be at least 10 characters'),
];

// Get customers endpoint
app.get('/api/v1/customers', (req, res) => {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Convert mock customers to the expected format
    let customers = Object.values(mockCustomers).map(customer => ({
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        isActive: customer.isActive,
        dateOfBirth: customer.dateOfBirth,
        address: customer.address,
        preferences: customer.preferences,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    }));

    // Apply search filter if provided
    if (search) {
        const searchLower = search.toLowerCase();
        customers = customers.filter(customer =>
            customer.firstName.toLowerCase().includes(searchLower) ||
            customer.lastName.toLowerCase().includes(searchLower) ||
            customer.email.toLowerCase().includes(searchLower) ||
            customer.preferences.company.toLowerCase().includes(searchLower)
        );
    }

    // Calculate pagination
    const total = customers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated customers
    const paginatedCustomers = customers.slice(startIndex, endIndex);

    res.json({
        customers: paginatedCustomers,
        total: total,
        page: page,
        limit: limit,
        totalPages: totalPages
    });
});

// Get customer by ID endpoint
app.get('/api/v1/customers/:id', (req, res) => {
    const customerId = parseInt(req.params.id);
    const customer = mockCustomers[customerId];

    if (!customer) {
        return res.status(404).json({
            message: 'Customer not found',
            statusCode: 404,
            error: 'Not Found'
        });
    }

    res.json({
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        isActive: customer.isActive,
        dateOfBirth: customer.dateOfBirth,
        address: customer.address,
        preferences: customer.preferences,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    });
});

// Create customer endpoint
app.post('/api/v1/customers', createCustomerValidation, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Format errors for frontend
        const fieldErrors = {};
        errors.array().forEach(error => {
            if (!fieldErrors[error.path]) {
                fieldErrors[error.path] = [];
            }
            fieldErrors[error.path].push(error.msg);
        });

        return res.status(400).json({
            message: 'Validation failed',
            fieldErrors,
            statusCode: 400,
            error: 'Validation Error'
        });
    }

    // Check if email already exists
    const existingEmails = Object.values(mockCustomers).map(customer => customer.email.toLowerCase());
    if (existingEmails.includes(req.body.email.toLowerCase())) {
        return res.status(400).json({
            message: 'Validation failed',
            fieldErrors: {
                email: ['This email address is already registered. Please use a different email.']
            },
            statusCode: 400,
            error: 'Validation Error'
        });
    }

    // Create new customer
    const newCustomer = {
        id: nextId++,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone || '',
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        dateOfBirth: req.body.dateOfBirth || '',
        address: req.body.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
        },
        preferences: req.body.preferences || {
            status: 'active',
            company: '',
            industry: 'Technology',
            newsletter: false,
            customerType: 'individual',
            preferredContact: 'email'
        }
    };

    mockCustomers[newCustomer.id] = newCustomer;

    res.status(201).json({
        id: newCustomer.id,
        email: newCustomer.email,
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        phone: newCustomer.phone,
        isActive: newCustomer.isActive,
        dateOfBirth: newCustomer.dateOfBirth,
        address: newCustomer.address,
        preferences: newCustomer.preferences,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    });
});

// Update customer endpoint
app.patch('/api/v1/customers/:id', (req, res) => {
    const customerId = parseInt(req.params.id);
    const customer = mockCustomers[customerId];

    if (!customer) {
        return res.status(404).json({
            message: 'Customer not found',
            statusCode: 404,
            error: 'Not Found'
        });
    }

    const fieldErrors = {};

    // Basic field validation for provided fields
    if (req.body.email !== undefined) {
        if (!req.body.email || req.body.email.trim() === '') {
            fieldErrors.email = ['Email is required'];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
            fieldErrors.email = ['Please enter a valid email address'];
        } else {
            // Check if email already exists (excluding current customer)
            const existingEmails = Object.values(mockCustomers)
                .filter(c => c.id !== customerId)
                .map(c => c.email.toLowerCase());
            if (existingEmails.includes(req.body.email.toLowerCase())) {
                fieldErrors.email = ['This email address is already registered. Please use a different email.'];
            }
        }
    }

    if (req.body.firstName !== undefined) {
        if (!req.body.firstName || req.body.firstName.trim() === '') {
            fieldErrors.firstName = ['First name is required'];
        } else if (req.body.firstName.trim().length < 2) {
            fieldErrors.firstName = ['First name must be at least 2 characters'];
        } else if (req.body.firstName.length > 50) {
            fieldErrors.firstName = ['First name must not exceed 50 characters'];
        }
    }

    if (req.body.lastName !== undefined) {
        if (!req.body.lastName || req.body.lastName.trim() === '') {
            fieldErrors.lastName = ['Last name is required'];
        } else if (req.body.lastName.trim().length < 2) {
            fieldErrors.lastName = ['Last name must be at least 2 characters'];
        } else if (req.body.lastName.length > 50) {
            fieldErrors.lastName = ['Last name must not exceed 50 characters'];
        }
    }

    // If there are field validation errors, return them
    if (Object.keys(fieldErrors).length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            fieldErrors,
            statusCode: 400,
            error: 'Validation Error'
        });
    }

    // Update customer
    Object.assign(customer, req.body);

    res.json({
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        isActive: customer.isActive,
        dateOfBirth: customer.dateOfBirth,
        address: customer.address,
        preferences: customer.preferences,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString()
    });
});

// Delete customer endpoint
app.delete('/api/v1/customers/:id', (req, res) => {
    const customerId = parseInt(req.params.id);

    if (!mockCustomers[customerId]) {
        return res.status(404).json({
            message: 'Customer not found',
            statusCode: 404,
            error: 'Not Found'
        });
    }

    delete mockCustomers[customerId];

    res.status(204).send();
});

// Health check
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'customer-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(port, () => {
    console.log(`🚀 Simple Customer Service is running on: http://localhost:${port}/api/v1`);
    console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
});
