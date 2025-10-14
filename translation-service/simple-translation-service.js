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
        isActive: true,
        isDefault: lang.code === 'en',
        metadata: {
            flag: `flag-${lang.code}`,
            direction: lang.isRTL ? 'rtl' : 'ltr',
            region: lang.code.toUpperCase(),
            currency: lang.code === 'en' ? 'USD' : 'EUR',
            dateFormat: 'MM/DD/YYYY'
        },
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
    };
    nextLanguageId++;
});

// Generate 50 mock translations with proper structure
const translationKeys = [
    { key: 'welcome.message', originalText: 'Welcome to our platform', context: { category: 'general', module: 'welcome' } },
    { key: 'login.title', originalText: 'Sign In', context: { category: 'auth', module: 'login' } },
    { key: 'login.email', originalText: 'Email Address', context: { category: 'auth', module: 'login', field: 'email' } },
    { key: 'login.password', originalText: 'Password', context: { category: 'auth', module: 'login', field: 'password' } },
    { key: 'login.button', originalText: 'Sign In', context: { category: 'auth', module: 'login', component: 'button' } },
    { key: 'register.title', originalText: 'Create Account', context: { category: 'auth', module: 'register' } },
    { key: 'register.firstName', originalText: 'First Name', context: { category: 'auth', module: 'register', field: 'firstName' } },
    { key: 'register.lastName', originalText: 'Last Name', context: { category: 'auth', module: 'register', field: 'lastName' } },
    { key: 'register.email', originalText: 'Email Address', context: { category: 'auth', module: 'register', field: 'email' } },
    { key: 'register.password', originalText: 'Password', context: { category: 'auth', module: 'register', field: 'password' } },
    { key: 'register.confirmPassword', originalText: 'Confirm Password', context: { category: 'auth', module: 'register', field: 'confirmPassword' } },
    { key: 'register.button', originalText: 'Create Account', context: { category: 'auth', module: 'register', component: 'button' } },
    { key: 'dashboard.title', originalText: 'Dashboard', context: { category: 'navigation', module: 'dashboard' } },
    { key: 'dashboard.welcome', originalText: 'Welcome to your dashboard', context: { category: 'general', module: 'dashboard' } },
    { key: 'users.title', originalText: 'Users', context: { category: 'navigation', module: 'users' } },
    { key: 'users.create', originalText: 'Create User', context: { category: 'users', module: 'users', component: 'button' } },
    { key: 'users.edit', originalText: 'Edit User', context: { category: 'users', module: 'users', component: 'button' } },
    { key: 'users.delete', originalText: 'Delete User', context: { category: 'users', module: 'users', component: 'button' } },
    { key: 'users.search', originalText: 'Search Users', context: { category: 'users', module: 'users', field: 'search' } },
    { key: 'users.filter', originalText: 'Filter Users', context: { category: 'users', module: 'users', component: 'filter' } },
    { key: 'customers.title', originalText: 'Customers', context: { category: 'navigation', module: 'customers' } },
    { key: 'customers.create', originalText: 'Create Customer', context: { category: 'customers', module: 'customers', component: 'button' } },
    { key: 'customers.edit', originalText: 'Edit Customer', context: { category: 'customers', module: 'customers', component: 'button' } },
    { key: 'customers.delete', originalText: 'Delete Customer', context: { category: 'customers', module: 'customers', component: 'button' } },
    { key: 'carriers.title', originalText: 'Carriers', context: { category: 'navigation', module: 'carriers' } },
    { key: 'carriers.create', originalText: 'Create Carrier', context: { category: 'carriers', module: 'carriers', component: 'button' } },
    { key: 'carriers.edit', originalText: 'Edit Carrier', context: { category: 'carriers', module: 'carriers', component: 'button' } },
    { key: 'carriers.delete', originalText: 'Delete Carrier', context: { category: 'carriers', module: 'carriers', component: 'button' } },
    { key: 'pricing.title', originalText: 'Pricing', context: { category: 'navigation', module: 'pricing' } },
    { key: 'pricing.rules', originalText: 'Pricing Rules', context: { category: 'pricing', module: 'pricing' } },
    { key: 'pricing.calculate', originalText: 'Calculate Price', context: { category: 'pricing', module: 'pricing', component: 'button' } },
    { key: 'settings.title', originalText: 'Settings', context: { category: 'navigation', module: 'settings' } },
    { key: 'settings.language', originalText: 'Language', context: { category: 'settings', module: 'settings', field: 'language' } },
    { key: 'settings.theme', originalText: 'Theme', context: { category: 'settings', module: 'settings', field: 'theme' } },
    { key: 'settings.notifications', originalText: 'Notifications', context: { category: 'settings', module: 'settings', field: 'notifications' } },
    { key: 'common.save', originalText: 'Save', context: { category: 'common', component: 'button' } },
    { key: 'common.cancel', originalText: 'Cancel', context: { category: 'common', component: 'button' } },
    { key: 'common.delete', originalText: 'Delete', context: { category: 'common', component: 'button' } },
    { key: 'common.edit', originalText: 'Edit', context: { category: 'common', component: 'button' } },
    { key: 'common.create', originalText: 'Create', context: { category: 'common', component: 'button' } },
    { key: 'common.search', originalText: 'Search', context: { category: 'common', field: 'search' } },
    { key: 'common.filter', originalText: 'Filter', context: { category: 'common', component: 'filter' } },
    { key: 'common.export', originalText: 'Export', context: { category: 'common', component: 'button' } },
    { key: 'common.import', originalText: 'Import', context: { category: 'common', component: 'button' } },
    { key: 'common.refresh', originalText: 'Refresh', context: { category: 'common', component: 'button' } },
    { key: 'common.loading', originalText: 'Loading...', context: { category: 'common', component: 'status' } },
    { key: 'common.error', originalText: 'Error', context: { category: 'common', component: 'status' } },
    { key: 'common.success', originalText: 'Success', context: { category: 'common', component: 'status' } },
    { key: 'common.confirm', originalText: 'Confirm', context: { category: 'common', component: 'button' } },
    { key: 'common.back', originalText: 'Back', context: { category: 'common', component: 'button' } }
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
translationKeys.forEach(translationKey => {
    Object.keys(translations).forEach(langCode => {
        const language = Object.values(mockLanguages).find(l => l.code === langCode);
        if (language && translations[langCode] && translations[langCode][translationKey.key]) {
            mockTranslations[nextTranslationId] = {
                id: nextTranslationId,
                key: translationKey.key,
                originalText: translationKey.originalText,
                translatedText: translations[langCode][translationKey.key],
                languageId: language.id,
                language: {
                    id: language.id,
                    code: language.code,
                    name: language.name,
                    nativeName: language.nativeName,
                    isActive: language.isActive,
                    isDefault: language.code === 'en',
                    metadata: {
                        flag: `flag-${language.code}`,
                        direction: language.isRTL ? 'rtl' : 'ltr',
                        region: language.code.toUpperCase(),
                        currency: language.code === 'en' ? 'USD' : 'EUR',
                        dateFormat: 'MM/DD/YYYY'
                    }
                },
                context: translationKey.context,
                isApproved: true,
                approvedBy: 'system',
                approvedAt: '2025-01-01T00:00:00.000Z',
                usageCount: Math.floor(Math.random() * 100),
                lastUsedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: '2025-01-01T00:00:00.000Z',
                updatedAt: '2025-01-01T00:00:00.000Z'
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
app.get('/api/v1/translation/languages', (req, res) => {
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

// Get active languages endpoint
app.get('/api/v1/translation/languages/active', (req, res) => {
    const activeLanguages = Object.values(mockLanguages)
        .filter(language => language.isActive)
        .map(language => ({
            id: language.id,
            code: language.code,
            name: language.name,
            nativeName: language.nativeName,
            isRTL: language.isRTL,
            isActive: language.isActive
        }));

    res.json({
        success: true,
        data: activeLanguages,
        total: activeLanguages.length
    });
});

// Get translations endpoint
app.get('/api/v1/translation/translations', (req, res) => {
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
        value: translation.value || translation.translatedText || 'No translation',
        isActive: translation.isActive !== undefined ? translation.isActive : true,
        createdAt: translation.createdAt || '2025-01-01T00:00:00.000Z',
        updatedAt: translation.updatedAt || '2025-01-01T00:00:00.000Z'
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

// Get language by ID
app.get('/api/v1/translation/languages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const language = mockLanguages[id];

    if (!language) {
        return res.status(404).json({
            success: false,
            message: 'Language not found'
        });
    }

    res.json({
        success: true,
        data: language
    });
});

// Get language by code
app.get('/api/v1/translation/languages/code/:code', (req, res) => {
    const code = req.params.code;
    const language = Object.values(mockLanguages).find(lang => lang.code === code);

    if (!language) {
        return res.status(404).json({
            success: false,
            message: 'Language not found'
        });
    }

    res.json({
        success: true,
        data: language
    });
});

// Get language count
app.get('/api/v1/translation/languages/count', (req, res) => {
    const total = Object.keys(mockLanguages).length;
    const active = Object.values(mockLanguages).filter(lang => lang.isActive).length;

    res.json({
        success: true,
        data: {
            total: total,
            active: active,
            inactive: total - active
        }
    });
});

// Get translations by language code
app.get('/api/v1/translation/translations/:languageCode', (req, res) => {
    const languageCode = req.params.languageCode;

    const translations = Object.values(mockTranslations)
        .filter(translation => translation.languageCode === languageCode)
        .reduce((acc, translation) => {
            acc[translation.key] = translation.value;
            return acc;
        }, {});

    res.json(translations);
});

// Get translation by ID
app.get('/api/v1/translation/translations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const translation = mockTranslations[id];

    if (!translation) {
        return res.status(404).json({
            success: false,
            message: 'Translation not found'
        });
    }

    res.json({
        success: true,
        data: translation
    });
});

// Get translation count
app.get('/api/v1/translation/translations/count', (req, res) => {
    const total = Object.keys(mockTranslations).length;
    const active = Object.values(mockTranslations).filter(trans => trans.isActive).length;

    res.json({
        success: true,
        data: {
            total: total,
            active: active,
            inactive: total - active
        }
    });
});

// Get pending translations
app.get('/api/v1/translation/translations/pending', (req, res) => {
    const pendingTranslations = Object.values(mockTranslations)
        .filter(translation => !translation.isActive)
        .slice(0, 10); // Limit to 10 for demo

    res.json({
        success: true,
        data: pendingTranslations,
        total: pendingTranslations.length
    });
});

// Create language endpoint
app.post('/api/v1/translation/languages', createLanguageValidation, (req, res) => {
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
app.post('/api/v1/translation/translations', createTranslationValidation, (req, res) => {
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
