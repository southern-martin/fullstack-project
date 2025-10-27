#!/usr/bin/env ts-node

/**
 * Role Module Translation Seeding Script
 *
 * This script seeds French and Spanish translations for all Role module labels.
 * Run this to populate the translation database with role-related text.
 *
 * Usage:
 *   ts-node seed-role-translations.ts
 *
 * Or via npm:
 *   npm run seed:role-translations
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
 * Role Module Translations
 * Organized by category matching role-labels.ts structure
 */
const roleTranslations: TranslationPair[] = [
  // Page Headers
  {
    sourceText: 'Roles & Permissions',
    french: 'Rôles et permissions',
    spanish: 'Roles y permisos',
  },
  {
    sourceText: 'Manage user roles and access permissions',
    french: "Gérer les rôles utilisateurs et les permissions d'accès",
    spanish: 'Administrar roles de usuario y permisos de acceso',
  },
  { sourceText: 'Roles', french: 'Rôles', spanish: 'Roles' },
  {
    sourceText: 'Create New Role',
    french: 'Créer un nouveau rôle',
    spanish: 'Crear nuevo rol',
  },
  {
    sourceText: 'Edit Role',
    french: 'Modifier le rôle',
    spanish: 'Editar rol',
  },
  {
    sourceText: 'Role Details',
    french: 'Détails du rôle',
    spanish: 'Detalles del rol',
  },

  // Table Headers
  { sourceText: 'Role Name', french: 'Nom du rôle', spanish: 'Nombre del rol' },
  { sourceText: 'Description', french: 'Description', spanish: 'Descripción' },
  { sourceText: 'Permissions', french: 'Permissions', spanish: 'Permisos' },
  { sourceText: 'Users', french: 'Utilisateurs', spanish: 'Usuarios' },
  { sourceText: 'Created', french: 'Créé', spanish: 'Creado' },
  {
    sourceText: 'Last Updated',
    french: 'Dernière mise à jour',
    spanish: 'Última actualización',
  },
  { sourceText: 'Actions', french: 'Actions', spanish: 'Acciones' },

  // Form Fields
  {
    sourceText: 'Enter role name (e.g., Admin, Manager)',
    french: 'Entrez le nom du rôle (ex. Admin, Manager)',
    spanish: 'Ingrese el nombre del rol (ej. Admin, Gerente)',
  },
  {
    sourceText: 'Describe the purpose of this role',
    french: "Décrivez l'objectif de ce rôle",
    spanish: 'Describa el propósito de este rol',
  },
  {
    sourceText: 'Select permissions for this role',
    french: 'Sélectionnez les permissions pour ce rôle',
    spanish: 'Seleccione permisos para este rol',
  },
  {
    sourceText: 'Inactive roles cannot be assigned to users',
    french: 'Les rôles inactifs ne peuvent pas être attribués aux utilisateurs',
    spanish: 'Los roles inactivos no se pueden asignar a usuarios',
  },

  // Buttons
  { sourceText: 'Create Role', french: 'Créer un rôle', spanish: 'Crear rol' },
  {
    sourceText: 'Save Role',
    french: 'Enregistrer le rôle',
    spanish: 'Guardar rol',
  },
  { sourceText: 'Cancel', french: 'Annuler', spanish: 'Cancelar' },
  {
    sourceText: 'Delete Role',
    french: 'Supprimer le rôle',
    spanish: 'Eliminar rol',
  },
  {
    sourceText: 'View Details',
    french: 'Voir les détails',
    spanish: 'Ver detalles',
  },
  {
    sourceText: 'Assign Permissions',
    french: 'Attribuer des permissions',
    spanish: 'Asignar permisos',
  },
  {
    sourceText: 'Manage Users',
    french: 'Gérer les utilisateurs',
    spanish: 'Administrar usuarios',
  },
  {
    sourceText: 'Back to Roles',
    french: 'Retour aux rôles',
    spanish: 'Volver a roles',
  },

  // Status
  { sourceText: 'Active', french: 'Actif', spanish: 'Activo' },
  { sourceText: 'Inactive', french: 'Inactif', spanish: 'Inactivo' },

  // Permissions Section
  {
    sourceText: 'Select All',
    french: 'Tout sélectionner',
    spanish: 'Seleccionar todo',
  },
  {
    sourceText: 'Deselect All',
    french: 'Tout désélectionner',
    spanish: 'Deseleccionar todo',
  },
  {
    sourceText: 'permission(s) selected',
    french: 'permission(s) sélectionnée(s)',
    spanish: 'permiso(s) seleccionado(s)',
  },
  {
    sourceText: 'No permissions assigned',
    french: 'Aucune permission attribuée',
    spanish: 'No hay permisos asignados',
  },
  { sourceText: 'View', french: 'Voir', spanish: 'Ver' },
  { sourceText: 'Create', french: 'Créer', spanish: 'Crear' },
  { sourceText: 'Update', french: 'Mettre à jour', spanish: 'Actualizar' },
  { sourceText: 'Delete', french: 'Supprimer', spanish: 'Eliminar' },
  {
    sourceText: 'Full Management',
    french: 'Gestion complète',
    spanish: 'Gestión completa',
  },

  // Permission Categories
  {
    sourceText: 'User Management',
    french: 'Gestion des utilisateurs',
    spanish: 'Gestión de usuarios',
  },
  {
    sourceText: 'Role Management',
    french: 'Gestion des rôles',
    spanish: 'Gestión de roles',
  },
  {
    sourceText: 'System Administration',
    french: 'Administration système',
    spanish: 'Administración del sistema',
  },
  {
    sourceText: 'Content Management',
    french: 'Gestion de contenu',
    spanish: 'Gestión de contenido',
  },
  {
    sourceText: 'Analytics & Reports',
    french: 'Analytique et rapports',
    spanish: 'Análisis e informes',
  },
  { sourceText: 'Settings', french: 'Paramètres', spanish: 'Configuración' },
  {
    sourceText: 'Carrier Management',
    french: 'Gestion des transporteurs',
    spanish: 'Gestión de transportistas',
  },
  {
    sourceText: 'Customer Management',
    french: 'Gestion des clients',
    spanish: 'Gestión de clientes',
  },
  {
    sourceText: 'Pricing Management',
    french: 'Gestion des prix',
    spanish: 'Gestión de precios',
  },

  // Toast Messages
  {
    sourceText: 'Role created successfully',
    french: 'Rôle créé avec succès',
    spanish: 'Rol creado exitosamente',
  },
  {
    sourceText: 'Role updated successfully',
    french: 'Rôle mis à jour avec succès',
    spanish: 'Rol actualizado exitosamente',
  },
  {
    sourceText: 'Role deleted successfully',
    french: 'Rôle supprimé avec succès',
    spanish: 'Rol eliminado exitosamente',
  },
  {
    sourceText: 'Are you sure you want to delete this role?',
    french: 'Êtes-vous sûr de vouloir supprimer ce rôle ?',
    spanish: '¿Está seguro de que desea eliminar este rol?',
  },
  {
    sourceText:
      'This role is assigned to users. Deleting it will remove the role from all users.',
    french:
      'Ce rôle est attribué à des utilisateurs. Le supprimer le retirera de tous les utilisateurs.',
    spanish:
      'Este rol está asignado a usuarios. Eliminarlo lo quitará de todos los usuarios.',
  },
  {
    sourceText: 'No roles found',
    french: 'Aucun rôle trouvé',
    spanish: 'No se encontraron roles',
  },
  {
    sourceText: 'Loading roles...',
    french: 'Chargement des rôles...',
    spanish: 'Cargando roles...',
  },
  {
    sourceText: 'Failed to load roles',
    french: 'Échec du chargement des rôles',
    spanish: 'Error al cargar los roles',
  },
  {
    sourceText: 'Failed to create role',
    french: 'Échec de la création du rôle',
    spanish: 'Error al crear el rol',
  },
  {
    sourceText: 'Failed to update role',
    french: 'Échec de la mise à jour du rôle',
    spanish: 'Error al actualizar el rol',
  },
  {
    sourceText: 'Failed to delete role',
    french: 'Échec de la suppression du rôle',
    spanish: 'Error al eliminar el rol',
  },
  {
    sourceText: 'Permissions assigned successfully',
    french: 'Permissions attribuées avec succès',
    spanish: 'Permisos asignados exitosamente',
  },
  {
    sourceText: 'Failed to assign permissions',
    french: "Échec de l'attribution des permissions",
    spanish: 'Error al asignar permisos',
  },

  // Validation
  {
    sourceText: 'Role name is required',
    french: 'Le nom du rôle est requis',
    spanish: 'El nombre del rol es obligatorio',
  },
  {
    sourceText: 'Role name must be at least 2 characters',
    french: 'Le nom du rôle doit contenir au moins 2 caractères',
    spanish: 'El nombre del rol debe tener al menos 2 caracteres',
  },
  {
    sourceText: 'Role name must not exceed 50 characters',
    french: 'Le nom du rôle ne doit pas dépasser 50 caractères',
    spanish: 'El nombre del rol no debe exceder 50 caracteres',
  },
  {
    sourceText: 'A role with this name already exists',
    french: 'Un rôle avec ce nom existe déjà',
    spanish: 'Ya existe un rol con este nombre',
  },
  {
    sourceText: 'Description must not exceed 200 characters',
    french: 'La description ne doit pas dépasser 200 caractères',
    spanish: 'La descripción no debe exceder 200 caracteres',
  },
  {
    sourceText: 'Please select at least one permission',
    french: 'Veuillez sélectionner au moins une permission',
    spanish: 'Seleccione al menos un permiso',
  },

  // Details View
  {
    sourceText: 'Role Information',
    french: 'Informations du rôle',
    spanish: 'Información del rol',
  },
  {
    sourceText: 'Assigned Permissions',
    french: 'Permissions attribuées',
    spanish: 'Permisos asignados',
  },
  {
    sourceText: 'Users with this Role',
    french: 'Utilisateurs avec ce rôle',
    spanish: 'Usuarios con este rol',
  },
  { sourceText: 'Statistics', french: 'Statistiques', spanish: 'Estadísticas' },
  {
    sourceText: 'Total Permissions',
    french: 'Total des permissions',
    spanish: 'Total de permisos',
  },
  {
    sourceText: 'Total Users',
    french: 'Total des utilisateurs',
    spanish: 'Total de usuarios',
  },
  { sourceText: 'Created By', french: 'Créé par', spanish: 'Creado por' },
  {
    sourceText: 'Last Modified By',
    french: 'Dernière modification par',
    spanish: 'Última modificación por',
  },
  {
    sourceText: 'No users assigned to this role yet',
    french: 'Aucun utilisateur attribué à ce rôle pour le moment',
    spanish: 'Ningún usuario asignado a este rol aún',
  },

  // Stats
  {
    sourceText: 'Total Roles',
    french: 'Total des rôles',
    spanish: 'Total de roles',
  },
  {
    sourceText: 'Active Roles',
    french: 'Rôles actifs',
    spanish: 'Roles activos',
  },
  {
    sourceText: 'Inactive Roles',
    french: 'Rôles inactifs',
    spanish: 'Roles inactivos',
  },
  {
    sourceText: 'Roles in Use',
    french: "Rôles en cours d'utilisation",
    spanish: 'Roles en uso',
  },

  // Search & Filters
  {
    sourceText: 'Search roles by name or description...',
    french: 'Rechercher des rôles par nom ou description...',
    spanish: 'Buscar roles por nombre o descripción...',
  },
  {
    sourceText: 'No roles match your search',
    french: 'Aucun rôle ne correspond à votre recherche',
    spanish: 'Ningún rol coincide con su búsqueda',
  },
  {
    sourceText: 'Filter by Status',
    french: 'Filtrer par statut',
    spanish: 'Filtrar por estado',
  },
  {
    sourceText: 'All Roles',
    french: 'Tous les rôles',
    spanish: 'Todos los roles',
  },
  {
    sourceText: 'Active Only',
    french: 'Actifs uniquement',
    spanish: 'Solo activos',
  },
  {
    sourceText: 'Inactive Only',
    french: 'Inactifs uniquement',
    spanish: 'Solo inactivos',
  },
  { sourceText: 'Sort By', french: 'Trier par', spanish: 'Ordenar por' },
  { sourceText: 'Name (A-Z)', french: 'Nom (A-Z)', spanish: 'Nombre (A-Z)' },
  { sourceText: 'Name (Z-A)', french: 'Nom (Z-A)', spanish: 'Nombre (Z-A)' },
  {
    sourceText: 'Newest First',
    french: "Plus récent d'abord",
    spanish: 'Más reciente primero',
  },
  {
    sourceText: 'Oldest First',
    french: "Plus ancien d'abord",
    spanish: 'Más antiguo primero',
  },
  {
    sourceText: 'Most Users',
    french: "Plus d'utilisateurs",
    spanish: 'Más usuarios',
  },

  // Empty States
  {
    sourceText: 'No Roles Yet',
    french: 'Aucun rôle pour le moment',
    spanish: 'Aún no hay roles',
  },
  {
    sourceText: 'Get started by creating your first role',
    french: 'Commencez par créer votre premier rôle',
    spanish: 'Comience creando su primer rol',
  },
  {
    sourceText: 'No Permissions Available',
    french: 'Aucune permission disponible',
    spanish: 'No hay permisos disponibles',
  },
  {
    sourceText: 'Contact your system administrator',
    french: 'Contactez votre administrateur système',
    spanish: 'Contacte a su administrador del sistema',
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
        module: 'roles',
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
  console.log('🌍 Starting Role Module Translation Seeding...\n');
  console.log(
    `📊 Total translations to seed: ${
      roleTranslations.length
    } × 2 languages = ${roleTranslations.length * 2} records\n`
  );

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const translation of roleTranslations) {
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
  console.log('🎉 Role Translation Seeding Complete!');
  console.log('='.repeat(80));
  console.log(`✅ Successfully seeded: ${successCount} translations`);
  console.log(`⚠️  Skipped (already exist): ${skipCount} translations`);
  console.log(`❌ Failed: ${errorCount} translations`);
  console.log('='.repeat(80) + '\n');

  console.log('📝 Next Steps:');
  console.log('1. Verify translations in the Roles interface');
  console.log('2. Test language switching on role management pages');
  console.log('3. Review permission categories in different languages\n');
}

// Run the seeding script
main().catch(error => {
  console.error('💥 Seeding script failed:', error);
  process.exit(1);
});
