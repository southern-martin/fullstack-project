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

const translationTranslations: TranslationPair[] = [
  // Page Headers
  { sourceText: 'Translations', french: 'Traductions', spanish: 'Traducciones' },
  { sourceText: 'Manage translations and language settings', french: 'Gérer les traductions et les paramètres de langue', spanish: 'Gestionar traducciones y configuración de idioma' },
  { sourceText: 'Language Management', french: 'Gestion des langues', spanish: 'Gestión de idiomas' },

  // Table Headers
  { sourceText: 'Original Text', french: 'Texte original', spanish: 'Texto original' },
  { sourceText: 'Translation', french: 'Traduction', spanish: 'Traducción' },
  { sourceText: 'Language', french: 'Langue', spanish: 'Idioma' },
  { sourceText: 'Language Code', french: 'Code de langue', spanish: 'Código de idioma' },
  { sourceText: 'Translation Key', french: 'Clé de traduction', spanish: 'Clave de traducción' },
  { sourceText: 'Context', french: 'Contexte', spanish: 'Contexto' },
  { sourceText: 'Status', french: 'Statut', spanish: 'Estado' },
  { sourceText: 'Approved', french: 'Approuvé', spanish: 'Aprobado' },
  { sourceText: 'Approved By', french: 'Approuvé par', spanish: 'Aprobado por' },
  { sourceText: 'Created', french: 'Créé', spanish: 'Creado' },
  { sourceText: 'Updated', french: 'Mis à jour', spanish: 'Actualizado' },
  { sourceText: 'No translations found', french: 'Aucune traduction trouvée', spanish: 'No se encontraron traducciones' },
  { sourceText: 'Showing', french: 'Affichage', spanish: 'Mostrando' },
  { sourceText: 'of', french: 'de', spanish: 'de' },
  { sourceText: 'entries', french: 'entrées', spanish: 'entradas' },

  // Buttons
  { sourceText: 'Create', french: 'Créer', spanish: 'Crear' },
  { sourceText: 'Create Translation', french: 'Créer une traduction', spanish: 'Crear traducción' },
  { sourceText: 'Save', french: 'Enregistrer', spanish: 'Guardar' },
  { sourceText: 'Cancel', french: 'Annuler', spanish: 'Cancelar' },
  { sourceText: 'Delete', french: 'Supprimer', spanish: 'Eliminar' },
  { sourceText: 'Edit', french: 'Modifier', spanish: 'Editar' },
  { sourceText: 'Refresh', french: 'Actualiser', spanish: 'Refrescar' },
  { sourceText: 'Manage Languages', french: 'Gérer les langues', spanish: 'Gestionar idiomas' },
  { sourceText: 'Approve', french: 'Approuver', spanish: 'Aprobar' },
  { sourceText: 'Export', french: 'Exporter', spanish: 'Exportar' },
  { sourceText: 'Import', french: 'Importer', spanish: 'Importar' },
  { sourceText: 'Translate', french: 'Traduire', spanish: 'Traducir' },

  // Search
  { sourceText: 'Search translations...', french: 'Rechercher des traductions...', spanish: 'Buscar traducciones...' },
  { sourceText: 'Search by original text', french: 'Rechercher par texte original', spanish: 'Buscar por texto original' },
  { sourceText: 'Search by translation', french: 'Rechercher par traduction', spanish: 'Buscar por traducción' },
  { sourceText: 'Search by key', french: 'Rechercher par clé', spanish: 'Buscar por clave' },

  // Status Values
  { sourceText: 'Active', french: 'Actif', spanish: 'Activo' },
  { sourceText: 'Inactive', french: 'Inactif', spanish: 'Inactivo' },
  { sourceText: 'Pending', french: 'En attente', spanish: 'Pendiente' },
  { sourceText: 'Rejected', french: 'Rejeté', spanish: 'Rechazado' },

  // Actions
  { sourceText: 'View Details', french: 'Voir les détails', spanish: 'Ver detalles' },
  { sourceText: 'Toggle Status', french: 'Basculer le statut', spanish: 'Cambiar estado' },
  { sourceText: 'Duplicate', french: 'Dupliquer', spanish: 'Duplicar' },

  // Modals
  { sourceText: 'Create New Translation', french: 'Créer une nouvelle traduction', spanish: 'Crear nueva traducción' },
  { sourceText: 'Edit Translation', french: 'Modifier la traduction', spanish: 'Editar traducción' },
  { sourceText: 'Delete Translation', french: 'Supprimer la traduction', spanish: 'Eliminar traducción' },
  { sourceText: 'Translation Details', french: 'Détails de la traduction', spanish: 'Detalles de traducción' },
  { sourceText: 'Import Translations', french: 'Importer des traductions', spanish: 'Importar traducciones' },
  { sourceText: 'Export Translations', french: 'Exporter les traductions', spanish: 'Exportar traducciones' },

  // Messages
  { sourceText: 'Translation created successfully', french: 'Traduction créée avec succès', spanish: 'Traducción creada exitosamente' },
  { sourceText: 'Failed to create translation', french: 'Échec de la création de la traduction', spanish: 'Error al crear traducción' },
  { sourceText: 'Translation updated successfully', french: 'Traduction mise à jour avec succès', spanish: 'Traducción actualizada exitosamente' },
  { sourceText: 'Failed to update translation', french: 'Échec de la mise à jour de la traduction', spanish: 'Error al actualizar traducción' },
  { sourceText: 'Translation deleted successfully', french: 'Traduction supprimée avec succès', spanish: 'Traducción eliminada exitosamente' },
  { sourceText: 'Failed to delete translation', french: 'Échec de la suppression de la traduction', spanish: 'Error al eliminar traducción' },
  { sourceText: 'Translation approved successfully', french: 'Traduction approuvée avec succès', spanish: 'Traducción aprobada exitosamente' },
  { sourceText: 'Failed to approve translation', french: "Échec de l'approbation de la traduction", spanish: 'Error al aprobar traducción' },
  { sourceText: 'Translations imported successfully', french: 'Traductions importées avec succès', spanish: 'Traducciones importadas exitosamente' },
  { sourceText: 'Failed to import translations', french: "Échec de l'importation des traductions", spanish: 'Error al importar traducciones' },
  { sourceText: 'Translations exported successfully', french: 'Traductions exportées avec succès', spanish: 'Traducciones exportadas exitosamente' },
  { sourceText: 'Failed to export translations', french: "Échec de l'exportation des traductions", spanish: 'Error al exportar traducciones' },
  { sourceText: 'Failed to load translations', french: 'Échec du chargement des traductions', spanish: 'Error al cargar traducciones' },

  // Form Fields
  { sourceText: 'Enter original text', french: 'Entrez le texte original', spanish: 'Ingrese el texto original' },
  { sourceText: 'Enter translation', french: 'Entrez la traduction', spanish: 'Ingrese la traducción' },
  { sourceText: 'Select language', french: 'Sélectionnez la langue', spanish: 'Seleccione el idioma' },
  { sourceText: 'Auto-generated key', french: 'Clé générée automatiquement', spanish: 'Clave generada automáticamente' },
  { sourceText: 'Category', french: 'Catégorie', spanish: 'Categoría' },
  { sourceText: 'Module', french: 'Module', spanish: 'Módulo' },
  { sourceText: 'Component', french: 'Composant', spanish: 'Componente' },
  { sourceText: 'Field', french: 'Champ', spanish: 'Campo' },

  // Validation
  { sourceText: 'Original text is required', french: 'Le texte original est requis', spanish: 'El texto original es obligatorio' },
  { sourceText: 'Translation is required', french: 'La traduction est requise', spanish: 'La traducción es obligatoria' },
  { sourceText: 'Language selection is required', french: 'La sélection de la langue est requise', spanish: 'La selección de idioma es obligatoria' },
  { sourceText: 'Translation key is required', french: 'La clé de traduction est requise', spanish: 'La clave de traducción es obligatoria' },
  { sourceText: 'Invalid format', french: 'Format invalide', spanish: 'Formato inválido' },

  // Details
  { sourceText: 'Translation Information', french: 'Informations de traduction', spanish: 'Información de traducción' },
  { sourceText: 'Context Information', french: 'Informations de contexte', spanish: 'Información de contexto' },
  { sourceText: 'Approval Information', french: "Informations d'approbation", spanish: 'Información de aprobación' },
  { sourceText: 'Usage Information', french: "Informations d'utilisation", spanish: 'Información de uso' },
  { sourceText: 'Usage Count', french: "Nombre d'utilisations", spanish: 'Conteo de uso' },
  { sourceText: 'Last Used', french: 'Dernière utilisation', spanish: 'Último uso' },
  { sourceText: 'Created At', french: 'Créé le', spanish: 'Creado el' },
  { sourceText: 'Updated At', french: 'Mis à jour le', spanish: 'Actualizado el' },

  // Languages
  { sourceText: 'Languages', french: 'Langues', spanish: 'Idiomas' },
  { sourceText: 'Manage supported languages', french: 'Gérer les langues prises en charge', spanish: 'Gestionar idiomas compatibles' },
  { sourceText: 'Code', french: 'Code', spanish: 'Código' },
  { sourceText: 'Name', french: 'Nom', spanish: 'Nombre' },
  { sourceText: 'Local Name', french: 'Nom local', spanish: 'Nombre local' },
  { sourceText: 'Flag', french: 'Drapeau', spanish: 'Bandera' },
  { sourceText: 'Default', french: 'Par défaut', spanish: 'Predeterminado' },
  { sourceText: 'Direction', french: 'Direction', spanish: 'Dirección' },
  { sourceText: 'Left to Right', french: 'Gauche à droite', spanish: 'Izquierda a derecha' },
  { sourceText: 'Right to Left', french: 'Droite à gauche', spanish: 'Derecha a izquierda' },
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
        module: 'translations',
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

async function seedAllTranslations() {
  console.log('🌍 Starting Translation Module Label Seeding...\n');

  for (const pair of translationTranslations) {
    // Seed French translation
    await seedTranslation(pair.sourceText, pair.french, 'fr');
    
    // Seed Spanish translation
    await seedTranslation(pair.sourceText, pair.spanish, 'es');
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log('\n✨ Translation module label seeding completed!');
  console.log(`📊 Total labels seeded: ${translationTranslations.length} (across 2 languages)`);
}

// Run the seeding
seedAllTranslations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
