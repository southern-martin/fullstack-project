import axios from 'axios';

const TRANSLATION_API_BASE_URL = 'http://localhost:3007/api/v1/translation';

interface CreateTranslationRequest {
  original: string;
  destination: string;
  languageCode: string;
  context?: {
    category?: string;
    module?: string;
  };
}

interface TranslationPair {
  sourceText: string;
  french: string;
  spanish: string;
}

const navigationTranslations: TranslationPair[] = [
  // Menu Items
  { sourceText: 'Dashboard', french: 'Tableau de bord', spanish: 'Panel de control' },
  { sourceText: 'Microservices', french: 'Microservices', spanish: 'Microservicios' },
  { sourceText: 'Users', french: 'Utilisateurs', spanish: 'Usuarios' },
  { sourceText: 'Roles', french: 'Rôles', spanish: 'Roles' },
  { sourceText: 'Customers', french: 'Clients', spanish: 'Clientes' },
  { sourceText: 'Carriers', french: 'Transporteurs', spanish: 'Transportistas' },
  { sourceText: 'Pricing', french: 'Tarification', spanish: 'Precios' },
  { sourceText: 'Translations', french: 'Traductions', spanish: 'Traducciones' },
  { sourceText: 'Analytics', french: 'Analytique', spanish: 'Analítica' },
  { sourceText: 'Settings', french: 'Paramètres', spanish: 'Configuración' },

  // Profile
  { sourceText: 'View Profile', french: 'Voir le profil', spanish: 'Ver perfil' },
  { sourceText: 'Logout', french: 'Déconnexion', spanish: 'Cerrar sesión' },
  { sourceText: 'Toggle Theme', french: 'Changer de thème', spanish: 'Cambiar tema' },

  // Mobile Menu
  { sourceText: 'Open main menu', french: 'Ouvrir le menu principal', spanish: 'Abrir menú principal' },
  { sourceText: 'Close menu', french: 'Fermer le menu', spanish: 'Cerrar menú' },

  // Branding
  { sourceText: 'React Admin', french: 'React Admin', spanish: 'React Admin' },
];

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
        module: 'navigation',
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

async function seedAllNavigationTranslations(): Promise<void> {
  console.log('🌱 Starting navigation label seeding...\n');

  let frenchCount = 0;
  let spanishCount = 0;
  let existingCount = 0;

  for (const { sourceText, french, spanish } of navigationTranslations) {
    // Seed French translation
    try {
      await seedTranslation(sourceText, french, 'fr');
      frenchCount++;
    } catch (error) {
      existingCount++;
    }

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));

    // Seed Spanish translation
    try {
      await seedTranslation(sourceText, spanish, 'es');
      spanishCount++;
    } catch (error) {
      existingCount++;
    }

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✨ Navigation label seeding complete!');
  console.log(`📊 Summary:`);
  console.log(`   - French translations seeded: ${frenchCount}`);
  console.log(`   - Spanish translations seeded: ${spanishCount}`);
  console.log(`   - Already existing: ${existingCount}`);
  console.log(`   - Total processed: ${(frenchCount + spanishCount + existingCount)}`);
}

// Run the seeding
seedAllNavigationTranslations()
  .then(() => {
    console.log('\n✅ Seeding process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding process failed:', error);
    process.exit(1);
  });
