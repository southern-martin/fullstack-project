#!/usr/bin/env ts-node

/**
 * Authentication Module Translation Seeding Script
 *
 * This script seeds French and Spanish translations for all Authentication module labels.
 * Run this to populate the translation database with authentication-related text.
 *
 * Usage:
 *   ts-node seed-auth-translations.ts
 *
 * Or via npm:
 *   npm run seed:auth-translations
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
    component?: string;
    field?: string;
  };
}

/**
 * Authentication Module Translations
 * Organized by category matching login and authentication flows
 */
const authTranslations: TranslationPair[] = [
  // Page Headers
  {
    sourceText: 'Sign in to your account',
    french: 'Connectez-vous à votre compte',
    spanish: 'Inicie sesión en su cuenta',
  },
  {
    sourceText: 'Enter your credentials to access the admin dashboard',
    french: 'Entrez vos identifiants pour accéder au tableau de bord admin',
    spanish: 'Ingrese sus credenciales para acceder al panel de administración',
  },

  // Form Labels
  {
    sourceText: 'Email Address',
    french: 'Adresse e-mail',
    spanish: 'Dirección de correo electrónico',
  },
  { sourceText: 'Password', french: 'Mot de passe', spanish: 'Contraseña' },

  // Form Placeholders
  {
    sourceText: 'Enter your email',
    french: 'Entrez votre e-mail',
    spanish: 'Ingrese su correo electrónico',
  },
  {
    sourceText: 'Enter your password',
    french: 'Entrez votre mot de passe',
    spanish: 'Ingrese su contraseña',
  },

  // Buttons
  { sourceText: 'Sign In', french: 'Se connecter', spanish: 'Iniciar sesión' },
  {
    sourceText: 'Sign Out',
    french: 'Se déconnecter',
    spanish: 'Cerrar sesión',
  },
  {
    sourceText: 'Signing in...',
    french: 'Connexion en cours...',
    spanish: 'Iniciando sesión...',
  },
  {
    sourceText: 'Signing out...',
    french: 'Déconnexion en cours...',
    spanish: 'Cerrando sesión...',
  },
  { sourceText: 'Register', french: "S'inscrire", spanish: 'Registrarse' },
  {
    sourceText: 'Registering...',
    french: 'Inscription en cours...',
    spanish: 'Registrando...',
  },

  // Status Messages
  {
    sourceText: 'Redirecting to dashboard...',
    french: 'Redirection vers le tableau de bord...',
    spanish: 'Redirigiendo al panel...',
  },
  { sourceText: 'Loading...', french: 'Chargement...', spanish: 'Cargando...' },
  {
    sourceText: 'Please wait...',
    french: 'Veuillez patienter...',
    spanish: 'Por favor espere...',
  },

  // Error Messages
  {
    sourceText: 'Invalid email or password',
    french: 'E-mail ou mot de passe invalide',
    spanish: 'Correo electrónico o contraseña no válidos',
  },
  {
    sourceText: 'Authentication failed',
    french: "Échec de l'authentification",
    spanish: 'Autenticación fallida',
  },
  {
    sourceText: 'Session expired. Please sign in again.',
    french: 'Session expirée. Veuillez vous reconnecter.',
    spanish: 'Sesión expirada. Por favor, inicie sesión de nuevo.',
  },
  {
    sourceText: 'Email is required',
    french: "L'e-mail est requis",
    spanish: 'El correo electrónico es obligatorio',
  },
  {
    sourceText: 'Password is required',
    french: 'Le mot de passe est requis',
    spanish: 'La contraseña es obligatoria',
  },
  {
    sourceText: 'Email must be valid',
    french: "L'e-mail doit être valide",
    spanish: 'El correo electrónico debe ser válido',
  },
  {
    sourceText: 'Password must be at least 8 characters',
    french: 'Le mot de passe doit contenir au moins 8 caractères',
    spanish: 'La contraseña debe tener al menos 8 caracteres',
  },

  // Success Messages
  {
    sourceText: 'Successfully signed in',
    french: 'Connexion réussie',
    spanish: 'Inicio de sesión exitoso',
  },
  {
    sourceText: 'Successfully signed out',
    french: 'Déconnexion réussie',
    spanish: 'Cierre de sesión exitoso',
  },
  {
    sourceText: 'Registration successful',
    french: 'Inscription réussie',
    spanish: 'Registro exitoso',
  },
  {
    sourceText: 'Welcome back!',
    french: 'Bon retour !',
    spanish: '¡Bienvenido de nuevo!',
  },

  // Registration Form
  {
    sourceText: 'Create an account',
    french: 'Créer un compte',
    spanish: 'Crear una cuenta',
  },
  { sourceText: 'First Name', french: 'Prénom', spanish: 'Nombre' },
  { sourceText: 'Last Name', french: 'Nom de famille', spanish: 'Apellido' },
  {
    sourceText: 'Confirm Password',
    french: 'Confirmer le mot de passe',
    spanish: 'Confirmar contraseña',
  },
  {
    sourceText: 'Already have an account?',
    french: 'Vous avez déjà un compte ?',
    spanish: '¿Ya tienes una cuenta?',
  },
  {
    sourceText: "Don't have an account?",
    french: "Vous n'avez pas de compte ?",
    spanish: '¿No tienes una cuenta?',
  },

  // Password Reset
  {
    sourceText: 'Forgot password?',
    french: 'Mot de passe oublié ?',
    spanish: '¿Olvidaste tu contraseña?',
  },
  {
    sourceText: 'Reset password',
    french: 'Réinitialiser le mot de passe',
    spanish: 'Restablecer contraseña',
  },
  {
    sourceText: 'Reset Password',
    french: 'Réinitialiser le mot de passe',
    spanish: 'Restablecer Contraseña',
  },
  {
    sourceText: 'Send reset link',
    french: 'Envoyer le lien de réinitialisation',
    spanish: 'Enviar enlace de restablecimiento',
  },
  {
    sourceText: 'Back to sign in',
    french: 'Retour à la connexion',
    spanish: 'Volver al inicio de sesión',
  },
  {
    sourceText: 'Password reset email sent',
    french: 'E-mail de réinitialisation envoyé',
    spanish: 'Correo de restablecimiento enviado',
  },
  {
    sourceText: 'New Password',
    french: 'Nouveau mot de passe',
    spanish: 'Nueva contraseña',
  },
  {
    sourceText: 'Passwords do not match',
    french: 'Les mots de passe ne correspondent pas',
    spanish: 'Las contraseñas no coinciden',
  },

  // Profile/Account
  { sourceText: 'Profile', french: 'Profil', spanish: 'Perfil' },
  { sourceText: 'Account', french: 'Compte', spanish: 'Cuenta' },
  {
    sourceText: 'Account Settings',
    french: 'Paramètres du compte',
    spanish: 'Configuración de la cuenta',
  },
  {
    sourceText: 'Change Password',
    french: 'Changer le mot de passe',
    spanish: 'Cambiar contraseña',
  },
  {
    sourceText: 'Current Password',
    french: 'Mot de passe actuel',
    spanish: 'Contraseña actual',
  },
  {
    sourceText: 'Update Profile',
    french: 'Mettre à jour le profil',
    spanish: 'Actualizar perfil',
  },
  {
    sourceText: 'Profile updated successfully',
    french: 'Profil mis à jour avec succès',
    spanish: 'Perfil actualizado exitosamente',
  },
  {
    sourceText: 'Password changed successfully',
    french: 'Mot de passe changé avec succès',
    spanish: 'Contraseña cambiada exitosamente',
  },

  // Security
  {
    sourceText: 'Remember me',
    french: 'Se souvenir de moi',
    spanish: 'Recuérdame',
  },
  {
    sourceText: 'Keep me signed in',
    french: 'Rester connecté',
    spanish: 'Mantenerme conectado',
  },
  {
    sourceText: 'Two-factor authentication',
    french: 'Authentification à deux facteurs',
    spanish: 'Autenticación de dos factores',
  },
  {
    sourceText: 'Security Code',
    french: 'Code de sécurité',
    spanish: 'Código de seguridad',
  },
  {
    sourceText: 'Enter security code',
    french: 'Entrez le code de sécurité',
    spanish: 'Ingrese el código de seguridad',
  },
  { sourceText: 'Verify', french: 'Vérifier', spanish: 'Verificar' },

  // Permissions & Roles (Auth Context)
  {
    sourceText: 'Access Denied',
    french: 'Accès refusé',
    spanish: 'Acceso denegado',
  },
  {
    sourceText: 'You do not have permission to access this page',
    french: "Vous n'avez pas la permission d'accéder à cette page",
    spanish: 'No tienes permiso para acceder a esta página',
  },
  {
    sourceText: 'Unauthorized',
    french: 'Non autorisé',
    spanish: 'No autorizado',
  },
  { sourceText: 'Forbidden', french: 'Interdit', spanish: 'Prohibido' },
  {
    sourceText: 'Authentication Required',
    french: 'Authentification requise',
    spanish: 'Autenticación requerida',
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
        module: 'auth',
        category: 'authentication',
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
  console.log('🌍 Starting Authentication Module Translation Seeding...\n');
  console.log(
    `📊 Total translations to seed: ${
      authTranslations.length
    } × 2 languages = ${authTranslations.length * 2} records\n`
  );

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const translation of authTranslations) {
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
  console.log('🎉 Authentication Translation Seeding Complete!');
  console.log('='.repeat(80));
  console.log(`✅ Successfully seeded: ${successCount} translations`);
  console.log(`⚠️  Skipped (already exist): ${skipCount} translations`);
  console.log(`❌ Failed: ${errorCount} translations`);
  console.log('='.repeat(80) + '\n');

  console.log('📝 Next Steps:');
  console.log('1. Verify translations in the admin interface');
  console.log('2. Test language switching in the authentication pages');
  console.log('3. Update any custom error messages in your auth service\n');
}

// Run the seeding script
main().catch(error => {
  console.error('💥 Seeding script failed:', error);
  process.exit(1);
});
