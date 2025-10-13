const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Validation rules
const createUserValidation = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').notEmpty().withMessage('First name is required').isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').notEmpty().withMessage('Last name is required').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
];

// Get users endpoint
app.get('/api/v1/users', (req, res) => {
  // Mock users data
  const users = [
    {
      id: 1,
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      isEmailVerified: true,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      email: 'user@example.com',
      firstName: 'Regular',
      lastName: 'User',
      isActive: true,
      isEmailVerified: false,
      createdAt: '2025-01-02T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z'
    }
  ];

  res.json({
    users: users,
    total: users.length
  });
});

// Create user endpoint
app.post('/api/v1/users', createUserValidation, (req, res) => {
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
  
  // Custom rule validation
  const customRuleErrors = [];
  
  // Custom rule: Check if email already exists
  const existingEmails = ['admin@example.com', 'user@example.com', 'test@example.com'];
  if (existingEmails.includes(req.body.email.toLowerCase())) {
    customRuleErrors.push('This email address is already registered. Please use a different email.');
  }
  
  // Custom rule: Check if user is trying to use a restricted email domain
  const restrictedDomains = ['temp-mail.org', '10minutemail.com', 'guerrillamail.com'];
  const emailDomain = req.body.email.split('@')[1];
  if (restrictedDomains.includes(emailDomain)) {
    customRuleErrors.push('Temporary email addresses are not allowed. Please use a permanent email address.');
  }
  
  // Custom rule: Check if password is in common passwords list
  const commonPasswords = ['password', '123456', 'admin', 'qwerty', 'letmein'];
  if (commonPasswords.includes(req.body.password.toLowerCase())) {
    customRuleErrors.push('This password is too common. Please choose a more secure password.');
  }
  
  // If there are custom rule errors, return them
  if (customRuleErrors.length > 0) {
    return res.status(400).json({
      message: 'Custom rule validation failed',
      customRuleErrors,
      statusCode: 400,
      error: 'Custom Rule Error'
    });
  }
  
  // If validation passes, create user (mock response)
  const user = {
    id: Math.floor(Math.random() * 1000),
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    isActive: true,
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  res.status(201).json(user);
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'user-service',
    version: '1.0.0'
  });
});

app.listen(port, () => {
  console.log(`🚀 Simple User Service is running on: http://localhost:${port}/api/v1`);
  console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
});
