const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3006;

// Mock database for demo purposes
const mockPricingRules = {};
const mockPriceCalculations = {};
let nextRuleId = 1;
let nextCalculationId = 1;

// Generate 20 mock pricing rules
const ruleTypes = ['Weight Based', 'Distance Based', 'Volume Based', 'Time Based', 'Priority Based', 'Service Based', 'Location Based', 'Size Based'];
const conditions = ['Standard', 'Express', 'Overnight', 'Same Day', 'International', 'Domestic', 'Fragile', 'Hazardous'];
const regions = ['North America', 'Europe', 'Asia Pacific', 'South America', 'Africa', 'Middle East', 'Global', 'Domestic', 'International', 'Regional'];

for (let i = 0; i < 20; i++) {
    const ruleType = ruleTypes[Math.floor(Math.random() * ruleTypes.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];

    mockPricingRules[nextRuleId] = {
        id: nextRuleId,
        name: `${ruleType} - ${condition} (${region})`,
        ruleType: ruleType,
        condition: condition,
        region: region,
        isActive: Math.random() > 0.1, // 90% active
        basePrice: Math.floor(Math.random() * 50) + 5, // $5-$55
        pricePerUnit: Math.floor(Math.random() * 10) + 1, // $1-$11
        unit: ['lb', 'kg', 'mile', 'km', 'cubic inch', 'cubic meter', 'hour', 'day'][Math.floor(Math.random() * 8)],
        minPrice: Math.floor(Math.random() * 20) + 5, // $5-$25
        maxPrice: Math.floor(Math.random() * 200) + 50, // $50-$250
        discountPercentage: Math.floor(Math.random() * 30), // 0-30%
        validFrom: new Date(2025, 0, 1).toISOString(),
        validTo: new Date(2025, 11, 31).toISOString(),
        description: `Pricing rule for ${ruleType.toLowerCase()} shipping with ${condition.toLowerCase()} service in ${region.toLowerCase()} region.`,
        priority: Math.floor(Math.random() * 10) + 1, // 1-10
        applicableServices: ['Standard', 'Express', 'Overnight', 'Same Day'].slice(0, Math.floor(Math.random() * 3) + 1)
    };
    nextRuleId++;
}

// Generate 15 mock price calculations
const calculationStatuses = ['Completed', 'Pending', 'Failed', 'Cancelled'];
const serviceTypes = ['Standard', 'Express', 'Overnight', 'Same Day', 'Economy', 'Priority'];

for (let i = 0; i < 15; i++) {
    const status = calculationStatuses[Math.floor(Math.random() * calculationStatuses.length)];
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];

    mockPriceCalculations[nextCalculationId] = {
        id: nextCalculationId,
        customerId: Math.floor(Math.random() * 50) + 1,
        carrierId: Math.floor(Math.random() * 25) + 1,
        serviceType: serviceType,
        weight: Math.floor(Math.random() * 50) + 1, // 1-50 lbs
        distance: Math.floor(Math.random() * 2000) + 10, // 10-2010 miles
        volume: Math.floor(Math.random() * 100) + 1, // 1-100 cubic inches
        origin: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
        destination: ['Miami', 'Seattle', 'Denver', 'Boston', 'Atlanta'][Math.floor(Math.random() * 5)],
        basePrice: Math.floor(Math.random() * 50) + 5,
        calculatedPrice: Math.floor(Math.random() * 200) + 10,
        appliedRules: [1, 2, 3, 4, 5].slice(0, Math.floor(Math.random() * 3) + 1),
        status: status,
        calculatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString()
    };
    nextCalculationId++;
}

// Middleware
app.use(cors());
app.use(express.json());

// Validation rules
const createPricingRuleValidation = [
    body('name').notEmpty().withMessage('Rule name is required').isLength({ min: 2 }).withMessage('Rule name must be at least 2 characters'),
    body('ruleType').notEmpty().withMessage('Rule type is required'),
    body('condition').notEmpty().withMessage('Condition is required'),
    body('region').notEmpty().withMessage('Region is required'),
    body('basePrice').isNumeric().withMessage('Base price must be a number'),
    body('pricePerUnit').isNumeric().withMessage('Price per unit must be a number'),
];

// Get pricing rules endpoint
app.get('/api/v1/pricing-rules', (req, res) => {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Convert mock pricing rules to the expected format
    let rules = Object.values(mockPricingRules).map(rule => ({
        id: rule.id,
        name: rule.name,
        ruleType: rule.ruleType,
        condition: rule.condition,
        region: rule.region,
        isActive: rule.isActive,
        basePrice: rule.basePrice,
        pricePerUnit: rule.pricePerUnit,
        unit: rule.unit,
        minPrice: rule.minPrice,
        maxPrice: rule.maxPrice,
        discountPercentage: rule.discountPercentage,
        validFrom: rule.validFrom,
        validTo: rule.validTo,
        description: rule.description,
        priority: rule.priority,
        applicableServices: rule.applicableServices,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    }));

    // Apply search filter if provided
    if (search) {
        const searchLower = search.toLowerCase();
        rules = rules.filter(rule =>
            rule.name.toLowerCase().includes(searchLower) ||
            rule.ruleType.toLowerCase().includes(searchLower) ||
            rule.condition.toLowerCase().includes(searchLower) ||
            rule.region.toLowerCase().includes(searchLower)
        );
    }

    // Calculate pagination
    const total = rules.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated rules
    const paginatedRules = rules.slice(startIndex, endIndex);

    res.json({
        rules: paginatedRules,
        total: total,
        page: page,
        limit: limit,
        totalPages: totalPages
    });
});

// Get price calculation history endpoint
app.get('/api/v1/price-calculations', (req, res) => {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Convert mock price calculations to the expected format
    let calculations = Object.values(mockPriceCalculations).map(calc => ({
        id: calc.id,
        customerId: calc.customerId,
        carrierId: calc.carrierId,
        serviceType: calc.serviceType,
        weight: calc.weight,
        distance: calc.distance,
        volume: calc.volume,
        origin: calc.origin,
        destination: calc.destination,
        basePrice: calc.basePrice,
        calculatedPrice: calc.calculatedPrice,
        appliedRules: calc.appliedRules,
        status: calc.status,
        calculatedAt: calc.calculatedAt,
        expiresAt: calc.expiresAt,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    }));

    // Apply search filter if provided
    if (search) {
        const searchLower = search.toLowerCase();
        calculations = calculations.filter(calc =>
            calc.serviceType.toLowerCase().includes(searchLower) ||
            calc.origin.toLowerCase().includes(searchLower) ||
            calc.destination.toLowerCase().includes(searchLower) ||
            calc.status.toLowerCase().includes(searchLower)
        );
    }

    // Calculate pagination
    const total = calculations.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated calculations
    const paginatedCalculations = calculations.slice(startIndex, endIndex);

    res.json({
        calculations: paginatedCalculations,
        total: total,
        page: page,
        limit: limit,
        totalPages: totalPages
    });
});

// Calculate price endpoint
app.post('/api/v1/calculate-price', (req, res) => {
    const { customerId, carrierId, serviceType, weight, distance, volume, origin, destination } = req.body;

    // Simple price calculation logic
    const basePrice = 10;
    const weightPrice = (weight || 1) * 2;
    const distancePrice = (distance || 10) * 0.5;
    const volumePrice = (volume || 1) * 0.1;
    const serviceMultiplier = {
        'Standard': 1.0,
        'Express': 1.5,
        'Overnight': 2.0,
        'Same Day': 3.0,
        'Economy': 0.8,
        'Priority': 1.8
    }[serviceType] || 1.0;

    const calculatedPrice = Math.round((basePrice + weightPrice + distancePrice + volumePrice) * serviceMultiplier * 100) / 100;

    // Create a new price calculation record
    const newCalculation = {
        id: nextCalculationId++,
        customerId: customerId || Math.floor(Math.random() * 50) + 1,
        carrierId: carrierId || Math.floor(Math.random() * 25) + 1,
        serviceType: serviceType || 'Standard',
        weight: weight || 1,
        distance: distance || 10,
        volume: volume || 1,
        origin: origin || 'New York',
        destination: destination || 'Los Angeles',
        basePrice: basePrice,
        calculatedPrice: calculatedPrice,
        appliedRules: [1, 2, 3].slice(0, Math.floor(Math.random() * 3) + 1),
        status: 'Completed',
        calculatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    mockPriceCalculations[newCalculation.id] = newCalculation;

    res.json({
        calculationId: newCalculation.id,
        basePrice: basePrice,
        calculatedPrice: calculatedPrice,
        appliedRules: newCalculation.appliedRules,
        breakdown: {
            basePrice: basePrice,
            weightPrice: weightPrice,
            distancePrice: distancePrice,
            volumePrice: volumePrice,
            serviceMultiplier: serviceMultiplier
        },
        expiresAt: newCalculation.expiresAt
    });
});

// Create pricing rule endpoint
app.post('/api/v1/pricing-rules', createPricingRuleValidation, (req, res) => {
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

    // Create new pricing rule
    const newRule = {
        id: nextRuleId++,
        name: req.body.name,
        ruleType: req.body.ruleType,
        condition: req.body.condition,
        region: req.body.region,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        basePrice: parseFloat(req.body.basePrice),
        pricePerUnit: parseFloat(req.body.pricePerUnit),
        unit: req.body.unit || 'lb',
        minPrice: parseFloat(req.body.minPrice) || 0,
        maxPrice: parseFloat(req.body.maxPrice) || 1000,
        discountPercentage: parseFloat(req.body.discountPercentage) || 0,
        validFrom: req.body.validFrom || new Date().toISOString(),
        validTo: req.body.validTo || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        description: req.body.description || '',
        priority: parseInt(req.body.priority) || 1,
        applicableServices: req.body.applicableServices || ['Standard']
    };

    mockPricingRules[newRule.id] = newRule;

    res.status(201).json({
        id: newRule.id,
        name: newRule.name,
        ruleType: newRule.ruleType,
        condition: newRule.condition,
        region: newRule.region,
        isActive: newRule.isActive,
        basePrice: newRule.basePrice,
        pricePerUnit: newRule.pricePerUnit,
        unit: newRule.unit,
        minPrice: newRule.minPrice,
        maxPrice: newRule.maxPrice,
        discountPercentage: newRule.discountPercentage,
        validFrom: newRule.validFrom,
        validTo: newRule.validTo,
        description: newRule.description,
        priority: newRule.priority,
        applicableServices: newRule.applicableServices,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    });
});

// Health check
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'pricing-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(port, () => {
    console.log(`🚀 Simple Pricing Service is running on: http://localhost:${port}/api/v1`);
    console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
});
