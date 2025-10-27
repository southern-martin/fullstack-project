#!/usr/bin/env ts-node

/**
 * Customer Module Translation Seeding Script
 *
 * This script seeds French and Spanish translations for all Customer module labels.
 * Run this to populate the translation database with customer-related text.
 *
 * Usage:
 *   ts-node seed-customer-translations.ts
 *
 * Or via npm:
 *   npm run seed:customer-translations
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
 * Customer Module Translations
 * Organized by category matching customer-labels.ts structure
 */
const customerTranslations: TranslationPair[] = [
  // Page Headers
  { sourceText: 'Customers', french: 'Clients', spanish: 'Clientes' },
  {
    sourceText: 'Manage your customer database',
    french: 'Gérez votre base de données clients',
    spanish: 'Administre su base de datos de clientes',
  },

  // Buttons
  {
    sourceText: 'Add Customer',
    french: 'Ajouter un client',
    spanish: 'Agregar cliente',
  },
  { sourceText: 'Cancel', french: 'Annuler', spanish: 'Cancelar' },
  { sourceText: 'Delete', french: 'Supprimer', spanish: 'Eliminar' },
  { sourceText: 'Export CSV', french: 'Exporter CSV', spanish: 'Exportar CSV' },
  { sourceText: 'Refresh', french: 'Actualiser', spanish: 'Actualizar' },
  { sourceText: 'Save', french: 'Enregistrer', spanish: 'Guardar' },
  {
    sourceText: 'Saving...',
    french: 'Enregistrement...',
    spanish: 'Guardando...',
  },
  {
    sourceText: 'Update Customer',
    french: 'Mettre à jour le client',
    spanish: 'Actualizar cliente',
  },
  {
    sourceText: 'Create Customer',
    french: 'Créer un client',
    spanish: 'Crear cliente',
  },
  { sourceText: 'Close', french: 'Fermer', spanish: 'Cerrar' },

  // Success Messages
  {
    sourceText: 'Customer created successfully',
    french: 'Client créé avec succès',
    spanish: 'Cliente creado exitosamente',
  },
  {
    sourceText: 'Customer updated successfully',
    french: 'Client mis à jour avec succès',
    spanish: 'Cliente actualizado exitosamente',
  },
  {
    sourceText: 'Customer deleted successfully',
    french: 'Client supprimé avec succès',
    spanish: 'Cliente eliminado exitosamente',
  },
  {
    sourceText: 'Customer activated',
    french: 'Client activé',
    spanish: 'Cliente activado',
  },
  {
    sourceText: 'Customer deactivated',
    french: 'Client désactivé',
    spanish: 'Cliente desactivado',
  },

  // Error Messages
  {
    sourceText: 'Failed to create customer',
    french: 'Échec de la création du client',
    spanish: 'Error al crear el cliente',
  },
  {
    sourceText: 'Failed to update customer',
    french: 'Échec de la mise à jour du client',
    spanish: 'Error al actualizar el cliente',
  },
  {
    sourceText: 'Failed to delete customer',
    french: 'Échec de la suppression du client',
    spanish: 'Error al eliminar el cliente',
  },
  {
    sourceText: 'Failed to toggle customer status',
    french: 'Échec du changement de statut du client',
    spanish: 'Error al cambiar el estado del cliente',
  },
  {
    sourceText: 'Failed to export customers',
    french: "Échec de l'exportation des clients",
    spanish: 'Error al exportar clientes',
  },
  {
    sourceText: 'An error occurred while saving the customer',
    french: "Une erreur s'est produite lors de l'enregistrement du client",
    spanish: 'Ocurrió un error al guardar el cliente',
  },
  {
    sourceText: 'Unknown error',
    french: 'Erreur inconnue',
    spanish: 'Error desconocido',
  },

  // Table Headers
  { sourceText: 'First Name', french: 'Prénom', spanish: 'Nombre' },
  { sourceText: 'Last Name', french: 'Nom de famille', spanish: 'Apellido' },
  { sourceText: 'Email', french: 'E-mail', spanish: 'Correo electrónico' },
  {
    sourceText: 'Created Date',
    french: 'Date de création',
    spanish: 'Fecha de creación',
  },
  { sourceText: 'Actions', french: 'Actions', spanish: 'Acciones' },
  {
    sourceText: 'No customers found',
    french: 'Aucun client trouvé',
    spanish: 'No se encontraron clientes',
  },

  // Search
  {
    sourceText: 'Search customers by name, email, or company...',
    french: 'Rechercher des clients par nom, e-mail ou entreprise...',
    spanish: 'Buscar clientes por nombre, correo electrónico o empresa...',
  },

  // Status
  { sourceText: 'Active', french: 'Actif', spanish: 'Activo' },
  { sourceText: 'Inactive', french: 'Inactif', spanish: 'Inactivo' },

  // Actions
  {
    sourceText: 'View Details',
    french: 'Voir les détails',
    spanish: 'Ver detalles',
  },
  { sourceText: 'Edit', french: 'Modifier', spanish: 'Editar' },
  { sourceText: 'Activate', french: 'Activer', spanish: 'Activar' },
  { sourceText: 'Deactivate', french: 'Désactiver', spanish: 'Desactivar' },

  // Modals
  {
    sourceText: 'Create New Customer',
    french: 'Créer un nouveau client',
    spanish: 'Crear nuevo cliente',
  },
  {
    sourceText: 'Edit Customer',
    french: 'Modifier le client',
    spanish: 'Editar cliente',
  },
  {
    sourceText: 'Customer Details',
    french: 'Détails du client',
    spanish: 'Detalles del cliente',
  },
  {
    sourceText: 'Delete Customer',
    french: 'Supprimer le client',
    spanish: 'Eliminar cliente',
  },
  {
    sourceText:
      'Are you sure you want to delete this customer? This action cannot be undone.',
    french:
      'Êtes-vous sûr de vouloir supprimer ce client ? Cette action ne peut pas être annulée.',
    spanish:
      '¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer.',
  },

  // Form Fields
  { sourceText: 'Phone', french: 'Téléphone', spanish: 'Teléfono' },
  { sourceText: 'Company', french: 'Entreprise', spanish: 'Empresa' },
  { sourceText: 'Name', french: 'Nom', spanish: 'Nombre' },
  { sourceText: 'Address', french: 'Adresse', spanish: 'Dirección' },
  { sourceText: 'Customer ID', french: 'ID client', spanish: 'ID del cliente' },
  { sourceText: 'Status', french: 'Statut', spanish: 'Estado' },
  { sourceText: 'Created', french: 'Créé', spanish: 'Creado' },
  {
    sourceText: 'Last Updated',
    french: 'Dernière mise à jour',
    spanish: 'Última actualización',
  },

  // Placeholders
  {
    sourceText: 'Enter first name',
    french: 'Entrez le prénom',
    spanish: 'Ingrese el nombre',
  },
  {
    sourceText: 'Enter last name',
    french: 'Entrez le nom de famille',
    spanish: 'Ingrese el apellido',
  },
  {
    sourceText: 'Enter email address',
    french: "Entrez l'adresse e-mail",
    spanish: 'Ingrese la dirección de correo electrónico',
  },
  {
    sourceText: 'Enter phone number',
    french: 'Entrez le numéro de téléphone',
    spanish: 'Ingrese el número de teléfono',
  },
  {
    sourceText: 'Enter company name',
    french: "Entrez le nom de l'entreprise",
    spanish: 'Ingrese el nombre de la empresa',
  },
  {
    sourceText: 'Not provided',
    french: 'Non fourni',
    spanish: 'No proporcionado',
  },

  // Validation
  {
    sourceText: 'First name is required',
    french: 'Le prénom est requis',
    spanish: 'El nombre es obligatorio',
  },
  {
    sourceText: 'Last name is required',
    french: 'Le nom de famille est requis',
    spanish: 'El apellido es obligatorio',
  },
  {
    sourceText: 'Email is required',
    french: "L'e-mail est requis",
    spanish: 'El correo electrónico es obligatorio',
  },
  {
    sourceText: 'Please enter a valid email address',
    french: 'Veuillez entrer une adresse e-mail valide',
    spanish: 'Por favor, ingrese una dirección de correo electrónico válida',
  },

  // Sections
  {
    sourceText: 'Contact Information',
    french: 'Informations de contact',
    spanish: 'Información de contacto',
  },
  {
    sourceText: 'Account Information',
    french: 'Informations du compte',
    spanish: 'Información de la cuenta',
  },
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
        module: 'customer',
        category: 'ui-labels',
      },
    };

    await axios.post(`${TRANSLATION_API_BASE_URL}/translations`, payload);
    console.log(
      `✅ [${languageCode.toUpperCase()}] "${sourceText}" → "${translatedText}"`
    );
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log(
        `⚠️  [${languageCode.toUpperCase()}] Translation already exists: "${sourceText}"`
      );
    } else {
      console.error(
        `❌ [${languageCode.toUpperCase()}] Failed to seed "${sourceText}":`,
        error.message
      );
    }
  }
}

/**
 * Main seeding function
 */
async function main() {
  console.log('🌍 Starting Customer Module Translation Seeding...\n');
  console.log(
    `📊 Total translations to seed: ${
      customerTranslations.length
    } × 2 languages = ${customerTranslations.length * 2} records\n`
  );

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const translation of customerTranslations) {
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
  console.log('🎉 Customer Translation Seeding Complete!');
  console.log('='.repeat(80));
  console.log(`✅ Successfully seeded: ${successCount} translations`);
  console.log(`⚠️  Skipped (already exist): ${skipCount} translations`);
  console.log(`❌ Failed: ${errorCount} translations`);
  console.log('='.repeat(80) + '\n');

  console.log('📝 Next Steps:');
  console.log('1. Verify translations in the Customer management interface');
  console.log('2. Test language switching on customer pages');
  console.log('3. Review any missing translations and add them manually\n');
}

// Run the seeding script
main().catch(error => {
  console.error('💥 Seeding script failed:', error);
  process.exit(1);
});
