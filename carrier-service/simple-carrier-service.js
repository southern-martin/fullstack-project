const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3005;

// Mock database for demo purposes
const mockCarriers = {};
let nextId = 1;

// Generate 25 mock carriers
const carrierNames = ['FedEx', 'UPS', 'DHL', 'USPS', 'Amazon Logistics', 'OnTrac', 'LaserShip', 'Purolator', 'Canada Post', 'Royal Mail', 'TNT Express', 'Yodel', 'Hermes', 'DPD', 'GLS', 'PostNL', 'La Poste', 'Correos', 'Poste Italiane', 'Deutsche Post', 'Swiss Post', 'Austrian Post', 'PostNord', 'Posti', 'Posten Norge'];
const serviceTypes = ['Standard', 'Express', 'Overnight', 'Same Day', 'Economy', 'Priority', 'Ground', 'Air', 'International', 'Local'];
const regions = ['North America', 'Europe', 'Asia Pacific', 'South America', 'Africa', 'Middle East', 'Global', 'Domestic', 'International', 'Regional'];

for (let i = 0; i < 25; i++) {
    const name = carrierNames[Math.floor(Math.random() * carrierNames.length)];
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];

    mockCarriers[nextId] = {
        id: nextId,
        name: name,
        serviceType: serviceType,
        region: region,
        isActive: Math.random() > 0.1, // 90% active
        contactEmail: `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
        contactPhone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
        trackingUrl: `https://track.${name.toLowerCase().replace(/\s+/g, '')}.com`,
        deliveryTime: `${Math.floor(Math.random() * 7) + 1}-${Math.floor(Math.random() * 14) + 3} days`,
        maxWeight: Math.floor(Math.random() * 50) + 10, // 10-60 lbs
        maxDimensions: `${Math.floor(Math.random() * 20) + 10}x${Math.floor(Math.random() * 20) + 10}x${Math.floor(Math.random() * 20) + 10} inches`,
        insuranceCoverage: Math.floor(Math.random() * 5000) + 100, // $100-$5100
        specialServices: ['Signature Required', 'Fragile Handling', 'Temperature Controlled', 'Hazardous Materials', 'Oversized Items'].slice(0, Math.floor(Math.random() * 3) + 1)
    };
    nextId++;
}

// Middleware
app.use(cors());
app.use(express.json());

// Validation rules
const createCarrierValidation = [
    body('name').notEmpty().withMessage('Carrier name is required').isLength({ min: 2 }).withMessage('Carrier name must be at least 2 characters'),
    body('serviceType').notEmpty().withMessage('Service type is required'),
    body('region').notEmpty().withMessage('Region is required'),
    body('contactEmail').optional().isEmail().withMessage('Please enter a valid email address'),
    body('contactPhone').optional().isLength({ min: 10 }).withMessage('Phone must be at least 10 characters'),
];

// Get carriers endpoint
app.get('/api/v1/carriers', (req, res) => {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Convert mock carriers to the expected format
    let carriers = Object.values(mockCarriers).map(carrier => ({
        id: carrier.id,
        name: carrier.name,
        serviceType: carrier.serviceType,
        region: carrier.region,
        isActive: carrier.isActive,
        contactEmail: carrier.contactEmail,
        contactPhone: carrier.contactPhone,
        website: carrier.website,
        trackingUrl: carrier.trackingUrl,
        deliveryTime: carrier.deliveryTime,
        maxWeight: carrier.maxWeight,
        maxDimensions: carrier.maxDimensions,
        insuranceCoverage: carrier.insuranceCoverage,
        specialServices: carrier.specialServices,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    }));

    // Apply search filter if provided
    if (search) {
        const searchLower = search.toLowerCase();
        carriers = carriers.filter(carrier =>
            carrier.name.toLowerCase().includes(searchLower) ||
            carrier.serviceType.toLowerCase().includes(searchLower) ||
            carrier.region.toLowerCase().includes(searchLower) ||
            carrier.contactEmail.toLowerCase().includes(searchLower)
        );
    }

    // Calculate pagination
    const total = carriers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated carriers
    const paginatedCarriers = carriers.slice(startIndex, endIndex);

    res.json({
        carriers: paginatedCarriers,
        total: total,
        page: page,
        limit: limit,
        totalPages: totalPages
    });
});

// Get carrier by ID endpoint
app.get('/api/v1/carriers/:id', (req, res) => {
    const carrierId = parseInt(req.params.id);
    const carrier = mockCarriers[carrierId];

    if (!carrier) {
        return res.status(404).json({
            message: 'Carrier not found',
            statusCode: 404,
            error: 'Not Found'
        });
    }

    res.json({
        id: carrier.id,
        name: carrier.name,
        serviceType: carrier.serviceType,
        region: carrier.region,
        isActive: carrier.isActive,
        contactEmail: carrier.contactEmail,
        contactPhone: carrier.contactPhone,
        website: carrier.website,
        trackingUrl: carrier.trackingUrl,
        deliveryTime: carrier.deliveryTime,
        maxWeight: carrier.maxWeight,
        maxDimensions: carrier.maxDimensions,
        insuranceCoverage: carrier.insuranceCoverage,
        specialServices: carrier.specialServices,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    });
});

// Create carrier endpoint
app.post('/api/v1/carriers', createCarrierValidation, (req, res) => {
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

    // Check if carrier name already exists
    const existingNames = Object.values(mockCarriers).map(carrier => carrier.name.toLowerCase());
    if (existingNames.includes(req.body.name.toLowerCase())) {
        return res.status(400).json({
            message: 'Validation failed',
            fieldErrors: {
                name: ['A carrier with this name already exists. Please use a different name.']
            },
            statusCode: 400,
            error: 'Validation Error'
        });
    }

    // Create new carrier
    const newCarrier = {
        id: nextId++,
        name: req.body.name,
        serviceType: req.body.serviceType,
        region: req.body.region,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        contactEmail: req.body.contactEmail || '',
        contactPhone: req.body.contactPhone || '',
        website: req.body.website || '',
        trackingUrl: req.body.trackingUrl || '',
        deliveryTime: req.body.deliveryTime || '3-5 days',
        maxWeight: req.body.maxWeight || 50,
        maxDimensions: req.body.maxDimensions || '20x20x20 inches',
        insuranceCoverage: req.body.insuranceCoverage || 100,
        specialServices: req.body.specialServices || []
    };

    mockCarriers[newCarrier.id] = newCarrier;

    res.status(201).json({
        id: newCarrier.id,
        name: newCarrier.name,
        serviceType: newCarrier.serviceType,
        region: newCarrier.region,
        isActive: newCarrier.isActive,
        contactEmail: newCarrier.contactEmail,
        contactPhone: newCarrier.contactPhone,
        website: newCarrier.website,
        trackingUrl: newCarrier.trackingUrl,
        deliveryTime: newCarrier.deliveryTime,
        maxWeight: newCarrier.maxWeight,
        maxDimensions: newCarrier.maxDimensions,
        insuranceCoverage: newCarrier.insuranceCoverage,
        specialServices: newCarrier.specialServices,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    });
});

// Update carrier endpoint
app.patch('/api/v1/carriers/:id', (req, res) => {
    const carrierId = parseInt(req.params.id);
    const carrier = mockCarriers[carrierId];

    if (!carrier) {
        return res.status(404).json({
            message: 'Carrier not found',
            statusCode: 404,
            error: 'Not Found'
        });
    }

    const fieldErrors = {};

    // Basic field validation for provided fields
    if (req.body.name !== undefined) {
        if (!req.body.name || req.body.name.trim() === '') {
            fieldErrors.name = ['Carrier name is required'];
        } else if (req.body.name.trim().length < 2) {
            fieldErrors.name = ['Carrier name must be at least 2 characters'];
        } else if (req.body.name.length > 100) {
            fieldErrors.name = ['Carrier name must not exceed 100 characters'];
        } else {
            // Check if name already exists (excluding current carrier)
            const existingNames = Object.values(mockCarriers)
                .filter(c => c.id !== carrierId)
                .map(c => c.name.toLowerCase());
            if (existingNames.includes(req.body.name.toLowerCase())) {
                fieldErrors.name = ['A carrier with this name already exists. Please use a different name.'];
            }
        }
    }

    if (req.body.serviceType !== undefined) {
        if (!req.body.serviceType || req.body.serviceType.trim() === '') {
            fieldErrors.serviceType = ['Service type is required'];
        }
    }

    if (req.body.region !== undefined) {
        if (!req.body.region || req.body.region.trim() === '') {
            fieldErrors.region = ['Region is required'];
        }
    }

    if (req.body.contactEmail !== undefined && req.body.contactEmail) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.contactEmail)) {
            fieldErrors.contactEmail = ['Please enter a valid email address'];
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

    // Update carrier
    Object.assign(carrier, req.body);

    res.json({
        id: carrier.id,
        name: carrier.name,
        serviceType: carrier.serviceType,
        region: carrier.region,
        isActive: carrier.isActive,
        contactEmail: carrier.contactEmail,
        contactPhone: carrier.contactPhone,
        website: carrier.website,
        trackingUrl: carrier.trackingUrl,
        deliveryTime: carrier.deliveryTime,
        maxWeight: carrier.maxWeight,
        maxDimensions: carrier.maxDimensions,
        insuranceCoverage: carrier.insuranceCoverage,
        specialServices: carrier.specialServices,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString()
    });
});

// Delete carrier endpoint
app.delete('/api/v1/carriers/:id', (req, res) => {
    const carrierId = parseInt(req.params.id);

    if (!mockCarriers[carrierId]) {
        return res.status(404).json({
            message: 'Carrier not found',
            statusCode: 404,
            error: 'Not Found'
        });
    }

    delete mockCarriers[carrierId];

    res.status(204).send();
});

// Health check
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'carrier-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(port, () => {
    console.log(`🚀 Simple Carrier Service is running on: http://localhost:${port}/api/v1`);
    console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
});
