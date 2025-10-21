import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { CreateTranslationDto } from "../src/application/dto/create-translation.dto";
import { ManageLanguageUseCase } from "../src/application/use-cases/manage-language.use-case";
import { ManageTranslationUseCase } from "../src/application/use-cases/manage-translation.use-case";

/**
 * Carrier Module Translation Seeding Script
 * 
 * Seeds French and Spanish translations for:
 * - Carrier module labels (78 labels x 2 languages = 156 records)
 * - Shared UI labels (28 labels x 2 languages = 56 records)
 * Total: 212 translation records
 * 
 * Usage: npm run seed:carrier
 */

async function seedCarrierTranslations() {
  console.log("🌱 Starting Carrier & Shared UI translations seeding...");

  const app = await NestFactory.createApplicationContext(AppModule);
  const manageLanguageUseCase = app.get(ManageLanguageUseCase);
  const manageTranslationUseCase = app.get(ManageTranslationUseCase);

  try {
    // Get language IDs
    const languages = await manageLanguageUseCase.getActive();
    const frenchLang = languages.find((l) => l.code === "fr");
    const spanishLang = languages.find((l) => l.code === "es");

    if (!frenchLang || !spanishLang) {
      console.error("❌ French or Spanish language not found. Please run the main seed script first.");
      return;
    }

    console.log(`✅ Found French language (code: ${frenchLang.code})`);
    console.log(`✅ Found Spanish language (code: ${spanishLang.code})`);

    // ============================================
    // CARRIER MODULE TRANSLATIONS
    // ============================================
    console.log("\n📦 Seeding Carrier Module translations...");

    const carrierTranslations = [
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
      { en: "Showing", fr: "Affichage", es: "Mostrando" },
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
    ];

    // ============================================
    // SHARED UI TRANSLATIONS
    // ============================================
    console.log("\n🎨 Seeding Shared UI translations...");

    const sharedUITranslations = [
      // Sorting
      { en: "Sort by:", fr: "Trier par:", es: "Ordenar por:" },
      { en: "Sort by...", fr: "Trier par...", es: "Ordenar por..." },
      { en: "Sort ascending", fr: "Trier par ordre croissant", es: "Ordenar ascendente" },
      { en: "Sort descending", fr: "Trier par ordre décroissant", es: "Ordenar descendente" },

      // Pagination
      { en: "to", fr: "à", es: "a" },
      { en: "results", fr: "résultats", es: "resultados" },
      { en: "per page", fr: "par page", es: "por página" },
      { en: "Show:", fr: "Afficher:", es: "Mostrar:" },
      { en: "Loading...", fr: "Chargement...", es: "Cargando..." },
      { en: "Previous page", fr: "Page précédente", es: "Página anterior" },
      { en: "Next page", fr: "Page suivante", es: "Página siguiente" },
      { en: "Go to page", fr: "Aller à la page", es: "Ir a la página" },

      // States (common across UI)
      { en: "Error", fr: "Erreur", es: "Error" },
      { en: "Success", fr: "Succès", es: "Éxito" },
      { en: "No data available", fr: "Aucune donnée disponible", es: "No hay datos disponibles" },
    ];

    // Helper function to create translations
    const createTranslations = async (
      translations: Array<{ en: string; fr: string; es: string }>,
      module: string
    ) => {
      let successCount = 0;
      let skipCount = 0;

      for (const item of translations) {
        // French translation
        try {
          const frTranslation: CreateTranslationDto = {
            original: item.en,
            destination: item.fr,
            languageCode: frenchLang.code,
            context: { module, category: "ui" },
            isApproved: true,
          };
          await manageTranslationUseCase.create(frTranslation);
          successCount++;
        } catch (error) {
          if (error.status === 409) {
            skipCount++;
          } else {
            console.error(`❌ Failed to create French translation for "${item.en}": ${error.message}`);
          }
        }

        // Spanish translation
        try {
          const esTranslation: CreateTranslationDto = {
            original: item.en,
            destination: item.es,
            languageCode: spanishLang.code,
            context: { module, category: "ui" },
            isApproved: true,
          };
          await manageTranslationUseCase.create(esTranslation);
          successCount++;
        } catch (error) {
          if (error.status === 409) {
            skipCount++;
          } else {
            console.error(`❌ Failed to create Spanish translation for "${item.en}": ${error.message}`);
          }
        }
      }

      return { successCount, skipCount };
    };

    // Seed carrier translations
    const carrierResult = await createTranslations(carrierTranslations, "carriers");
    console.log(`✅ Carrier translations: ${carrierResult.successCount} created, ${carrierResult.skipCount} skipped`);

    // Seed shared UI translations
    const sharedUIResult = await createTranslations(sharedUITranslations, "shared-ui");
    console.log(`✅ Shared UI translations: ${sharedUIResult.successCount} created, ${sharedUIResult.skipCount} skipped`);

    // Summary
    const totalSuccess = carrierResult.successCount + sharedUIResult.successCount;
    const totalSkip = carrierResult.skipCount + sharedUIResult.skipCount;
    
    console.log("\n📊 Seeding Summary:");
    console.log(`   Carrier labels: ${carrierTranslations.length} x 2 languages = ${carrierTranslations.length * 2} records`);
    console.log(`   Shared UI labels: ${sharedUITranslations.length} x 2 languages = ${sharedUITranslations.length * 2} records`);
    console.log(`   ----------------------------------------`);
    console.log(`   Total expected: ${(carrierTranslations.length + sharedUITranslations.length) * 2} records`);
    console.log(`   Created: ${totalSuccess}`);
    console.log(`   Skipped (already exist): ${totalSkip}`);

    // Get final counts
    const translationCount = await manageTranslationUseCase.getCount();
    console.log(`\n📊 Total translations in database: ${translationCount.count}`);

    console.log("\n🎉 Carrier & Shared UI translation seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run seeding
seedCarrierTranslations().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
