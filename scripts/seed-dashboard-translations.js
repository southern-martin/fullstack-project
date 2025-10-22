#!/usr/bin/env node

/**
 * Dashboard Translation Seeder
 * 
 * This script seeds the translation database with Dashboard module translations.
 * It creates/updates translations for French and Spanish languages.
 * 
 * Features:
 * - Health check before seeding
 * - Language resolution (name → code)
 * - Create/update logic
 * - Progress indicators
 * - Error reporting
 * 
 * Usage: node scripts/seed-dashboard-translations.js
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3007/api/v1';
const TRANSLATION_API = `${API_BASE_URL}/translation`;

// Dashboard module translations
const translations = [
  // ========================================
  // Page Titles & Headers (6)
  // ========================================
  { en: 'Dashboard', fr: 'Tableau de Bord', es: 'Panel de Control' },
  { en: 'Welcome back', fr: 'Bienvenue', es: 'Bienvenido de nuevo' },
  { en: 'Manage your application with ease', fr: 'Gérez votre application facilement', es: 'Gestione su aplicación con facilidad' },
  { en: 'Ecommerce Dashboard', fr: 'Tableau de Bord E-commerce', es: 'Panel de Control E-commerce' },
  { en: 'Multi-seller platform analytics and insights', fr: 'Analyses et informations sur la plateforme multi-vendeurs', es: 'Análisis e información de la plataforma multiseller' },
  { en: '🚀 React Admin Dashboard', fr: '🚀 Tableau de Bord React Admin', es: '🚀 Panel de Administración React' },

  // ========================================
  // Dashboard Type Buttons (2)
  // ========================================
  { en: 'Admin Dashboard', fr: 'Tableau de Bord Admin', es: 'Panel de Administración' },
  { en: 'Ecommerce Dashboard', fr: 'Tableau de Bord E-commerce', es: 'Panel de Control E-commerce' },

  // ========================================
  // Navigation Cards (15)
  // ========================================
  { en: 'Users', fr: 'Utilisateurs', es: 'Usuarios' },
  { en: 'Manage user accounts and permissions', fr: 'Gérer les comptes utilisateurs et les permissions', es: 'Gestionar cuentas de usuario y permisos' },
  { en: 'View Users', fr: 'Voir les Utilisateurs', es: 'Ver Usuarios' },
  
  { en: 'Customers', fr: 'Clients', es: 'Clientes' },
  { en: 'Manage customer accounts and information', fr: 'Gérer les comptes clients et les informations', es: 'Gestionar cuentas de clientes e información' },
  { en: 'View Customers', fr: 'Voir les Clients', es: 'Ver Clientes' },
  
  { en: 'Carriers', fr: 'Transporteurs', es: 'Transportistas' },
  { en: 'Manage shipping carriers and logistics', fr: 'Gérer les transporteurs et la logistique', es: 'Gestionar transportistas y logística' },
  { en: 'View Carriers', fr: 'Voir les Transporteurs', es: 'Ver Transportistas' },
  
  { en: 'Analytics', fr: 'Analytique', es: 'Analítica' },
  { en: 'View system analytics and reports', fr: 'Voir les analyses et rapports système', es: 'Ver análisis e informes del sistema' },
  { en: 'View Analytics', fr: 'Voir l\'Analytique', es: 'Ver Analítica' },
  
  { en: 'Settings', fr: 'Paramètres', es: 'Configuración' },
  { en: 'Configure system settings', fr: 'Configurer les paramètres système', es: 'Configurar ajustes del sistema' },
  { en: 'View Settings', fr: 'Voir les Paramètres', es: 'Ver Configuración' },

  // ========================================
  // Stats & Metrics (15)
  // ========================================
  { en: 'Total', fr: 'Total', es: 'Total' },
  { en: 'Total Users', fr: 'Total Utilisateurs', es: 'Total Usuarios' },
  { en: 'Total Customers', fr: 'Total Clients', es: 'Total Clientes' },
  { en: 'Total Carriers', fr: 'Total Transporteurs', es: 'Total Transportistas' },
  { en: 'System Status', fr: 'Statut Système', es: 'Estado del Sistema' },
  { en: 'Uptime', fr: 'Disponibilité', es: 'Tiempo de Actividad' },
  { en: 'vs last month', fr: 'vs mois dernier', es: 'vs mes pasado' },
  { en: 'Reports', fr: 'Rapports', es: 'Informes' },
  { en: 'Config', fr: 'Configuration', es: 'Configuración' },
  { en: 'Total Revenue', fr: 'Revenu Total', es: 'Ingresos Totales' },
  { en: 'Total Orders', fr: 'Total Commandes', es: 'Total Pedidos' },
  { en: 'Active Sellers', fr: 'Vendeurs Actifs', es: 'Vendedores Activos' },
  { en: 'Avg. Delivery Time', fr: 'Temps Moyen de Livraison', es: 'Tiempo Promedio de Entrega' },
  { en: 'Conversion Rate', fr: 'Taux de Conversion', es: 'Tasa de Conversión' },
  { en: 'Avg. Order Value', fr: 'Valeur Moyenne de Commande', es: 'Valor Promedio del Pedido' },

  // ========================================
  // Chart Titles (6)
  // ========================================
  { en: 'Sales Trend', fr: 'Tendance des Ventes', es: 'Tendencia de Ventas' },
  { en: 'Orders Trend', fr: 'Tendance des Commandes', es: 'Tendencia de Pedidos' },
  { en: 'Top Selling Products', fr: 'Produits les Plus Vendus', es: 'Productos Más Vendidos' },
  { en: 'Revenue by Category', fr: 'Revenu par Catégorie', es: 'Ingresos por Categoría' },
  { en: 'Seller Performance', fr: 'Performance des Vendeurs', es: 'Rendimiento de Vendedores' },
  { en: 'Recent Orders', fr: 'Commandes Récentes', es: 'Pedidos Recientes' },

  // ========================================
  // System Status (6)
  // ========================================
  { en: 'System Overview', fr: 'Aperçu du Système', es: 'Resumen del Sistema' },
  { en: 'Recent Users', fr: 'Utilisateurs Récents', es: 'Usuarios Recientes' },
  { en: 'healthy', fr: 'sain', es: 'saludable' },
  { en: 'warning', fr: 'avertissement', es: 'advertencia' },
  { en: 'critical', fr: 'critique', es: 'crítico' },
  { en: 'Last updated', fr: 'Dernière mise à jour', es: 'Última actualización' },

  // ========================================
  // Table Headers (4)
  // ========================================
  { en: 'Name', fr: 'Nom', es: 'Nombre' },
  { en: 'Email', fr: 'Email', es: 'Correo Electrónico' },
  { en: 'Status', fr: 'Statut', es: 'Estado' },
  { en: 'Created', fr: 'Créé', es: 'Creado' },

  // ========================================
  // Status Labels (6)
  // ========================================
  { en: 'Active', fr: 'Actif', es: 'Activo' },
  { en: 'Inactive', fr: 'Inactif', es: 'Inactivo' },
  { en: 'completed', fr: 'complété', es: 'completado' },
  { en: 'shipped', fr: 'expédié', es: 'enviado' },
  { en: 'processing', fr: 'en traitement', es: 'procesando' },
  { en: 'pending', fr: 'en attente', es: 'pendiente' },

  // ========================================
  // Time & Performance (3)
  // ========================================
  { en: 'days', fr: 'jours', es: 'días' },
  { en: 'Revenue', fr: 'Revenu', es: 'Ingresos' },
  { en: 'Orders', fr: 'Commandes', es: 'Pedidos' },

  // ========================================
  // Messages & Notifications (6)
  // ========================================
  { en: 'Loading dashboard statistics...', fr: 'Chargement des statistiques du tableau de bord...', es: 'Cargando estadísticas del panel...' },
  { en: 'Failed to load dashboard statistics', fr: 'Échec du chargement des statistiques du tableau de bord', es: 'Error al cargar las estadísticas del panel' },
  { en: 'Failed to load statistics', fr: 'Échec du chargement des statistiques', es: 'Error al cargar estadísticas' },
  { en: 'No statistics available', fr: 'Aucune statistique disponible', es: 'No hay estadísticas disponibles' },
  { en: 'This might be due to API connectivity issues.', fr: 'Cela pourrait être dû à des problèmes de connectivité API.', es: 'Esto podría deberse a problemas de conectividad de la API.' },
  { en: '✅ React + TypeScript + Modern Architecture is working perfectly!', fr: '✅ React + TypeScript + Architecture Moderne fonctionne parfaitement !', es: '✅ React + TypeScript + Arquitectura Moderna funciona perfectamente!' },

  // ========================================
  // Buttons & Actions (2)
  // ========================================
  { en: 'Retry', fr: 'Réessayer', es: 'Reintentar' },
  { en: 'View', fr: 'Voir', es: 'Ver' },

  // ========================================
  // Ecommerce Specific (15)
  // ========================================
  { en: 'Total Sellers', fr: 'Total Vendeurs', es: 'Total Vendedores' },
  { en: 'Active Sellers', fr: 'Vendeurs Actifs', es: 'Vendedores Activos' },
  { en: 'Sales', fr: 'Ventes', es: 'Ventas' },
  { en: 'Product', fr: 'Produit', es: 'Producto' },
  { en: 'Date', fr: 'Date', es: 'Fecha' },
  { en: 'Electronics', fr: 'Électronique', es: 'Electrónica' },
  { en: 'Clothing', fr: 'Vêtements', es: 'Ropa' },
  { en: 'Home & Garden', fr: 'Maison et Jardin', es: 'Hogar y Jardín' },
  { en: 'Sports', fr: 'Sports', es: 'Deportes' },
  { en: 'Books', fr: 'Livres', es: 'Libros' },
  { en: 'Jan', fr: 'Jan', es: 'Ene' },
  { en: 'Feb', fr: 'Fév', es: 'Feb' },
  { en: 'Mar', fr: 'Mar', es: 'Mar' },
  { en: 'Apr', fr: 'Avr', es: 'Abr' },
  { en: 'May', fr: 'Mai', es: 'May' },
  { en: 'Jun', fr: 'Juin', es: 'Jun' },
];

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Translation Service is not running. Please start it first.');
    }
    throw error;
  }
}

// Check Translation Service health
async function checkHealth() {
  console.log(`${colors.cyan}🔍 Checking Translation Service health...${colors.reset}`);
  try {
    // Just check if we can list languages
    const response = await makeRequest(`${TRANSLATION_API}/languages`);
    if (response.data && Array.isArray(response.data)) {
      console.log(`${colors.green}✅ Translation Service is healthy!${colors.reset}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`${colors.red}❌ Health check failed: ${error.message}${colors.reset}`);
    return false;
  }
}

// Get language code (since API doesn't require ID)
async function getLanguageCode(code) {
  try {
    const response = await makeRequest(`${TRANSLATION_API}/languages`);
    const languages = response.data || [];
    const language = languages.find(lang => lang.code === code);
    if (!language) {
      throw new Error(`Language not found: ${code}`);
    }
    return language.code;
  } catch (error) {
    throw new Error(`Failed to resolve language ${code}: ${error.message}`);
  }
}

// Create or update a translation
async function upsertTranslation(original, destination, languageCode, context) {
  try {
    // First, try to find existing translation
    const searchUrl = `${TRANSLATION_API}/translations?original=${encodeURIComponent(original)}&languageCode=${languageCode}&limit=500`;
    const existing = await makeRequest(searchUrl);
    
    // Filter to find exact match with same context module
    const exactMatch = existing.data?.translations?.find(
      t => t.original === original && 
           t.languageCode === languageCode &&
           t.context?.module === context.module
    );
    
    if (exactMatch) {
      // Update if destination changed
      if (exactMatch.destination !== destination) {
        await makeRequest(`${TRANSLATION_API}/translations/${exactMatch.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination, context }),
        });
        return { created: false, updated: true };
      }
      
      return { created: false, updated: false }; // No change needed
    }
    
    // Create new translation
    await makeRequest(`${TRANSLATION_API}/translations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        original,
        destination,
        languageCode,
        context,
      }),
    });
    
    return { created: true, updated: false };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

// Main seeding function
async function seedDashboardTranslations() {
  console.log(`${colors.bright}${colors.blue}`);
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     Dashboard Translation Database Seeder             ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  // Health check
  const isHealthy = await checkHealth();
  if (!isHealthy) {
    console.error(`${colors.red}❌ Seeding aborted. Translation Service must be running.${colors.reset}`);
    process.exit(1);
  }

  console.log('');

  // Resolve language codes
  console.log(`${colors.cyan}🔍 Resolving language codes...${colors.reset}`);
  const languageCodes = {};
  
  try {
    languageCodes.fr = await getLanguageCode('fr');
    languageCodes.es = await getLanguageCode('es');
    console.log(`${colors.green}✅ Languages resolved: FR (${languageCodes.fr}), ES (${languageCodes.es})${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}❌ ${error.message}${colors.reset}`);
    process.exit(1);
  }

  console.log('');

  // Seed translations
  console.log(`${colors.cyan}📝 Seeding dashboard translations...${colors.reset}`);
  console.log(`${colors.yellow}Total labels: ${translations.length} x 2 languages = ${translations.length * 2} records${colors.reset}`);
  console.log('');

  const stats = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
  };

  const context = {
    module: 'dashboard',
    category: 'ui',
  };

  for (let i = 0; i < translations.length; i++) {
    const { en, fr, es } = translations[i];
    const progress = `[${i + 1}/${translations.length}]`;

    // French translation
    try {
      const result = await upsertTranslation(en, fr, languageCodes.fr, context);
      if (result.created) {
        console.log(`${colors.green}${progress} ✅ Created (FR): "${en}" → "${fr}"${colors.reset}`);
        stats.created++;
      } else if (result.updated) {
        console.log(`${colors.yellow}${progress} 🔄 Updated (FR): "${en}" → "${fr}"${colors.reset}`);
        stats.updated++;
      } else {
        stats.skipped++;
      }
    } catch (error) {
      console.error(`${colors.red}${progress} ❌ Error (FR): "${en}" - ${error.message}${colors.reset}`);
      stats.errors++;
    }

    // Spanish translation
    try {
      const result = await upsertTranslation(en, es, languageCodes.es, context);
      if (result.created) {
        console.log(`${colors.green}${progress} ✅ Created (ES): "${en}" → "${es}"${colors.reset}`);
        stats.created++;
      } else if (result.updated) {
        console.log(`${colors.yellow}${progress} 🔄 Updated (ES): "${en}" → "${es}"${colors.reset}`);
        stats.updated++;
      } else {
        stats.skipped++;
      }
    } catch (error) {
      console.error(`${colors.red}${progress} ❌ Error (ES): "${en}" - ${error.message}${colors.reset}`);
      stats.errors++;
    }
  }

  // Summary
  console.log('');
  console.log(`${colors.bright}${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}📊 Seeding Summary:${colors.reset}`);
  console.log(`${colors.green}   ✅ Created/Updated: ${stats.created + stats.updated}${colors.reset}`);
  console.log(`${colors.yellow}   ⏭️  Skipped (unchanged): ${stats.skipped}${colors.reset}`);
  console.log(`${colors.red}   ❌ Errors: ${stats.errors}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}═══════════════════════════════════════════════════════${colors.reset}`);

  if (stats.errors === 0) {
    console.log(`${colors.green}${colors.bright}✅ Success! Dashboard translations are ready.${colors.reset}`);
    console.log(`${colors.cyan}   Success rate: ${(((stats.created + stats.updated + stats.skipped) / (translations.length * 2)) * 100).toFixed(1)}%${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  Completed with some errors. Check logs above.${colors.reset}`);
  }

  console.log('');
}

// Run the seeder
seedDashboardTranslations().catch((error) => {
  console.error(`${colors.red}${colors.bright}❌ Fatal error:${colors.reset}`, error);
  process.exit(1);
});
