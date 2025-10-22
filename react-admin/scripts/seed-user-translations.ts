#!/usr/bin/env ts-node

/**
 * User Module Translation Seeding Script
 * 
 * This script seeds French and Spanish translations for all User module labels.
 * Run this after creating the user-labels.ts file to populate the database.
 * 
 * Usage:
 *   ts-node seed-user-translations.ts
 * 
 * Or via npm:
 *   npm run seed:user-translations
 */

import axios from 'axios';

const TRANSLATION_API_BASE_URL = 'http://localhost:3007/api/v1/translation';

interface TranslationPair {
  sourceText: string;
  french: string;
  spanish: string;
}

/**
 * User Module Translations
 * Organized by category matching user-labels.ts structure
 */
const userTranslations: TranslationPair[] = [
  // Page Header
  { sourceText: 'Users', french: 'Utilisateurs', spanish: 'Usuarios' },
  { sourceText: 'Manage your user database', french: 'Gérer votre base de données utilisateurs', spanish: 'Gestionar su base de datos de usuarios' },

  // Table Headers
  { sourceText: 'First Name', french: 'Prénom', spanish: 'Nombre' },
  { sourceText: 'Email', french: 'E-mail', spanish: 'Correo electrónico' },
  { sourceText: 'Roles', french: 'Rôles', spanish: 'Roles' },
  { sourceText: 'Status', french: 'Statut', spanish: 'Estado' },
  { sourceText: 'Created', french: 'Créé', spanish: 'Creado' },
  { sourceText: 'Actions', french: 'Actions', spanish: 'Acciones' },
  { sourceText: 'No users found', french: 'Aucun utilisateur trouvé', spanish: 'No se encontraron usuarios' },

  // Buttons
  { sourceText: 'Create User', french: 'Créer un utilisateur', spanish: 'Crear usuario' },
  { sourceText: 'Export CSV', french: 'Exporter CSV', spanish: 'Exportar CSV' },
  { sourceText: 'Refresh', french: 'Actualiser', spanish: 'Actualizar' },
  { sourceText: 'Cancel', french: 'Annuler', spanish: 'Cancelar' },
  { sourceText: 'Delete', french: 'Supprimer', spanish: 'Eliminar' },

  // Search Placeholder
  { sourceText: 'Search users by name, email, or role...', french: 'Rechercher des utilisateurs par nom, e-mail ou rôle...', spanish: 'Buscar usuarios por nombre, correo electrónico o rol...' },

  // Sort Options
  { sourceText: 'Last Name', french: 'Nom de famille', spanish: 'Apellido' },
  { sourceText: 'Created Date', french: 'Date de création', spanish: 'Fecha de creación' },

  // Status Values
  { sourceText: 'Active', french: 'Actif', spanish: 'Activo' },
  { sourceText: 'Inactive', french: 'Inactif', spanish: 'Inactivo' },

  // Dropdown Actions
  { sourceText: 'View Details', french: 'Voir les détails', spanish: 'Ver detalles' },
  { sourceText: 'Edit', french: 'Modifier', spanish: 'Editar' },
  { sourceText: 'Activate', french: 'Activer', spanish: 'Activar' },
  { sourceText: 'Deactivate', french: 'Désactiver', spanish: 'Desactivar' },

  // Modal Titles
  { sourceText: 'Create New User', french: 'Créer un nouvel utilisateur', spanish: 'Crear nuevo usuario' },
  { sourceText: 'Edit User', french: 'Modifier l\'utilisateur', spanish: 'Editar usuario' },
  { sourceText: 'Delete User', french: 'Supprimer l\'utilisateur', spanish: 'Eliminar usuario' },
  { sourceText: 'User Details', french: 'Détails de l\'utilisateur', spanish: 'Detalles del usuario' },

  // Delete Confirmation
  { sourceText: 'Are you sure you want to delete this user? This action cannot be undone.', french: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.', spanish: '¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.' },

  // Toast Messages
  { sourceText: 'User created successfully', french: 'Utilisateur créé avec succès', spanish: 'Usuario creado exitosamente' },
  { sourceText: 'Failed to create user', french: 'Échec de la création de l\'utilisateur', spanish: 'Error al crear usuario' },
  { sourceText: 'User updated successfully', french: 'Utilisateur mis à jour avec succès', spanish: 'Usuario actualizado exitosamente' },
  { sourceText: 'Failed to update user', french: 'Échec de la mise à jour de l\'utilisateur', spanish: 'Error al actualizar usuario' },
  { sourceText: 'User deleted successfully', french: 'Utilisateur supprimé avec succès', spanish: 'Usuario eliminado exitosamente' },
  { sourceText: 'Failed to delete user', french: 'Échec de la suppression de l\'utilisateur', spanish: 'Error al eliminar usuario' },
  { sourceText: 'User activated', french: 'Utilisateur activé', spanish: 'Usuario activado' },
  { sourceText: 'User deactivated', french: 'Utilisateur désactivé', spanish: 'Usuario desactivado' },
  { sourceText: 'Failed to toggle user status', french: 'Échec du changement de statut de l\'utilisateur', spanish: 'Error al cambiar el estado del usuario' },
  { sourceText: 'Users exported as {format}', french: 'Utilisateurs exportés en {format}', spanish: 'Usuarios exportados como {format}' },
  { sourceText: 'Failed to export users', french: 'Échec de l\'exportation des utilisateurs', spanish: 'Error al exportar usuarios' },
  
  // User Details View Labels
  { sourceText: 'Personal Information', french: 'Informations personnelles', spanish: 'Información personal' },
  { sourceText: 'Account Information', french: 'Informations du compte', spanish: 'Información de la cuenta' },
  { sourceText: 'Roles & Permissions', french: 'Rôles et autorisations', spanish: 'Roles y permisos' },
  { sourceText: 'User ID', french: 'ID utilisateur', spanish: 'ID de usuario' },
  { sourceText: 'Last Updated', french: 'Dernière mise à jour', spanish: 'Última actualización' },
  { sourceText: 'No roles assigned', french: 'Aucun rôle attribué', spanish: 'Sin roles asignados' },
];

/**
 * Seed a single translation (French or Spanish)
 */
async function seedTranslation(
  sourceText: string,
  targetLanguage: 'fr' | 'es',
  translatedText: string
): Promise<void> {
  try {
    const response = await axios.post(`${TRANSLATION_API_BASE_URL}/translations`, {
      original: sourceText,
      destination: translatedText,
      languageCode: targetLanguage,
      context: { module: 'user', category: 'labels' },
      isApproved: true,
    });

    if (response.status === 201 || response.status === 200) {
      console.log(`✅ Seeded ${targetLanguage.toUpperCase()}: "${sourceText}" → "${translatedText}"`);
    }
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log(`⚠️  Already exists ${targetLanguage.toUpperCase()}: "${sourceText}"`);
    } else {
      console.error(`❌ Failed to seed ${targetLanguage.toUpperCase()}: "${sourceText}"`, error.message);
    }
  }
}

/**
 * Main seeding function
 */
async function seedUserTranslations(): Promise<void> {
  console.log('🌱 Starting User Module Translation Seeding...\n');
  console.log(`📊 Total labels to seed: ${userTranslations.length}`);
  console.log(`📊 Total translations: ${userTranslations.length * 2} (${userTranslations.length} FR + ${userTranslations.length} ES)\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const translation of userTranslations) {
    // Seed French
    try {
      await seedTranslation(translation.sourceText, 'fr', translation.french);
      successCount++;
    } catch (error) {
      if ((error as any).response?.status === 409) {
        skipCount++;
      } else {
        errorCount++;
      }
    }

    // Seed Spanish
    try {
      await seedTranslation(translation.sourceText, 'es', translation.spanish);
      successCount++;
    } catch (error) {
      if ((error as any).response?.status === 409) {
        skipCount++;
      } else {
        errorCount++;
      }
    }

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log('\n✅ User Module Translation Seeding Complete!');
  console.log(`📊 Summary:`);
  console.log(`   - Successfully seeded: ${successCount}`);
  console.log(`   - Already existed (skipped): ${skipCount}`);
  console.log(`   - Errors: ${errorCount}`);
  console.log(`   - Total processed: ${successCount + skipCount + errorCount}`);
}

// Run the seeding
seedUserTranslations()
  .then(() => {
    console.log('\n🎉 Seeding process finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding process failed:', error);
    process.exit(1);
  });
