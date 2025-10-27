#!/usr/bin/env ts-node

/**
 * Carrier Module Translation Seeding Script
 * 
 * This script seeds French and Spanish translations for all Carrier module labels.
 * Run this to populate the translation database with carrier-related text.
 * 
 * Usage:
 *   ts-node seed-carrier-translations.ts
 * 
 * Or via npm:
 *   npm run seed:carrier-translations
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
 * Carrier Module Translations
 * Organized by category matching carrier-labels.ts structure
 */
const carrierTranslations: TranslationPair[] = [
  // Page Headers
  { sourceText: 'Carriers', french: 'Transporteurs', spanish: 'Transportistas' },
  { sourceText: 'Manage your carrier partners', french: 'Gérez vos partenaires transporteurs', spanish: 'Administre sus socios transportistas' },
  
  // Actions
  { sourceText: 'Add Carrier', french: 'Ajouter un transporteur', spanish: 'Agregar transportista' },
  { sourceText: 'Edit', french: 'Modifier', spanish: 'Editar' },
  { sourceText: 'Delete', french: 'Supprimer', spanish: 'Eliminar' },
  { sourceText: 'Activate', french: 'Activer', spanish: 'Activar' },
  { sourceText: 'Deactivate', french: 'Désactiver', spanish: 'Desactivar' },
  { sourceText: 'Export CSV', french: 'Exporter CSV', spanish: 'Exportar CSV' },
  { sourceText: 'Refresh', french: 'Actualiser', spanish: 'Actualizar' },
  { sourceText: 'Close', french: 'Fermer', spanish: 'Cerrar' },
  { sourceText: 'Save', french: 'Enregistrer', spanish: 'Guardar' },
  { sourceText: 'Saving...', french: 'Enregistrement...', spanish: 'Guardando...' },
  { sourceText: 'Create Carrier', french: 'Créer un transporteur', spanish: 'Crear transportista' },
  { sourceText: 'Update Carrier', french: 'Mettre à jour le transporteur', spanish: 'Actualizar transportista' },
  
  // Table Headers
  { sourceText: 'Name', french: 'Nom', spanish: 'Nombre' },
  { sourceText: 'Phone', french: 'Téléphone', spanish: 'Teléfono' },
  { sourceText: 'Code', french: 'Code', spanish: 'Código' },
  { sourceText: 'Last Updated', french: 'Dernière mise à jour', spanish: 'Última actualización' },
  { sourceText: 'No carriers found', french: 'Aucun transporteur trouvé', spanish: 'No se encontraron transportistas' },
  { sourceText: 'Showing', french: 'Affichage', spanish: 'Mostrando' },
  { sourceText: 'of', french: 'de', spanish: 'de' },
  
  // Sections
  { sourceText: 'Carrier Information', french: 'Informations du transporteur', spanish: 'Información del transportista' },
  { sourceText: 'Contact Information', french: 'Informations de contact', spanish: 'Información de contacto' },
  { sourceText: 'Account Information', french: 'Informations du compte', spanish: 'Información de la cuenta' },
  
  // Fields
  { sourceText: 'Contact Email', french: 'E-mail de contact', spanish: 'Correo electrónico de contacto' },
  { sourceText: 'Contact Phone', french: 'Téléphone de contact', spanish: 'Teléfono de contacto' },
  { sourceText: 'Carrier ID', french: 'ID du transporteur', spanish: 'ID del transportista' },
  
  // Placeholders
  { sourceText: 'Search carriers by name, email, or code...', french: 'Rechercher des transporteurs par nom, e-mail ou code...', spanish: 'Buscar transportistas por nombre, correo o código...' },
  { sourceText: 'Not provided', french: 'Non fourni', spanish: 'No proporcionado' },
  { sourceText: 'No description provided', french: 'Aucune description fournie', spanish: 'No se proporcionó descripción' },
  { sourceText: 'Enter carrier name', french: 'Entrez le nom du transporteur', spanish: 'Ingrese el nombre del transportista' },
  { sourceText: 'Enter carrier code (e.g., UPS, FEDEX)', french: 'Entrez le code du transporteur (ex. UPS, FEDEX)', spanish: 'Ingrese el código del transportista (ej. UPS, FEDEX)' },
  { sourceText: 'Enter contact email', french: 'Entrez l\'e-mail de contact', spanish: 'Ingrese el correo de contacto' },
  { sourceText: 'Enter contact phone', french: 'Entrez le téléphone de contact', spanish: 'Ingrese el teléfono de contacto' },
  { sourceText: 'Enter description (optional)', french: 'Entrez la description (optionnel)', spanish: 'Ingrese la descripción (opcional)' },
  
  // Modals
  { sourceText: 'Create New Carrier', french: 'Créer un nouveau transporteur', spanish: 'Crear nuevo transportista' },
  { sourceText: 'Edit Carrier', french: 'Modifier le transporteur', spanish: 'Editar transportista' },
  { sourceText: 'Carrier Details', french: 'Détails du transporteur', spanish: 'Detalles del transportista' },
  { sourceText: 'Delete Carrier', french: 'Supprimer le transporteur', spanish: 'Eliminar transportista' },
  { sourceText: 'Are you sure you want to delete this carrier?', french: 'Êtes-vous sûr de vouloir supprimer ce transporteur ?', spanish: '¿Está seguro de que desea eliminar este transportista?' },
  
  // Messages
  { sourceText: 'Carrier created successfully', french: 'Transporteur créé avec succès', spanish: 'Transportista creado exitosamente' },
  { sourceText: 'Failed to create carrier', french: 'Échec de la création du transporteur', spanish: 'Error al crear el transportista' },
  { sourceText: 'Carrier updated successfully', french: 'Transporteur mis à jour avec succès', spanish: 'Transportista actualizado exitosamente' },
  { sourceText: 'Failed to update carrier', french: 'Échec de la mise à jour du transporteur', spanish: 'Error al actualizar el transportista' },
  { sourceText: 'Carrier deleted successfully', french: 'Transporteur supprimé avec succès', spanish: 'Transportista eliminado exitosamente' },
  { sourceText: 'Failed to delete carrier', french: 'Échec de la suppression du transporteur', spanish: 'Error al eliminar el transportista' },
  { sourceText: 'Carrier activated', french: 'Transporteur activé', spanish: 'Transportista activado' },
  { sourceText: 'Carrier deactivated', french: 'Transporteur désactivé', spanish: 'Transportista desactivado' },
  { sourceText: 'Failed to toggle carrier status', french: 'Échec du changement de statut du transporteur', spanish: 'Error al cambiar el estado del transportista' },
  { sourceText: 'Carriers exported successfully', french: 'Transporteurs exportés avec succès', spanish: 'Transportistas exportados exitosamente' },
  { sourceText: 'Failed to export carriers', french: 'Échec de l\'exportation des transporteurs', spanish: 'Error al exportar transportistas' },
  { sourceText: 'Failed to load carriers', french: 'Échec du chargement des transporteurs', spanish: 'Error al cargar transportistas' },
  
  // Sorting
  { sourceText: 'Created Date', french: 'Date de création', spanish: 'Fecha de creación' },
  
  // Validation
  { sourceText: 'Name is required', french: 'Le nom est requis', spanish: 'El nombre es obligatorio' },
  { sourceText: 'Code is required', french: 'Le code est requis', spanish: 'El código es obligatorio' },
  { sourceText: 'Code must contain only uppercase letters, numbers, and hyphens', french: 'Le code doit contenir uniquement des lettres majuscules, des chiffres et des traits d\'union', spanish: 'El código debe contener solo letras mayúsculas, números y guiones' },
  { sourceText: 'Invalid email format', french: 'Format d\'e-mail invalide', spanish: 'Formato de correo electrónico inválido' },
  { sourceText: 'Invalid phone format', french: 'Format de téléphone invalide', spanish: 'Formato de teléfono inválido' },
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
        module: 'carriers',
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
  console.log('🌍 Starting Carrier Module Translation Seeding...\n');
  console.log(`📊 Total translations to seed: ${carrierTranslations.length} × 2 languages = ${carrierTranslations.length * 2} records\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const translation of carrierTranslations) {
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
  console.log('🎉 Carrier Translation Seeding Complete!');
  console.log('='.repeat(80));
  console.log(`✅ Successfully seeded: ${successCount} translations`);
  console.log(`⚠️  Skipped (already exist): ${skipCount} translations`);
  console.log(`❌ Failed: ${errorCount} translations`);
  console.log('='.repeat(80) + '\n');

  console.log('📝 Next Steps:');
  console.log('1. Verify translations in the Carriers interface');
  console.log('2. Test language switching on carrier management pages');
  console.log('3. Review carrier forms and validation messages in different languages\n');
}

// Run the seeding script
main().catch((error) => {
  console.error('💥 Seeding script failed:', error);
  process.exit(1);
});
