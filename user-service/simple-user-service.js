const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3003;

// Mock database for demo purposes
const mockUsers = {
  1: { id: 1, email: 'user1@example.com', firstName: 'John', lastName: 'Doe' },
  2: { id: 2, email: 'user2@example.com', firstName: 'Jane', lastName: 'Smith' },
  3: { id: 3, email: 'admin@example.com', firstName: 'Admin', lastName: 'User' }
};

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
  // Convert mock users to the expected format
  const users = Object.values(mockUsers).map(user => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isActive: true,
    isEmailVerified: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }));

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
  const existingEmails = Object.values(mockUsers).map(user => user.email.toLowerCase());
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

// Update user endpoint
app.put('/api/v1/users/:id', createUserValidation, (req, res) => {
  const userId = parseInt(req.params.id);
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

  // Custom rule: Check if email already exists (excluding current user)
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

  // Custom rule: Check if password is in common passwords list (only if password is provided)
  if (req.body.password) {
    const commonPasswords = ['password', '123456', 'admin', 'qwerty', 'letmein'];
    if (commonPasswords.includes(req.body.password.toLowerCase())) {
      customRuleErrors.push('This password is too common. Please choose a more secure password.');
    }
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

  // Mock successful user update
  const updatedUser = {
    id: userId,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    isEmailVerified: req.body.isEmailVerified !== undefined ? req.body.isEmailVerified : false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  };

  res.status(200).json(updatedUser);
});

// Patch user endpoint (for partial updates)
app.patch('/api/v1/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  // For PATCH requests, we'll be more lenient with validation
  // Only validate fields that are actually being updated

  const customRuleErrors = [];

  // Custom rule: Check if email is being changed to a restricted domain
  if (req.body.email) {
    const restrictedDomains = ['temp-mail.org', '10minutemail.com', 'guerrillamail.com'];
    const emailDomain = req.body.email.split('@')[1];
    if (restrictedDomains.includes(emailDomain)) {
      customRuleErrors.push('Temporary email addresses are not allowed. Please use a permanent email address.');
    }

    // Check if email already exists (only if it's different from current user's email)
    const currentUser = mockUsers[userId];
    if (currentUser) {
      const currentUserEmail = currentUser.email;

      // Only check for duplicates if the email is actually being changed
      if (req.body.email.toLowerCase() !== currentUserEmail.toLowerCase()) {
        const existingEmails = Object.values(mockUsers).map(user => user.email.toLowerCase());
        if (existingEmails.includes(req.body.email.toLowerCase())) {
          customRuleErrors.push('This email address is already registered. Please use a different email.');
        }
      }
    }
  }

  // Custom rule: Check if password is in common passwords list (only if password is provided)
  if (req.body.password) {
    const commonPasswords = ['password', '123456', 'admin', 'qwerty', 'letmein'];
    if (commonPasswords.includes(req.body.password.toLowerCase())) {
      customRuleErrors.push('This password is too common. Please choose a more secure password.');
    }
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

  // Mock successful user update (partial)
  const updatedUser = {
    id: userId,
    email: req.body.email || 'existing@example.com',
    firstName: req.body.firstName || 'Existing',
    lastName: req.body.lastName || 'User',
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    isEmailVerified: req.body.isEmailVerified !== undefined ? req.body.isEmailVerified : false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  };

  res.status(200).json(updatedUser);
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
