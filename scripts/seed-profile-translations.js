/**
 * User Profile Module Translation Seeding Script (API-based)
 * 
 * This script seeds User Profile module translations via the Translation Service HTTP API.
 * It creates French and Spanish translations for all 60+ Profile module labels.
 * 
 * Usage: node scripts/seed-profile-translations.js
 */

const http = require('http');

// Configuration
const API_BASE_URL = process.env.TRANSLATION_SERVICE_URL || 'http://localhost:3007';
const API_PATH_PREFIX = '/api/v1/translation';

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

// Profile Module Translation Data (60+ labels x 2 languages = 120+ translations)
const profileTranslations = [
  // Tab Labels
  { en: "User Details", fr: "Détails de l'utilisateur", es: "Detalles del usuario" },
  { en: "Profile", fr: "Profil", es: "Perfil" },

  // Section Headers
  { en: "Basic Information", fr: "Informations de base", es: "Información básica" },
  { en: "Address", fr: "Adresse", es: "Dirección" },
  { en: "Social Links", fr: "Liens sociaux", es: "Enlaces sociales" },
  { en: "Preferences", fr: "Préférences", es: "Preferencias" },
  { en: "Metadata", fr: "Métadonnées", es: "Metadatos" },

  // Field Labels
  { en: "Date of Birth", fr: "Date de naissance", es: "Fecha de nacimiento" },
  { en: "Age", fr: "Âge", es: "Edad" },
  { en: "Biography", fr: "Biographie", es: "Biografía" },
  { en: "Avatar URL", fr: "URL de l'avatar", es: "URL del avatar" },
  { en: "Street Address", fr: "Adresse", es: "Dirección" },
  { en: "City", fr: "Ville", es: "Ciudad" },
  { en: "State/Province", fr: "État/Province", es: "Estado/Provincia" },
  { en: "Zip/Postal Code", fr: "Code postal", es: "Código postal" },
  { en: "Country", fr: "Pays", es: "País" },
  { en: "LinkedIn Profile", fr: "Profil LinkedIn", es: "Perfil de LinkedIn" },
  { en: "GitHub Profile", fr: "Profil GitHub", es: "Perfil de GitHub" },
  { en: "Twitter Handle", fr: "Compte Twitter", es: "Usuario de Twitter" },
  { en: "Personal Website", fr: "Site web personnel", es: "Sitio web personal" },
  { en: "Created", fr: "Créé", es: "Creado" },
  { en: "Last Updated", fr: "Dernière mise à jour", es: "Última actualización" },

  // Placeholder Text
  { en: "Tell us about yourself...", fr: "Parlez-nous de vous...", es: "Cuéntanos sobre ti..." },
  { en: "https://example.com/avatar.jpg", fr: "https://exemple.com/avatar.jpg", es: "https://ejemplo.com/avatar.jpg" },
  { en: "123 Main St", fr: "123 Rue Principale", es: "Calle Principal 123" },
  { en: "San Francisco", fr: "San Francisco", es: "San Francisco" },
  { en: "CA", fr: "CA", es: "CA" },
  { en: "94105", fr: "94105", es: "94105" },
  { en: "USA", fr: "États-Unis", es: "EE.UU." },
  { en: "https://linkedin.com/in/yourprofile", fr: "https://linkedin.com/in/votreprofil", es: "https://linkedin.com/in/tuperfil" },
  { en: "https://github.com/yourusername", fr: "https://github.com/votrenom", es: "https://github.com/tuusuario" },
  { en: "https://twitter.com/yourhandle", fr: "https://twitter.com/votrecompte", es: "https://twitter.com/tuusuario" },
  { en: "https://yourwebsite.com", fr: "https://votresite.com", es: "https://tusitioweb.com" },

  // Action Labels
  { en: "Create Profile", fr: "Créer un profil", es: "Crear perfil" },
  { en: "Edit Profile", fr: "Modifier le profil", es: "Editar perfil" },
  { en: "Update Profile", fr: "Mettre à jour le profil", es: "Actualizar perfil" },
  { en: "Cancel", fr: "Annuler", es: "Cancelar" },
  { en: "Save", fr: "Enregistrer", es: "Guardar" },
  { en: "Saving...", fr: "Enregistrement...", es: "Guardando..." },
  { en: "Close", fr: "Fermer", es: "Cerrar" },

  // Messages
  { en: "No profile information yet", fr: "Aucune information de profil pour le moment", es: "Aún no hay información de perfil" },
  { en: "Loading profile...", fr: "Chargement du profil...", es: "Cargando perfil..." },
  { en: "Profile created successfully", fr: "Profil créé avec succès", es: "Perfil creado exitosamente" },
  { en: "Profile updated successfully", fr: "Profil mis à jour avec succès", es: "Perfil actualizado exitosamente" },
  { en: "Failed to save profile", fr: "Échec de l'enregistrement du profil", es: "Error al guardar el perfil" },
  { en: "characters", fr: "caractères", es: "caracteres" },
  { en: "Character limit exceeded", fr: "Limite de caractères dépassée", es: "Límite de caracteres excedido" },

  // Validation Messages
  { en: "Please enter a valid URL", fr: "Veuillez entrer une URL valide", es: "Por favor ingrese una URL válida" },
  { en: "Please enter a valid date", fr: "Veuillez entrer une date valide", es: "Por favor ingrese una fecha válida" },
  { en: "Biography is too long (max 500 characters)", fr: "La biographie est trop longue (max 500 caractères)", es: "La biografía es demasiado larga (máx 500 caracteres)" },
  { en: "This field is required", fr: "Ce champ est requis", es: "Este campo es obligatorio" },

  // Help Text
  { en: "Tell us a little about yourself (max 500 characters)", fr: "Parlez-nous un peu de vous (max 500 caractères)", es: "Cuéntanos un poco sobre ti (máx 500 caracteres)" },
  { en: "URL to your profile picture or avatar image", fr: "URL de votre photo de profil ou image d'avatar", es: "URL de tu foto de perfil o imagen de avatar" },
  { en: "Your date of birth (optional)", fr: "Votre date de naissance (optionnel)", es: "Tu fecha de nacimiento (opcional)" },
  { en: "Your current residential address", fr: "Votre adresse de résidence actuelle", es: "Tu dirección de residencia actual" },
  { en: "Links to your social media profiles and personal website", fr: "Liens vers vos profils de réseaux sociaux et site web personnel", es: "Enlaces a tus perfiles de redes sociales y sitio web personal" },

  // Age Display
  { en: "years old", fr: "ans", es: "años" },
];

/**
 * Seeds all profile translations for both French and Spanish
 */
async function seedProfileTranslations() {
  console.log('🌱 Starting Profile Module Translation Seeding...\n');

  let totalCreated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  // Seed French translations
  console.log('📝 Seeding French (fr) translations...');
  for (const item of profileTranslations) {
    try {
      const payload = {
        original: item.en,
        destination: item.fr,
        languageCode: 'fr',
        context: {
          module: 'profile',
        },
        isApproved: true,
      };

      await makeRequest('POST', '/translations', payload);
      totalCreated++;
      process.stdout.write('.');
    } catch (error) {
      if (error.message.includes('409') || error.message.includes('already exists')) {
        totalSkipped++;
        process.stdout.write('s');
      } else {
        totalErrors++;
        process.stdout.write('x');
        console.error(`\n❌ Error creating French translation for "${item.en}": ${error.message}`);
      }
    }
  }
  console.log('\n✅ French translations completed\n');

  // Seed Spanish translations
  console.log('📝 Seeding Spanish (es) translations...');
  for (const item of profileTranslations) {
    try {
      const payload = {
        original: item.en,
        destination: item.es,
        languageCode: 'es',
        context: {
          module: 'profile',
        },
        isApproved: true,
      };

      await makeRequest('POST', '/translations', payload);
      totalCreated++;
      process.stdout.write('.');
    } catch (error) {
      if (error.message.includes('409') || error.message.includes('already exists')) {
        totalSkipped++;
        process.stdout.write('s');
      } else {
        totalErrors++;
        process.stdout.write('x');
        console.error(`\n❌ Error creating Spanish translation for "${item.es}": ${error.message}`);
      }
    }
  }
  console.log('\n✅ Spanish translations completed\n');

  // Summary
  console.log('═══════════════════════════════════════════════');
  console.log('📊 Profile Translation Seeding Summary');
  console.log('═══════════════════════════════════════════════');
  console.log(`✅ Created:  ${totalCreated} translations`);
  console.log(`⏭️  Skipped:  ${totalSkipped} (already exist)`);
  console.log(`❌ Errors:   ${totalErrors}`);
  console.log(`📦 Total:    ${profileTranslations.length * 2} translations (${profileTranslations.length} labels x 2 languages)`);
  console.log('═══════════════════════════════════════════════\n');

  if (totalErrors > 0) {
    console.log('⚠️  Some translations failed. Check the error messages above.');
    process.exit(1);
  }

  console.log('🎉 Profile translation seeding completed successfully!');
}

// Run the seeding script
seedProfileTranslations().catch((error) => {
  console.error('\n💥 Fatal error during seeding:', error.message);
  process.exit(1);
});
