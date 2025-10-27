#!/usr/bin/env ts-node

/**
 * Dashboard Module Translation Seeding Script
 * 
 * This script seeds French and Spanish translations for all Dashboard module labels.
 * Run this to populate the translation database with dashboard-related text.
 * 
 * Usage:
 *   ts-node seed-dashboard-translations.ts
 * 
 * Or via npm:
 *   npm run seed:dashboard-translations
 */

import axios from 'axios';

const TRANSLATION_API_BASE_URL = 'http://localhost:3007/api/v1/translation';

interface TranslationPair {
  sourceText: string;
  french: string;
  spanish: string;
}

interface CreateTranslationRequest {
  original: string;
  destination: string;
  languageCode: string;
  context?: {
    category?: string;
    module?: string;
  };
}

/**
 * Dashboard Module Translations
 * Organized by category matching dashboard-labels.ts structure
 */
const dashboardTranslations: TranslationPair[] = [
  // Page Headers
  { sourceText: 'Dashboard', french: 'Tableau de bord', spanish: 'Panel de control' },
  { sourceText: 'Welcome back', french: 'Bon retour', spanish: 'Bienvenido de nuevo' },
  { sourceText: 'Manage your application with ease', french: 'Gérez votre application facilement', spanish: 'Administre su aplicación con facilidad' },
  { sourceText: 'Ecommerce Dashboard', french: 'Tableau de bord E-commerce', spanish: 'Panel de comercio electrónico' },
  { sourceText: 'Multi-seller platform analytics and insights', french: 'Analyses et informations de la plateforme multi-vendeurs', spanish: 'Análisis e información de la plataforma de múltiples vendedores' },
  { sourceText: '🚀 React Admin Dashboard', french: '🚀 Tableau de bord d\'administration React', spanish: '🚀 Panel de administración React' },
  
  // Buttons
  { sourceText: 'Admin Dashboard', french: 'Tableau de bord Admin', spanish: 'Panel de administración' },
  { sourceText: 'Ecommerce Dashboard', french: 'Tableau de bord E-commerce', spanish: 'Panel de comercio electrónico' },
  { sourceText: 'Retry', french: 'Réessayer', spanish: 'Reintentar' },
  { sourceText: 'View', french: 'Voir', spanish: 'Ver' },
  
  // Cards
  { sourceText: 'Users', french: 'Utilisateurs', spanish: 'Usuarios' },
  { sourceText: 'Manage user accounts and permissions', french: 'Gérer les comptes utilisateurs et les permissions', spanish: 'Administrar cuentas de usuario y permisos' },
  { sourceText: 'View Users', french: 'Voir les utilisateurs', spanish: 'Ver usuarios' },
  { sourceText: 'Customers', french: 'Clients', spanish: 'Clientes' },
  { sourceText: 'Manage customer accounts and information', french: 'Gérer les comptes clients et les informations', spanish: 'Administrar cuentas de clientes e información' },
  { sourceText: 'View Customers', french: 'Voir les clients', spanish: 'Ver clientes' },
  { sourceText: 'Carriers', french: 'Transporteurs', spanish: 'Transportistas' },
  { sourceText: 'Manage shipping carriers and logistics', french: 'Gérer les transporteurs et la logistique', spanish: 'Administrar transportistas y logística' },
  { sourceText: 'View Carriers', french: 'Voir les transporteurs', spanish: 'Ver transportistas' },
  { sourceText: 'Analytics', french: 'Analytique', spanish: 'Análisis' },
  { sourceText: 'View system analytics and reports', french: 'Voir les analyses et rapports système', spanish: 'Ver análisis e informes del sistema' },
  { sourceText: 'View Analytics', french: 'Voir l\'analytique', spanish: 'Ver análisis' },
  { sourceText: 'Settings', french: 'Paramètres', spanish: 'Configuración' },
  { sourceText: 'Configure system settings', french: 'Configurer les paramètres système', spanish: 'Configurar ajustes del sistema' },
  { sourceText: 'View Settings', french: 'Voir les paramètres', spanish: 'Ver configuración' },
  
  // Stats
  { sourceText: 'Total', french: 'Total', spanish: 'Total' },
  { sourceText: 'Total Users', french: 'Total des utilisateurs', spanish: 'Total de usuarios' },
  { sourceText: 'Total Customers', french: 'Total des clients', spanish: 'Total de clientes' },
  { sourceText: 'Total Carriers', french: 'Total des transporteurs', spanish: 'Total de transportistas' },
  { sourceText: 'System Status', french: 'État du système', spanish: 'Estado del sistema' },
  { sourceText: 'Uptime', french: 'Disponibilité', spanish: 'Tiempo de actividad' },
  { sourceText: 'vs last month', french: 'vs le mois dernier', spanish: 'vs mes pasado' },
  { sourceText: 'Reports', french: 'Rapports', spanish: 'Informes' },
  { sourceText: 'Config', french: 'Configuration', spanish: 'Configuración' },
  { sourceText: 'Total Revenue', french: 'Revenu total', spanish: 'Ingresos totales' },
  { sourceText: 'Total Orders', french: 'Total des commandes', spanish: 'Total de pedidos' },
  { sourceText: 'Active Sellers', french: 'Vendeurs actifs', spanish: 'Vendedores activos' },
  { sourceText: 'Avg. Delivery Time', french: 'Temps de livraison moyen', spanish: 'Tiempo promedio de entrega' },
  { sourceText: 'Conversion Rate', french: 'Taux de conversion', spanish: 'Tasa de conversión' },
  { sourceText: 'Avg. Order Value', french: 'Valeur moyenne de commande', spanish: 'Valor promedio del pedido' },
  
  // Charts
  { sourceText: 'Sales Trend', french: 'Tendance des ventes', spanish: 'Tendencia de ventas' },
  { sourceText: 'Orders Trend', french: 'Tendance des commandes', spanish: 'Tendencia de pedidos' },
  { sourceText: 'Top Selling Products', french: 'Produits les plus vendus', spanish: 'Productos más vendidos' },
  { sourceText: 'Revenue by Category', french: 'Revenu par catégorie', spanish: 'Ingresos por categoría' },
  { sourceText: 'Seller Performance', french: 'Performance des vendeurs', spanish: 'Rendimiento de vendedores' },
  { sourceText: 'Recent Orders', french: 'Commandes récentes', spanish: 'Pedidos recientes' },
  { sourceText: 'Revenue', french: 'Revenu', spanish: 'Ingresos' },
  { sourceText: 'Orders', french: 'Commandes', spanish: 'Pedidos' },
  { sourceText: 'Total Sellers', french: 'Total des vendeurs', spanish: 'Total de vendedores' },
  { sourceText: 'Sales', french: 'Ventes', spanish: 'Ventas' },
  { sourceText: 'Product', french: 'Produit', spanish: 'Producto' },
  
  // System
  { sourceText: 'System Overview', french: 'Aperçu du système', spanish: 'Descripción general del sistema' },
  { sourceText: 'Recent Users', french: 'Utilisateurs récents', spanish: 'Usuarios recientes' },
  { sourceText: 'healthy', french: 'sain', spanish: 'saludable' },
  { sourceText: 'warning', french: 'avertissement', spanish: 'advertencia' },
  { sourceText: 'critical', french: 'critique', spanish: 'crítico' },
  { sourceText: 'Last updated', french: 'Dernière mise à jour', spanish: 'Última actualización' },
  
  // Table
  { sourceText: 'Name', french: 'Nom', spanish: 'Nombre' },
  { sourceText: 'Email', french: 'E-mail', spanish: 'Correo electrónico' },
  { sourceText: 'Status', french: 'Statut', spanish: 'Estado' },
  { sourceText: 'Created', french: 'Créé', spanish: 'Creado' },
  
  // Status
  { sourceText: 'Active', french: 'Actif', spanish: 'Activo' },
  { sourceText: 'Inactive', french: 'Inactif', spanish: 'Inactivo' },
  { sourceText: 'completed', french: 'terminé', spanish: 'completado' },
  { sourceText: 'shipped', french: 'expédié', spanish: 'enviado' },
  { sourceText: 'processing', french: 'en cours', spanish: 'procesando' },
  { sourceText: 'pending', french: 'en attente', spanish: 'pendiente' },
  
  // Time
  { sourceText: 'days', french: 'jours', spanish: 'días' },
  
  // Messages
  { sourceText: 'Loading dashboard statistics...', french: 'Chargement des statistiques du tableau de bord...', spanish: 'Cargando estadísticas del panel...' },
  { sourceText: 'Failed to load dashboard statistics', french: 'Échec du chargement des statistiques du tableau de bord', spanish: 'Error al cargar las estadísticas del panel' },
  { sourceText: 'Failed to load statistics', french: 'Échec du chargement des statistiques', spanish: 'Error al cargar estadísticas' },
  { sourceText: 'No statistics available', french: 'Aucune statistique disponible', spanish: 'No hay estadísticas disponibles' },
  { sourceText: 'This might be due to API connectivity issues.', french: 'Cela peut être dû à des problèmes de connectivité de l\'API.', spanish: 'Esto puede deberse a problemas de conectividad de la API.' },
  { sourceText: '✅ React + TypeScript + Modern Architecture is working perfectly!', french: '✅ React + TypeScript + Architecture moderne fonctionne parfaitement !', spanish: '✅ React + TypeScript + Arquitectura moderna funciona perfectamente!' },
  
  // Ecommerce
  { sourceText: 'Date', french: 'Date', spanish: 'Fecha' },
  { sourceText: 'Electronics', french: 'Électronique', spanish: 'Electrónica' },
  { sourceText: 'Clothing', french: 'Vêtements', spanish: 'Ropa' },
  { sourceText: 'Home & Garden', french: 'Maison et jardin', spanish: 'Hogar y jardín' },
  { sourceText: 'Sports', french: 'Sports', spanish: 'Deportes' },
  { sourceText: 'Books', french: 'Livres', spanish: 'Libros' },
  { sourceText: 'Jan', french: 'Jan', spanish: 'Ene' },
  { sourceText: 'Feb', french: 'Fév', spanish: 'Feb' },
  { sourceText: 'Mar', french: 'Mar', spanish: 'Mar' },
  { sourceText: 'Apr', french: 'Avr', spanish: 'Abr' },
  { sourceText: 'May', french: 'Mai', spanish: 'May' },
  { sourceText: 'Jun', french: 'Juin', spanish: 'Jun' },
];

/**
 * Seed a single translation (French or Spanish)
 */
async function seedTranslation(
  sourceText: string,
  translatedText: string,
  languageCode: string
): Promise<void> {
  try {
    const payload: CreateTranslationRequest = {
      original: sourceText,
      destination: translatedText,
      languageCode: languageCode,
      context: {
        module: 'dashboard',
        category: 'ui-labels'
      }
    };

    await axios.post(`${TRANSLATION_API_BASE_URL}/translations`, payload);
    console.log(`✅ [${languageCode.toUpperCase()}] "${sourceText}" → "${translatedText}"`);
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log(`⚠️  [${languageCode.toUpperCase()}] Translation already exists: "${sourceText}"`);
    } else {
      console.error(`❌ [${languageCode.toUpperCase()}] Failed to seed "${sourceText}":`, error.message);
    }
  }
}

/**
 * Main seeding function
 */
async function main() {
  console.log('🌍 Starting Dashboard Module Translation Seeding...\n');
  console.log(`📊 Total translations to seed: ${dashboardTranslations.length} × 2 languages = ${dashboardTranslations.length * 2} records\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const translation of dashboardTranslations) {
    try {
      // Seed French translation
      await seedTranslation(translation.sourceText, translation.french, 'fr');
      successCount++;
      
      // Seed Spanish translation
      await seedTranslation(translation.sourceText, translation.spanish, 'es');
      successCount++;
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      errorCount++;
      console.error(`❌ Unexpected error:`, error);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('🎉 Dashboard Translation Seeding Complete!');
  console.log('='.repeat(80));
  console.log(`✅ Successfully seeded: ${successCount} translations`);
  console.log(`⚠️  Skipped (already exist): ${skipCount} translations`);
  console.log(`❌ Failed: ${errorCount} translations`);
  console.log('='.repeat(80) + '\n');

  console.log('📝 Next Steps:');
  console.log('1. Verify translations in the Dashboard interface');
  console.log('2. Test language switching on dashboard pages');
  console.log('3. Review charts and statistics in different languages\n');
}

// Run the seeding script
main().catch((error) => {
  console.error('💥 Seeding script failed:', error);
  process.exit(1);
});
