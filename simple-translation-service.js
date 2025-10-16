const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3007;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for languages
let languages = [
    {
        id: 1,
        code: 'en',
        name: 'English',
        nativeName: 'English',
        isRTL: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 2,
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        isRTL: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 3,
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        isRTL: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 4,
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        isRTL: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 5,
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        isRTL: true,
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Mock data for translations
let translations = [
    {
        id: 1,
        key: 'welcome.message',
        languageId: 1,
        languageCode: 'en',
        value: 'Welcome to our application!',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 2,
        key: 'welcome.message',
        languageId: 2,
        languageCode: 'es',
        value: '¡Bienvenido a nuestra aplicación!',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 3,
        key: 'welcome.message',
        languageId: 3,
        languageCode: 'fr',
        value: 'Bienvenue dans notre application!',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

let nextLanguageId = 6;
let nextTranslationId = 4;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'translation-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Language endpoints
app.get('/api/v1/languages', (req, res) => {
    console.log('GET /api/v1/languages');
    res.json({
        languages: languages,
        total: languages.length,
        page: 1,
        limit: 100,
        totalPages: 1
    });
});

app.get('/api/v1/languages/active', (req, res) => {
    console.log('GET /api/v1/languages/active');
    const activeLanguages = languages.filter(lang => lang.isActive);
    res.json({
        languages: activeLanguages,
        total: activeLanguages.length,
        page: 1,
        limit: 100,
        totalPages: 1
    });
});

app.get('/api/v1/languages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`GET /api/v1/languages/${id}`);

    const language = languages.find(lang => lang.id === id);
    if (!language) {
        return res.status(404).json({ message: 'Language not found' });
    }

    res.json({ data: language });
});

app.get('/api/v1/languages/code/:code', (req, res) => {
    const code = req.params.code;
    console.log(`GET /api/v1/languages/code/${code}`);

    const language = languages.find(lang => lang.code === code);
    if (!language) {
        return res.status(404).json({ message: 'Language not found' });
    }

    res.json({ data: language });
});

app.post('/api/v1/languages', (req, res) => {
    console.log('POST /api/v1/languages', req.body);

    const { code, name, nativeName, isRTL = false, isActive = true } = req.body;

    if (!code || !name || !nativeName) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if language code already exists
    if (languages.find(lang => lang.code === code)) {
        return res.status(400).json({ message: 'Language code already exists' });
    }

    const newLanguage = {
        id: nextLanguageId++,
        code: code.toLowerCase(),
        name,
        nativeName,
        isRTL,
        isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    languages.push(newLanguage);

    res.status(201).json({ data: newLanguage });
});

app.put('/api/v1/languages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`PUT /api/v1/languages/${id}`, req.body);

    const languageIndex = languages.findIndex(lang => lang.id === id);
    if (languageIndex === -1) {
        return res.status(404).json({ message: 'Language not found' });
    }

    const { code, name, nativeName, isRTL, isActive } = req.body;

    // Check if language code already exists (excluding current language)
    if (code && languages.find(lang => lang.code === code && lang.id !== id)) {
        return res.status(400).json({ message: 'Language code already exists' });
    }

    const updatedLanguage = {
        ...languages[languageIndex],
        ...(code && { code: code.toLowerCase() }),
        ...(name && { name }),
        ...(nativeName && { nativeName }),
        ...(isRTL !== undefined && { isRTL }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date().toISOString()
    };

    languages[languageIndex] = updatedLanguage;

    res.json({ data: updatedLanguage });
});

app.delete('/api/v1/languages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`DELETE /api/v1/languages/${id}`);

    const languageIndex = languages.findIndex(lang => lang.id === id);
    if (languageIndex === -1) {
        return res.status(404).json({ message: 'Language not found' });
    }

    // Don't allow deletion of English (default language)
    if (languages[languageIndex].code === 'en') {
        return res.status(400).json({ message: 'Cannot delete default language' });
    }

    languages.splice(languageIndex, 1);

    res.status(204).send();
});

app.get('/api/v1/languages/count', (req, res) => {
    console.log('GET /api/v1/languages/count');
    res.json({ count: languages.length });
});

// Translation endpoints
app.get('/api/v1/translations', (req, res) => {
    console.log('GET /api/v1/translations', req.query);

    const { page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let filteredTranslations = translations;

    if (search) {
        filteredTranslations = translations.filter(t =>
            t.key.toLowerCase().includes(search.toLowerCase()) ||
            t.value.toLowerCase().includes(search.toLowerCase())
        );
    }

    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedTranslations = filteredTranslations.slice(startIndex, endIndex);

    res.json({
        data: paginatedTranslations,
        total: filteredTranslations.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredTranslations.length / limitNum)
    });
});

app.get('/api/v1/translations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`GET /api/v1/translations/${id}`);

    const translation = translations.find(t => t.id === id);
    if (!translation) {
        return res.status(404).json({ message: 'Translation not found' });
    }

    res.json({ data: translation });
});

app.post('/api/v1/translations', (req, res) => {
    console.log('POST /api/v1/translations', req.body);

    const { key, languageId, value, isActive = true } = req.body;

    if (!key || !languageId || !value) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if language exists
    const language = languages.find(lang => lang.id === languageId);
    if (!language) {
        return res.status(400).json({ message: 'Language not found' });
    }

    // Check if translation already exists for this key and language
    if (translations.find(t => t.key === key && t.languageId === languageId)) {
        return res.status(400).json({ message: 'Translation already exists for this key and language' });
    }

    const newTranslation = {
        id: nextTranslationId++,
        key,
        languageId,
        languageCode: language.code,
        value,
        isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    translations.push(newTranslation);

    res.status(201).json({ data: newTranslation });
});

app.put('/api/v1/translations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`PUT /api/v1/translations/${id}`, req.body);

    const translationIndex = translations.findIndex(t => t.id === id);
    if (translationIndex === -1) {
        return res.status(404).json({ message: 'Translation not found' });
    }

    const { key, languageId, value, isActive } = req.body;

    // Check if language exists (if languageId is being updated)
    if (languageId) {
        const language = languages.find(lang => lang.id === languageId);
        if (!language) {
            return res.status(400).json({ message: 'Language not found' });
        }
    }

    // Check if translation already exists for this key and language (if key or languageId is being updated)
    if (key || languageId) {
        const checkKey = key || translations[translationIndex].key;
        const checkLanguageId = languageId || translations[translationIndex].languageId;

        if (translations.find(t => t.key === checkKey && t.languageId === checkLanguageId && t.id !== id)) {
            return res.status(400).json({ message: 'Translation already exists for this key and language' });
        }
    }

    const updatedTranslation = {
        ...translations[translationIndex],
        ...(key && { key }),
        ...(languageId && { languageId, languageCode: languages.find(lang => lang.id === languageId)?.code }),
        ...(value && { value }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date().toISOString()
    };

    translations[translationIndex] = updatedTranslation;

    res.json({ data: updatedTranslation });
});

app.delete('/api/v1/translations/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`DELETE /api/v1/translations/${id}`);

    const translationIndex = translations.findIndex(t => t.id === id);
    if (translationIndex === -1) {
        return res.status(404).json({ message: 'Translation not found' });
    }

    translations.splice(translationIndex, 1);

    res.status(204).send();
});

app.get('/api/v1/translations/count', (req, res) => {
    console.log('GET /api/v1/translations/count');
    res.json({ count: translations.length });
});

app.get('/api/v1/translations/pending', (req, res) => {
    console.log('GET /api/v1/translations/pending');
    const pendingTranslations = translations.filter(t => !t.isActive);
    res.json({ data: pendingTranslations });
});

app.post('/api/v1/translations/:id/approve', (req, res) => {
    const id = parseInt(req.params.id);
    const { approvedBy } = req.body;
    console.log(`POST /api/v1/translations/${id}/approve`, req.body);

    const translationIndex = translations.findIndex(t => t.id === id);
    if (translationIndex === -1) {
        return res.status(404).json({ message: 'Translation not found' });
    }

    const updatedTranslation = {
        ...translations[translationIndex],
        isActive: true,
        approvedBy,
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    translations[translationIndex] = updatedTranslation;

    res.json({ data: updatedTranslation });
});

// Translation operations
app.post('/api/v1/translation/translate', (req, res) => {
    console.log('POST /api/v1/translation/translate', req.body);

    const { text, targetLanguage, sourceLanguage = 'en' } = req.body;

    if (!text || !targetLanguage) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Mock translation - in real implementation, this would call a translation API
    const mockTranslations = {
        'en': { 'es': 'Hola', 'fr': 'Bonjour', 'de': 'Hallo' },
        'es': { 'en': 'Hello', 'fr': 'Bonjour', 'de': 'Hallo' },
        'fr': { 'en': 'Hello', 'es': 'Hola', 'de': 'Hallo' },
        'de': { 'en': 'Hello', 'es': 'Hola', 'fr': 'Bonjour' }
    };

    const translatedText = mockTranslations[sourceLanguage]?.[targetLanguage] || text;

    res.json({
        data: {
            translatedText,
            fromCache: true,
            sourceLanguage,
            targetLanguage
        }
    });
});

app.post('/api/v1/translation/translate-batch', (req, res) => {
    console.log('POST /api/v1/translation/translate-batch', req.body);

    const { texts, targetLanguage, sourceLanguage = 'en' } = req.body;

    if (!texts || !Array.isArray(texts) || !targetLanguage) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Mock batch translation
    const mockTranslations = {
        'en': { 'es': 'Hola', 'fr': 'Bonjour', 'de': 'Hallo' },
        'es': { 'en': 'Hello', 'fr': 'Bonjour', 'de': 'Hallo' },
        'fr': { 'en': 'Hello', 'es': 'Hola', 'de': 'Hallo' },
        'de': { 'en': 'Hello', 'es': 'Hola', 'fr': 'Bonjour' }
    };

    const translations = texts.map(text => ({
        text,
        translatedText: mockTranslations[sourceLanguage]?.[targetLanguage] || text,
        fromCache: true
    }));

    res.json({
        data: {
            translations,
            sourceLanguage,
            targetLanguage
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Simple Translation Service running on http://localhost:${PORT}`);
    console.log('📋 Available endpoints:');
    console.log('   GET  /health');
    console.log('   GET  /api/v1/languages');
    console.log('   GET  /api/v1/languages/active');
    console.log('   GET  /api/v1/languages/:id');
    console.log('   GET  /api/v1/languages/code/:code');
    console.log('   POST /api/v1/languages');
    console.log('   PUT  /api/v1/languages/:id');
    console.log('   DELETE /api/v1/languages/:id');
    console.log('   GET  /api/v1/translations');
    console.log('   GET  /api/v1/translations/:id');
    console.log('   POST /api/v1/translations');
    console.log('   PUT  /api/v1/translations/:id');
    console.log('   DELETE /api/v1/translations/:id');
    console.log('   POST /api/v1/translation/translate');
    console.log('   POST /api/v1/translation/translate-batch');
    console.log('🌍 Available languages:');
    languages.forEach(lang => {
        console.log(`   ${lang.code} - ${lang.name} (${lang.nativeName})`);
    });
});
