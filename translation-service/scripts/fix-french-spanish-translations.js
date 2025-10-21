/**
 * Fix French and Spanish Translations
 * 
 * This script deletes translations with [FR] and [ES] prefixes and re-seeds with correct translations.
 * 
 * Usage: node scripts/fix-french-spanish-translations.js
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
          const response = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else if (res.statusCode === 409) {
            // Conflict - translation already exists, try to update it
            resolve({ conflict: true, message: 'Already exists' });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({});
          } else {
            reject(new Error(`Failed to parse response: ${body}`));
          }
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

// All translation data with CORRECT French and Spanish
const allTranslations = [
  // === CARRIER MODULE ===
  // Page titles
  { en: "Carriers", fr: "Transporteurs", es: "Transportistas" },
  { en: "Manage your carrier partners", fr: "Gérez vos partenaires transporteurs", es: "Gestione sus socios transportistas" },

  // Actions  
  { en: "Add Carrier", fr: "Ajouter un transporteur", es: "Agregar transportista" },
  { en: "Edit", fr: "Modifier", es: "Editar" },
  { en: "View", fr: "Voir", es: "Ver" },
  { en: "Delete", fr: "Supprimer", es: "Eliminar" },
  { en: "Activate", fr: "Activer", es: "Activar" },
  { en: "Deactivate", fr: "Désactiver", es: "Desactivar" },
  { en: "Export CSV", fr: "Exporter CSV", es: "Exportar CSV" },
  { en: "Refresh", fr: "Actualiser", es: "Actualizar" },
  { en: "Close", fr: "Fermer", es: "Cerrar" },
  { en: "Save", fr: "Enregistrer", es: "Guardar" },
  { en: "Cancel", fr: "Annuler", es: "Cancelar" },
  { en: "Saving...", fr: "Enregistrement...", es: "Guardando..." },
  { en: "Create Carrier", fr: "Créer un transporteur", es: "Crear transportista" },
  { en: "Update Carrier", fr: "Mettre à jour le transporteur", es: "Actualizar transportista" },

  // Table headers
  { en: "Name", fr: "Nom", es: "Nombre" },
  { en: "Phone", fr: "Téléphone", es: "Teléfono" },
  { en: "Code", fr: "Code", es: "Código" },
  { en: "Description", fr: "Description", es: "Descripción" },
  { en: "Status", fr: "Statut", es: "Estado" },
  { en: "Created", fr: "Créé", es: "Creado" },
  { en: "Actions", fr: "Actions", es: "Acciones" },
  { en: "Email", fr: "E-mail", es: "Correo electrónico" },
  { en: "Last Updated", fr: "Dernière mise à jour", es: "Última actualización" },
  { en: "No carriers found", fr: "Aucun transporteur trouvé", es: "No se encontraron transportistas" },
  { en: "Showing", fr: "Affichage de", es: "Mostrando" },
  { en: "of", fr: "sur", es: "de" },

  // Status
  { en: "Active", fr: "Actif", es: "Activo" },
  { en: "Inactive", fr: "Inactif", es: "Inactivo" },

  // Sections
  { en: "Carrier Information", fr: "Informations sur le transporteur", es: "Información del transportista" },
  { en: "Contact Information", fr: "Coordonnées", es: "Información de contacto" },
  { en: "Account Information", fr: "Informations du compte", es: "Información de la cuenta" },

  // Fields
  { en: "Contact Email", fr: "E-mail de contact", es: "Correo de contacto" },
  { en: "Contact Phone", fr: "Téléphone de contact", es: "Teléfono de contacto" },
  { en: "Carrier ID", fr: "ID du transporteur", es: "ID del transportista" },

  // Placeholders
  { en: "Search carriers by name, email, or code...", fr: "Rechercher des transporteurs par nom, e-mail ou code...", es: "Buscar transportistas por nombre, correo o código..." },
  { en: "Not provided", fr: "Non fourni", es: "No proporcionado" },
  { en: "No description provided", fr: "Aucune description fournie", es: "Sin descripción" },
  { en: "Enter carrier name", fr: "Entrez le nom du transporteur", es: "Ingrese el nombre del transportista" },
  { en: "Enter carrier code (e.g., UPS, FEDEX)", fr: "Entrez le code du transporteur (par ex. UPS, FEDEX)", es: "Ingrese el código del transportista (ej. UPS, FEDEX)" },
  { en: "Enter contact email", fr: "Entrez l'e-mail de contact", es: "Ingrese el correo de contacto" },
  { en: "Enter contact phone", fr: "Entrez le téléphone de contact", es: "Ingrese el teléfono de contacto" },
  { en: "Enter description (optional)", fr: "Entrez la description (optionnel)", es: "Ingrese descripción (opcional)" },

  // Modals
  { en: "Create New Carrier", fr: "Créer un nouveau transporteur", es: "Crear nuevo transportista" },
  { en: "Edit Carrier", fr: "Modifier le transporteur", es: "Editar transportista" },
  { en: "Carrier Details", fr: "Détails du transporteur", es: "Detalles del transportista" },
  { en: "Delete Carrier", fr: "Supprimer le transporteur", es: "Eliminar transportista" },
  { en: "Are you sure you want to delete this carrier?", fr: "Êtes-vous sûr de vouloir supprimer ce transporteur?", es: "¿Está seguro de que desea eliminar este transportista?" },

  // Messages
  { en: "Carrier created successfully", fr: "Transporteur créé avec succès", es: "Transportista creado exitosamente" },
  { en: "Failed to create carrier", fr: "Échec de la création du transporteur", es: "Error al crear transportista" },
  { en: "Carrier updated successfully", fr: "Transporteur mis à jour avec succès", es: "Transportista actualizado exitosamente" },
  { en: "Failed to update carrier", fr: "Échec de la mise à jour du transporteur", es: "Error al actualizar transportista" },
  { en: "Carrier deleted successfully", fr: "Transporteur supprimé avec succès", es: "Transportista eliminado exitosamente" },
  { en: "Failed to delete carrier", fr: "Échec de la suppression du transporteur", es: "Error al eliminar transportista" },
  { en: "Carrier activated", fr: "Transporteur activé", es: "Transportista activado" },
  { en: "Carrier deactivated", fr: "Transporteur désactivé", es: "Transportista desactivado" },
  { en: "Failed to toggle carrier status", fr: "Échec du changement de statut du transporteur", es: "Error al cambiar estado del transportista" },
  { en: "Carriers exported successfully", fr: "Transporteurs exportés avec succès", es: "Transportistas exportados exitosamente" },
  { en: "Failed to export carriers", fr: "Échec de l'exportation des transporteurs", es: "Error al exportar transportistas" },
  { en: "Failed to load carriers", fr: "Échec du chargement des transporteurs", es: "Error al cargar transportistas" },

  // Sort options
  { en: "Created Date", fr: "Date de création", es: "Fecha de creación" },

  // Validation
  { en: "Name is required", fr: "Le nom est requis", es: "El nombre es obligatorio" },
  { en: "Code is required", fr: "Le code est requis", es: "El código es obligatorio" },
  { en: "Code must contain only uppercase letters, numbers, and hyphens", fr: "Le code ne doit contenir que des lettres majuscules, des chiffres et des tirets", es: "El código debe contener solo letras mayúsculas, números y guiones" },
  { en: "Invalid email format", fr: "Format d'e-mail invalide", es: "Formato de correo inválido" },
  { en: "Invalid phone format", fr: "Format de téléphone invalide", es: "Formato de teléfono inválido" },

  // === SHARED UI ===
  // Sorting
  { en: "Sort by:", fr: "Trier par :", es: "Ordenar por:" },
  { en: "Sort by...", fr: "Trier par...", es: "Ordenar por..." },
  { en: "Sort ascending", fr: "Trier par ordre croissant", es: "Ordenar ascendente" },
  { en: "Sort descending", fr: "Trier par ordre décroissant", es: "Ordenar descendente" },

  // Pagination
  { en: "to", fr: "à", es: "a" },
  { en: "results", fr: "résultats", es: "resultados" },
  { en: "per page", fr: "par page", es: "por página" },
  { en: "Show:", fr: "Afficher :", es: "Mostrar:" },
  { en: "Loading...", fr: "Chargement...", es: "Cargando..." },
  { en: "Previous page", fr: "Page précédente", es: "Página anterior" },
  { en: "Next page", fr: "Page suivante", es: "Página siguiente" },
  { en: "Go to page", fr: "Aller à la page", es: "Ir a la página" },

  // States
  { en: "Error", fr: "Erreur", es: "Error" },
  { en: "Success", fr: "Succès", es: "Éxito" },
  { en: "No data available", fr: "Aucune donnée disponible", es: "No hay datos disponibles" },
];

async function fixTranslations() {
  console.log('🔧 Starting translation fix process...\n');
  
  try {
    // Step 1: Check service health
    console.log('🏥 Checking Translation Service health...');
    await makeRequest('GET', '/health');
    console.log('✅ Translation Service is healthy\n');

    // Step 2: Get active languages
    console.log('🌍 Fetching active languages...');
    let languagesResponse = await makeRequest('GET', '/translation/languages/active');
    
    // Handle wrapped response
    let languages = [];
    if (Array.isArray(languagesResponse)) {
      languages = languagesResponse;
    } else if (languagesResponse.data) {
      languages = Array.isArray(languagesResponse.data) ? languagesResponse.data : [languagesResponse.data];
    } else if (languagesResponse.languages) {
      languages = Array.isArray(languagesResponse.languages) ? languagesResponse.languages : [languagesResponse.languages];
    }
    
    const french = languages.find(l => l.code === 'fr');
    const spanish = languages.find(l => l.code === 'es');

    if (!french || !spanish) {
      console.error('❌ French or Spanish language not found');
      console.log('Languages found:', languages);
      process.exit(1);
    }

    console.log(`✅ Found French (id: ${french.id || 'N/A'}) and Spanish (id: ${spanish.id || 'N/A'})\n`);

    // Step 3: Get all existing translations
    console.log('📋 Fetching existing translations...');
    const existingTranslations = await makeRequest('GET', '/translation/translations?limit=1000');
    
    // Handle response structure
    let translationList = [];
    if (existingTranslations.translations) {
      translationList = existingTranslations.translations;
    } else if (existingTranslations.data && existingTranslations.data.translations) {
      translationList = existingTranslations.data.translations;
    } else if (Array.isArray(existingTranslations.data)) {
      translationList = existingTranslations.data;
    }
    
    console.log(`Found ${translationList.length} existing translations\n`);

    // Step 4: Find and delete [FR] and [ES] prefixed translations
    console.log('🗑️  Deleting incorrect translations with [FR] and [ES] prefixes...');
    
    const toDelete = translationList.filter(t => 
      t.destination && (t.destination.startsWith('[FR]') || t.destination.startsWith('[ES]'))
    );
    
    console.log(`Found ${toDelete.length} incorrect translations to delete`);
    
    let deleted = 0;
    for (const translation of toDelete) {
      try {
        await makeRequest('DELETE', `/translation/translations/${translation.id}`);
        deleted++;
        if (deleted % 10 === 0) {
          process.stdout.write(`\r   Deleted ${deleted}/${toDelete.length}...`);
        }
      } catch (error) {
        console.log(`\n   ⚠️  Failed to delete translation ${translation.id}: ${error.message}`);
      }
    }
    
    if (deleted > 0) {
      console.log(`\n✅ Deleted ${deleted} incorrect translations\n`);
    } else {
      console.log('   No incorrect translations found to delete\n');
    }

    // Step 5: Seed correct translations
    console.log('🌱 Seeding correct French and Spanish translations...\n');
    
    let frenchCreated = 0;
    let frenchSkipped = 0;
    let spanishCreated = 0;
    let spanishSkipped = 0;

    for (const translation of allTranslations) {
      // French
      try {
        const frData = {
          original: translation.en,
          destination: translation.fr,
          languageCode: french.code,
          context: { module: 'carriers', category: 'ui' },
          isApproved: true,
        };
        
        const result = await makeRequest('POST', '/translation/translations', frData);
        if (result.conflict) {
          frenchSkipped++;
        } else {
          frenchCreated++;
        }
      } catch (error) {
        if (error.message.includes('409')) {
          frenchSkipped++;
        } else {
          console.log(`   ⚠️  Failed to create French translation for "${translation.en}": ${error.message}`);
        }
      }

      // Spanish
      try {
        const esData = {
          original: translation.en,
          destination: translation.es,
          languageCode: spanish.code,
          context: { module: 'carriers', category: 'ui' },
          isApproved: true,
        };
        
        const result = await makeRequest('POST', '/translation/translations', esData);
        if (result.conflict) {
          spanishSkipped++;
        } else {
          spanishCreated++;
        }
      } catch (error) {
        if (error.message.includes('409')) {
          spanishSkipped++;
        } else {
          console.log(`   ⚠️  Failed to create Spanish translation for "${translation.en}": ${error.message}`);
        }
      }

      // Progress indicator
      const current = frenchCreated + frenchSkipped;
      if (current % 10 === 0) {
        process.stdout.write(`\r   Processing: ${current}/${allTranslations.length} labels...`);
      }
    }

    console.log(`\n✅ French translations: ${frenchCreated} created, ${frenchSkipped} skipped`);
    console.log(`✅ Spanish translations: ${spanishCreated} created, ${spanishSkipped} skipped`);

    // Step 6: Clear cache
    console.log('\n🧹 Clearing translation cache...');
    try {
      await makeRequest('POST', '/translation/cache/clear');
      console.log('✅ Cache cleared successfully');
    } catch (error) {
      console.log('⚠️  Cache clear failed (endpoint may not exist):', error.message);
    }

    console.log('\n🎉 Translation fix completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   - Deleted: ${deleted} incorrect translations`);
    console.log(`   - Created: ${frenchCreated + spanishCreated} new correct translations`);
    console.log(`   - Skipped: ${frenchSkipped + spanishSkipped} already correct translations`);
    console.log(`   - Total labels: ${allTranslations.length}`);
    console.log('\n💡 Please refresh your browser to see the correct translations!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the fix
fixTranslations();
