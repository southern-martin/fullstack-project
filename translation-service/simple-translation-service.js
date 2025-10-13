const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3007;

// Mock database for demo purposes
const mockLanguages = {};
const mockTranslations = {};
let nextLanguageId = 1;
let nextTranslationId = 1;

// Generate 10 mock languages
const languages = [
    { code: 'en', name: 'English', nativeName: 'English', isRTL: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false },
    { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false },
    { code: 'de', name: 'German', nativeName: 'Deutsch', isRTL: false },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', isRTL: false },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', isRTL: false },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', isRTL: false },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', isRTL: false },
    { code: 'ko', name: 'Korean', nativeName: '한국어', isRTL: false },
    { code: 'zh', name: 'Chinese', nativeName: '中文', isRTL: false }
];

languages.forEach(lang => {
    mockLanguages[nextLanguageId] = {
        id: nextLanguageId,
        code: lang.code,
        name: lang.name,
        nativeName: lang.nativeName,
        isRTL: lang.isRTL,
        isActive: true
    };
    nextLanguageId++;
});

// Generate 50 mock translations
const translationKeys = [
    'welcome.message',
    'login.title',
    'login.email',
    'login.password',
    'login.button',
    'register.title',
    'register.firstName',
    'register.lastName',
    'register.email',
    'register.password',
    'register.confirmPassword',
    'register.button',
    'dashboard.title',
    'dashboard.welcome',
    'users.title',
    'users.create',
    'users.edit',
    'users.delete',
    'users.search',
    'users.filter',
    'customers.title',
    'customers.create',
    'customers.edit',
    'customers.delete',
    'carriers.title',
    'carriers.create',
    'carriers.edit',
    'carriers.delete',
    'pricing.title',
    'pricing.rules',
    'pricing.calculate',
    'settings.title',
    'settings.language',
    'settings.theme',
    'settings.notifications',
    'common.save',
    'common.cancel',
    'common.delete',
    'common.edit',
    'common.create',
    'common.search',
    'common.filter',
    'common.export',
    'common.import',
    'common.refresh',
    'common.loading',
    'common.error',
    'common.success',
    'common.confirm',
    'common.back'
];

const translations = {
    en: {
        'welcome.message': 'Welcome to our platform',
        'login.title': 'Sign In',
        'login.email': 'Email Address',
        'login.password': 'Password',
        'login.button': 'Sign In',
        'register.title': 'Create Account',
        'register.firstName': 'First Name',
        'register.lastName': 'Last Name',
        'register.email': 'Email Address',
        'register.password': 'Password',
        'register.confirmPassword': 'Confirm Password',
        'register.button': 'Create Account',
        'dashboard.title': 'Dashboard',
        'dashboard.welcome': 'Welcome to your dashboard',
        'users.title': 'Users',
        'users.create': 'Create User',
        'users.edit': 'Edit User',
        'users.delete': 'Delete User',
        'users.search': 'Search users...',
        'users.filter': 'Filter',
        'customers.title': 'Customers',
        'customers.create': 'Create Customer',
        'customers.edit': 'Edit Customer',
        'customers.delete': 'Delete Customer',
        'carriers.title': 'Carriers',
        'carriers.create': 'Create Carrier',
        'carriers.edit': 'Edit Carrier',
        'carriers.delete': 'Delete Carrier',
        'pricing.title': 'Pricing',
        'pricing.rules': 'Pricing Rules',
        'pricing.calculate': 'Calculate Price',
        'settings.title': 'Settings',
        'settings.language': 'Language',
        'settings.theme': 'Theme',
        'settings.notifications': 'Notifications',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.create': 'Create',
        'common.search': 'Search',
        'common.filter': 'Filter',
        'common.export': 'Export',
        'common.import': 'Import',
        'common.refresh': 'Refresh',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.confirm': 'Confirm',
        'common.back': 'Back'
    },
    es: {
        'welcome.message': 'Bienvenido a nuestra plataforma',
        'login.title': 'Iniciar Sesión',
        'login.email': 'Dirección de Correo',
        'login.password': 'Contraseña',
        'login.button': 'Iniciar Sesión',
        'register.title': 'Crear Cuenta',
        'register.firstName': 'Nombre',
        'register.lastName': 'Apellido',
        'register.email': 'Dirección de Correo',
        'register.password': 'Contraseña',
        'register.confirmPassword': 'Confirmar Contraseña',
        'register.button': 'Crear Cuenta',
        'dashboard.title': 'Panel de Control',
        'dashboard.welcome': 'Bienvenido a tu panel de control',
        'users.title': 'Usuarios',
        'users.create': 'Crear Usuario',
        'users.edit': 'Editar Usuario',
        'users.delete': 'Eliminar Usuario',
        'users.search': 'Buscar usuarios...',
        'users.filter': 'Filtrar',
        'customers.title': 'Clientes',
        'customers.create': 'Crear Cliente',
        'customers.edit': 'Editar Cliente',
        'customers.delete': 'Eliminar Cliente',
        'carriers.title': 'Transportistas',
        'carriers.create': 'Crear Transportista',
        'carriers.edit': 'Editar Transportista',
        'carriers.delete': 'Eliminar Transportista',
        'pricing.title': 'Precios',
        'pricing.rules': 'Reglas de Precios',
        'pricing.calculate': 'Calcular Precio',
        'settings.title': 'Configuración',
        'settings.language': 'Idioma',
        'settings.theme': 'Tema',
        'settings.notifications': 'Notificaciones',
        'common.save': 'Guardar',
        'common.cancel': 'Cancelar',
        'common.delete': 'Eliminar',
        'common.edit': 'Editar',
        'common.create': 'Crear',
        'common.search': 'Buscar',
        'common.filter': 'Filtrar',
        'common.export': 'Exportar',
        'common.import': 'Importar',
        'common.refresh': 'Actualizar',
        'common.loading': 'Cargando...',
        'common.error': 'Error',
        'common.success': 'Éxito',
        'common.confirm': 'Confirmar',
        'common.back': 'Atrás'
    },
    fr: {
        'welcome.message': 'Bienvenue sur notre plateforme',
        'login.title': 'Se Connecter',
        'login.email': 'Adresse Email',
        'login.password': 'Mot de Passe',
        'login.button': 'Se Connecter',
        'register.title': 'Créer un Compte',
        'register.firstName': 'Prénom',
        'register.lastName': 'Nom de Famille',
        'register.email': 'Adresse Email',
        'register.password': 'Mot de Passe',
        'register.confirmPassword': 'Confirmer le Mot de Passe',
        'register.button': 'Créer un Compte',
        'dashboard.title': 'Tableau de Bord',
        'dashboard.welcome': 'Bienvenue sur votre tableau de bord',
        'users.title': 'Utilisateurs',
        'users.create': 'Créer un Utilisateur',
        'users.edit': 'Modifier l\'Utilisateur',
        'users.delete': 'Supprimer l\'Utilisateur',
        'users.search': 'Rechercher des utilisateurs...',
        'users.filter': 'Filtrer',
        'customers.title': 'Clients',
        'customers.create': 'Créer un Client',
        'customers.edit': 'Modifier le Client',
        'customers.delete': 'Supprimer le Client',
        'carriers.title': 'Transporteurs',
        'carriers.create': 'Créer un Transporteur',
        'carriers.edit': 'Modifier le Transporteur',
        'carriers.delete': 'Supprimer le Transporteur',
        'pricing.title': 'Tarification',
        'pricing.rules': 'Règles de Tarification',
        'pricing.calculate': 'Calculer le Prix',
        'settings.title': 'Paramètres',
        'settings.language': 'Langue',
        'settings.theme': 'Thème',
        'settings.notifications': 'Notifications',
        'common.save': 'Enregistrer',
        'common.cancel': 'Annuler',
        'common.delete': 'Supprimer',
        'common.edit': 'Modifier',
        'common.create': 'Créer',
        'common.search': 'Rechercher',
        'common.filter': 'Filtrer',
        'common.export': 'Exporter',
        'common.import': 'Importer',
        'common.refresh': 'Actualiser',
        'common.loading': 'Chargement...',
        'common.error': 'Erreur',
        'common.success': 'Succès',
        'common.confirm': 'Confirmer',
        'common.back': 'Retour'
    }
};

// Generate translations for each language
translationKeys.forEach(key => {
    Object.keys(translations).forEach(langCode => {
        const language = Object.values(mockLanguages).find(l => l.code === langCode);
        if (language && translations[langCode][key]) {
            mockTranslations[nextTranslationId] = {
                id: nextTranslationId,
                key: key,
                languageId: language.id,
                languageCode: langCode,
                value: translations[langCode][key],
                isActive: true
            };
            nextTranslationId++;
        }
    });
});

// Middleware
app.use(cors());
app.use(express.json());

// Validation rules
const createLanguageValidation = [
    body('code').notEmpty().withMessage('Language code is required').isLength({ min: 2, max: 5 }).withMessage('Language code must be 2-5 characters'),
    body('name').notEmpty().withMessage('Language name is required').isLength({ min: 2 }).withMessage('Language name must be at least 2 characters'),
    body('nativeName').notEmpty().withMessage('Native name is required'),
];

const createTranslationValidation = [
    body('key').notEmpty().withMessage('Translation key is required'),
    body('languageId').isInt().withMessage('Language ID must be a number'),
    body('value').notEmpty().withMessage('Translation value is required'),
];

// Get languages endpoint
app.get('/api/v1/languages', (req, res) => {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Convert mock languages to the expected format
    let languages = Object.values(mockLanguages).map(language => ({
        id: language.id,
        code: language.code,
        name: language.name,
        nativeName: language.nativeName,
        isRTL: language.isRTL,
        isActive: language.isActive,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    }));

    // Apply search filter if provided
    if (search) {
        const searchLower = search.toLowerCase();
        languages = languages.filter(language =>
            language.name.toLowerCase().includes(searchLower) ||
            language.nativeName.toLowerCase().includes(searchLower) ||
            language.code.toLowerCase().includes(searchLower)
        );
    }

    // Calculate pagination
    const total = languages.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated languages
    const paginatedLanguages = languages.slice(startIndex, endIndex);

    res.json({
        languages: paginatedLanguages,
        total: total,
        page: page,
        limit: limit,
        totalPages: totalPages
    });
});

// Get translations endpoint
app.get('/api/v1/translations', (req, res) => {
    // Parse pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const languageCode = req.query.languageCode || '';

    // Convert mock translations to the expected format
    let translations = Object.values(mockTranslations).map(translation => ({
        id: translation.id,
        key: translation.key,
        languageId: translation.languageId,
        languageCode: translation.languageCode,
        value: translation.value,
        isActive: translation.isActive,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    }));

    // Apply filters if provided
    if (search) {
        const searchLower = search.toLowerCase();
        translations = translations.filter(translation =>
            translation.key.toLowerCase().includes(searchLower) ||
            translation.value.toLowerCase().includes(searchLower)
        );
    }

    if (languageCode) {
        translations = translations.filter(translation =>
            translation.languageCode === languageCode
        );
    }

    // Calculate pagination
    const total = translations.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Get paginated translations
    const paginatedTranslations = translations.slice(startIndex, endIndex);

    res.json({
        translations: paginatedTranslations,
        total: total,
        page: page,
        limit: limit,
        totalPages: totalPages
    });
});

// Get translations by language code
app.get('/api/v1/translations/:languageCode', (req, res) => {
    const languageCode = req.params.languageCode;

    const translations = Object.values(mockTranslations)
        .filter(translation => translation.languageCode === languageCode)
        .reduce((acc, translation) => {
            acc[translation.key] = translation.value;
            return acc;
        }, {});

    res.json(translations);
});

// Create language endpoint
app.post('/api/v1/languages', createLanguageValidation, (req, res) => {
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

    // Check if language code already exists
    const existingCodes = Object.values(mockLanguages).map(language => language.code.toLowerCase());
    if (existingCodes.includes(req.body.code.toLowerCase())) {
        return res.status(400).json({
            message: 'Validation failed',
            fieldErrors: {
                code: ['A language with this code already exists. Please use a different code.']
            },
            statusCode: 400,
            error: 'Validation Error'
        });
    }

    // Create new language
    const newLanguage = {
        id: nextLanguageId++,
        code: req.body.code,
        name: req.body.name,
        nativeName: req.body.nativeName,
        isRTL: req.body.isRTL || false,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    mockLanguages[newLanguage.id] = newLanguage;

    res.status(201).json({
        id: newLanguage.id,
        code: newLanguage.code,
        name: newLanguage.name,
        nativeName: newLanguage.nativeName,
        isRTL: newLanguage.isRTL,
        isActive: newLanguage.isActive,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    });
});

// Create translation endpoint
app.post('/api/v1/translations', createTranslationValidation, (req, res) => {
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

    // Check if language exists
    const language = mockLanguages[req.body.languageId];
    if (!language) {
        return res.status(400).json({
            message: 'Validation failed',
            fieldErrors: {
                languageId: ['Language not found']
            },
            statusCode: 400,
            error: 'Validation Error'
        });
    }

    // Check if translation key already exists for this language
    const existingTranslation = Object.values(mockTranslations).find(t =>
        t.key === req.body.key && t.languageId === req.body.languageId
    );
    if (existingTranslation) {
        return res.status(400).json({
            message: 'Validation failed',
            fieldErrors: {
                key: ['A translation for this key already exists in this language']
            },
            statusCode: 400,
            error: 'Validation Error'
        });
    }

    // Create new translation
    const newTranslation = {
        id: nextTranslationId++,
        key: req.body.key,
        languageId: req.body.languageId,
        languageCode: language.code,
        value: req.body.value,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    mockTranslations[newTranslation.id] = newTranslation;

    res.status(201).json({
        id: newTranslation.id,
        key: newTranslation.key,
        languageId: newTranslation.languageId,
        languageCode: newTranslation.languageCode,
        value: newTranslation.value,
        isActive: newTranslation.isActive,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    });
});

// Health check
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'translation-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(port, () => {
    console.log(`🚀 Simple Translation Service is running on: http://localhost:${port}/api/v1`);
    console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
});
