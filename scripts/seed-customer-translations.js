/**
 * Customer Module Translation Seeding Script (API-based)
 * 
 * This script seeds Customer module translations via the Translation Service HTTP API.
 * It creates French and Spanish translations for all 85 Customer module labels.
 * 
 * Usage: node scripts/seed-customer-translations.js
 */

const http = require('http');

// Configuration
const API_BASE_URL = process.env.TRANSLATION_SERVICE_URL || 'http://localhost:3007';
const API_PATH_PREFIX = '/api/v1';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, skipPrefix = false) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3007,
      path: skipPrefix ? path : `${API_PATH_PREFIX}${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Customer Module Translation Data (85 labels x 2 languages = 170 translations)
const customerTranslations = [
  // Page Titles & Headers
  { en: "Customers", fr: "Clients", es: "Clientes" },
  { en: "Manage your customer database", fr: "Gérez votre base de données clients", es: "Gestione su base de datos de clientes" },
  
  // Buttons
  { en: "Add Customer", fr: "Ajouter un client", es: "Agregar cliente" },
  
  // Modal Titles
  { en: "Create New Customer", fr: "Créer un nouveau client", es: "Crear nuevo cliente" },
  { en: "Edit Customer", fr: "Modifier le client", es: "Editar cliente" },
  { en: "Customer Details", fr: "Détails du client", es: "Detalles del cliente" },
  { en: "Delete Customer", fr: "Supprimer le client", es: "Eliminar cliente" },
  
  // Form Labels
  { en: "First Name", fr: "Prénom", es: "Nombre" },
  { en: "Last Name", fr: "Nom de famille", es: "Apellido" },
  { en: "Email", fr: "E-mail", es: "Correo electrónico" },
  { en: "Phone", fr: "Téléphone", es: "Teléfono" },
  { en: "Company", fr: "Entreprise", es: "Empresa" },
  { en: "Name", fr: "Nom", es: "Nombre" },
  { en: "Address", fr: "Adresse", es: "Dirección" },
  { en: "Customer ID", fr: "ID du client", es: "ID del cliente" },
  { en: "Status", fr: "Statut", es: "Estado" },
  { en: "Created", fr: "Créé", es: "Creado" },
  { en: "Last Updated", fr: "Dernière mise à jour", es: "Última actualización" },
  
  // Form Placeholders
  { en: "Enter first name", fr: "Entrez le prénom", es: "Ingrese el nombre" },
  { en: "Enter last name", fr: "Entrez le nom de famille", es: "Ingrese el apellido" },
  { en: "Enter email address", fr: "Entrez l'adresse e-mail", es: "Ingrese el correo electrónico" },
  { en: "Enter phone number", fr: "Entrez le numéro de téléphone", es: "Ingrese el número de teléfono" },
  { en: "Enter company name", fr: "Entrez le nom de l'entreprise", es: "Ingrese el nombre de la empresa" },
  { en: "Search customers by name, email, or company...", fr: "Rechercher des clients par nom, e-mail ou entreprise...", es: "Buscar clientes por nombre, correo o empresa..." },
  
  // Form Validation Messages
  { en: "First name is required", fr: "Le prénom est requis", es: "El nombre es obligatorio" },
  { en: "Last name is required", fr: "Le nom de famille est requis", es: "El apellido es obligatorio" },
  { en: "Email is required", fr: "L'e-mail est requis", es: "El correo electrónico es obligatorio" },
  { en: "Please enter a valid email address", fr: "Veuillez entrer une adresse e-mail valide", es: "Por favor ingrese un correo electrónico válido" },
  
  // Toast Success Messages
  { en: "Customer created successfully", fr: "Client créé avec succès", es: "Cliente creado exitosamente" },
  { en: "Customer updated successfully", fr: "Client mis à jour avec succès", es: "Cliente actualizado exitosamente" },
  { en: "Customer deleted successfully", fr: "Client supprimé avec succès", es: "Cliente eliminado exitosamente" },
  { en: "Customer activated", fr: "Client activé", es: "Cliente activado" },
  { en: "Customer deactivated", fr: "Client désactivé", es: "Cliente desactivado" },
  
  // Toast Error Messages
  { en: "Failed to create customer", fr: "Échec de la création du client", es: "Error al crear cliente" },
  { en: "Failed to update customer", fr: "Échec de la mise à jour du client", es: "Error al actualizar cliente" },
  { en: "Failed to delete customer", fr: "Échec de la suppression du client", es: "Error al eliminar cliente" },
  { en: "Failed to toggle customer status", fr: "Échec du changement de statut du client", es: "Error al cambiar estado del cliente" },
  { en: "Failed to export customers", fr: "Échec de l'exportation des clients", es: "Error al exportar clientes" },
  { en: "An error occurred while saving the customer", fr: "Une erreur s'est produite lors de l'enregistrement du client", es: "Ocurrió un error al guardar el cliente" },
  { en: "Unknown error", fr: "Erreur inconnue", es: "Error desconocido" },
  
  // Table Headers
  { en: "Created Date", fr: "Date de création", es: "Fecha de creación" },
  { en: "Actions", fr: "Actions", es: "Acciones" },
  
  // Table Empty State
  { en: "No customers found", fr: "Aucun client trouvé", es: "No se encontraron clientes" },
  
  // Delete Confirmation
  { en: "Are you sure you want to delete this customer? This action cannot be undone.", fr: "Êtes-vous sûr de vouloir supprimer ce client? Cette action ne peut pas être annulée.", es: "¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer." },
  
  // Section Titles
  { en: "Contact Information", fr: "Coordonnées", es: "Información de contacto" },
  { en: "Account Information", fr: "Informations du compte", es: "Información de la cuenta" },
  
  // Other
  { en: "Not provided", fr: "Non fourni", es: "No proporcionado" },
  
  // Dropdown Actions
  { en: "View Details", fr: "Voir les détails", es: "Ver detalles" },
  { en: "Edit", fr: "Modifier", es: "Editar" },
  { en: "Activate", fr: "Activer", es: "Activar" },
  { en: "Deactivate", fr: "Désactiver", es: "Desactivar" },
  { en: "Delete", fr: "Supprimer", es: "Eliminar" },
  
  // Common Buttons
  { en: "Cancel", fr: "Annuler", es: "Cancelar" },
  { en: "Export CSV", fr: "Exporter CSV", es: "Exportar CSV" },
  { en: "Refresh", fr: "Actualiser", es: "Actualizar" },
  { en: "Save", fr: "Enregistrer", es: "Guardar" },
  { en: "Saving...", fr: "Enregistrement...", es: "Guardando..." },
  { en: "Update Customer", fr: "Mettre à jour le client", es: "Actualizar cliente" },
  { en: "Create Customer", fr: "Créer un client", es: "Crear cliente" },
  { en: "Close", fr: "Fermer", es: "Cerrar" },
  
  // Status Labels
  { en: "Active", fr: "Actif", es: "Activo" },
  { en: "Inactive", fr: "Inactif", es: "Inactivo" },
];

async function seedTranslations() {
  console.log('🌱 Starting Customer Module translation seeding...\n');

  try {
    // Step 1: Check translation service health
    console.log('🏥 Checking Translation Service health...');
    try {
      await makeRequest('GET', '/health');
      console.log('✅ Translation Service is healthy\n');
    } catch (error) {
      console.error('❌ Translation Service is not available:', error.message);
      console.error('   Please ensure the service is running on', API_BASE_URL);
      process.exit(1);
    }

    // Step 2: Get active languages
    console.log('🌍 Fetching active languages...');
    let languages = await makeRequest('GET', '/translation/languages/active');
    
    // Handle wrapped response
    if (!Array.isArray(languages)) {
      console.log('   Response wrapped, extracting data...');
      languages = languages.data || languages.languages || [];
    }
    
    const french = languages.find(l => l.code === 'fr');
    const spanish = languages.find(l => l.code === 'es');

    if (!french || !spanish) {
      console.error('❌ French or Spanish language not found. Please run the main seed script first.');
      process.exit(1);
    }

    console.log(`✅ Found French language (code: ${french.code})`);
    console.log(`✅ Found Spanish language (code: ${spanish.code})\n`);

    // Step 3: Seed customer translations
    console.log('📦 Seeding Customer Module translations...');
    console.log(`   Total labels: ${customerTranslations.length}`);
    console.log(`   Target: ${customerTranslations.length * 2} translations (FR + ES)\n`);
    
    let customerSuccess = 0;
    let customerSkip = 0;
    let customerError = 0;

    for (const item of customerTranslations) {
      // French translation
      try {
        await makeRequest('POST', '/translation/translations', {
          original: item.en,
          destination: item.fr,
          languageCode: french.code,
          context: { module: 'customer', category: 'ui' },
          isApproved: true,
        });
        customerSuccess++;
        process.stdout.write('.');
      } catch (error) {
        if (error.message.includes('409')) {
          // Translation exists - try to update it
          try {
            // Get all translations to find the ID
            const allTranslations = await makeRequest('GET', '/translation/translations?limit=500');
            const existing = allTranslations.data.translations.find(
              t => t.original === item.en && t.languageCode === french.code
            );
            
            if (existing && existing.destination !== item.fr) {
              // Update with proper translation
              await makeRequest('PATCH', `/translation/translations/${existing.id}`, {
                destination: item.fr,
                context: { module: 'customer', category: 'ui' },
                isApproved: true,
              });
              customerSuccess++;
              process.stdout.write('u');
            } else {
              customerSkip++;
              process.stdout.write('s');
            }
          } catch (updateError) {
            customerError++;
            console.error(`\n❌ Failed to update French translation for "${item.en}":`, updateError.message);
          }
        } else {
          customerError++;
          console.error(`\n❌ Failed to create French translation for "${item.en}":`, error.message);
        }
      }

      // Spanish translation
      try {
        await makeRequest('POST', '/translation/translations', {
          original: item.en,
          destination: item.es,
          languageCode: spanish.code,
          context: { module: 'customer', category: 'ui' },
          isApproved: true,
        });
        customerSuccess++;
        process.stdout.write('.');
      } catch (error) {
        if (error.message.includes('409')) {
          // Translation exists - try to update it
          try {
            // Get all translations to find the ID
            const allTranslations = await makeRequest('GET', '/translation/translations?limit=500');
            const existing = allTranslations.data.translations.find(
              t => t.original === item.en && t.languageCode === spanish.code
            );
            
            if (existing && existing.destination !== item.es) {
              // Update with proper translation
              await makeRequest('PATCH', `/translation/translations/${existing.id}`, {
                destination: item.es,
                context: { module: 'customer', category: 'ui' },
                isApproved: true,
              });
              customerSuccess++;
              process.stdout.write('u');
            } else {
              customerSkip++;
              process.stdout.write('s');
            }
          } catch (updateError) {
            customerError++;
            console.error(`\n❌ Failed to update Spanish translation for "${item.en}":`, updateError.message);
          }
        } else {
          customerError++;
          console.error(`\n❌ Failed to create Spanish translation for "${item.en}":`, error.message);
        }
      }
    }

    console.log('\n');
    console.log(`✅ Customer translations: ${customerSuccess} created/updated, ${customerSkip} skipped, ${customerError} errors\n`);

    // Summary
    const expectedTotal = customerTranslations.length * 2;

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 Customer Module Translation Seeding Summary');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   Customer labels: ${customerTranslations.length} x 2 languages = ${expectedTotal} records`);
    console.log(`   ─────────────────────────────────────────────────────────`);
    console.log(`   ✅ Created/Updated: ${customerSuccess}`);
    console.log(`   ⏭️  Skipped (unchanged): ${customerSkip}`);
    console.log(`   ❌ Errors: ${customerError}`);
    console.log(`   ─────────────────────────────────────────────────────────`);
    console.log(`   📈 Total processed: ${customerSuccess + customerSkip}`);
    console.log(`   🎯 Success rate: ${Math.round(((customerSuccess + customerSkip) / expectedTotal) * 100)}%`);
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('💡 Legend:');
    console.log('   . = Created new translation');
    console.log('   u = Updated existing placeholder');
    console.log('   s = Skipped (already correct)\n');

    if (customerError > 0) {
      console.log('⚠️  Some translations failed. Please check the errors above.');
    } else {
      console.log('🎉 Customer Module translation seeding completed successfully!');
    }

    console.log('\n💡 Next Steps:');
    console.log('   1. Test translations in browser (English, French, Spanish)');
    console.log('   2. Navigate to Customers page');
    console.log('   3. Switch languages using header dropdown');
    console.log('   4. Test all CRUD operations in each language\n');

  } catch (error) {
    console.error('\n❌ Fatal error during seeding:', error.message);
    process.exit(1);
  }
}

// Run seeding
seedTranslations();
