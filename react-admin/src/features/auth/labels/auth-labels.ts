/**
 * Authentication Module Translation Labels
 * 
 * This file contains all static UI labels used in the Authentication module.
 * Labels are organized by category for better maintainability.
 * 
 * Usage with useAuthLabels hook:
 * const { L } = useAuthLabels();
 * <h1>{L.page.title}</h1>
 */

export interface AuthLabels {
  // Page Headers
  page: {
    signInTitle: string;
    signInSubtitle: string;
    createAccountTitle: string;
    resetPasswordTitle: string;
  };

  // Form Labels
  form: {
    emailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
    confirmPassword: string;
    currentPassword: string;
    newPassword: string;
  };

  // Form Placeholders
  placeholders: {
    enterEmail: string;
    enterPassword: string;
    enterFirstName: string;
    enterLastName: string;
    confirmPassword: string;
    enterSecurityCode: string;
  };

  // Buttons
  buttons: {
    signIn: string;
    signOut: string;
    signingIn: string;
    signingOut: string;
    register: string;
    registering: string;
    sendResetLink: string;
    resetPassword: string;
    backToSignIn: string;
    verify: string;
    updateProfile: string;
    changePassword: string;
  };

  // Status Messages
  status: {
    redirecting: string;
    loading: string;
    pleaseWait: string;
  };

  // Error Messages
  errors: {
    invalidCredentials: string;
    authenticationFailed: string;
    sessionExpired: string;
    emailRequired: string;
    passwordRequired: string;
    emailInvalid: string;
    passwordTooShort: string;
    passwordsDoNotMatch: string;
  };

  // Success Messages
  success: {
    signedIn: string;
    signedOut: string;
    registrationSuccessful: string;
    welcomeBack: string;
    profileUpdated: string;
    passwordChanged: string;
    resetEmailSent: string;
  };

  // Links & Text
  links: {
    forgotPassword: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    rememberMe: string;
    keepMeSignedIn: string;
  };

  // Security
  security: {
    twoFactorAuth: string;
    securityCode: string;
    accessDenied: string;
    noPermission: string;
    unauthorized: string;
    forbidden: string;
    authRequired: string;
  };

  // Profile/Account
  profile: {
    profile: string;
    account: string;
    accountSettings: string;
  };
}

/**
 * Default English labels for the Authentication module
 */
export const authLabels: AuthLabels = {
  // Page Headers
  page: {
    signInTitle: 'Sign in to your account',
    signInSubtitle: 'Enter your credentials to access the admin dashboard',
    createAccountTitle: 'Create an account',
    resetPasswordTitle: 'Reset Password',
  },

  // Form Labels
  form: {
    emailAddress: 'Email Address',
    password: 'Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    confirmPassword: 'Confirm Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
  },

  // Form Placeholders
  placeholders: {
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    enterFirstName: 'Enter your first name',
    enterLastName: 'Enter your last name',
    confirmPassword: 'Confirm your password',
    enterSecurityCode: 'Enter security code',
  },

  // Buttons
  buttons: {
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signingIn: 'Signing in...',
    signingOut: 'Signing out...',
    register: 'Register',
    registering: 'Registering...',
    sendResetLink: 'Send reset link',
    resetPassword: 'Reset password',
    backToSignIn: 'Back to sign in',
    verify: 'Verify',
    updateProfile: 'Update Profile',
    changePassword: 'Change Password',
  },

  // Status Messages
  status: {
    redirecting: 'Redirecting to dashboard...',
    loading: 'Loading...',
    pleaseWait: 'Please wait...',
  },

  // Error Messages
  errors: {
    invalidCredentials: 'Invalid email or password',
    authenticationFailed: 'Authentication failed',
    sessionExpired: 'Session expired. Please sign in again.',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    emailInvalid: 'Email must be valid',
    passwordTooShort: 'Password must be at least 8 characters',
    passwordsDoNotMatch: 'Passwords do not match',
  },

  // Success Messages
  success: {
    signedIn: 'Successfully signed in',
    signedOut: 'Successfully signed out',
    registrationSuccessful: 'Registration successful',
    welcomeBack: 'Welcome back!',
    profileUpdated: 'Profile updated successfully',
    passwordChanged: 'Password changed successfully',
    resetEmailSent: 'Password reset email sent',
  },

  // Links & Text
  links: {
    forgotPassword: 'Forgot password?',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    rememberMe: 'Remember me',
    keepMeSignedIn: 'Keep me signed in',
  },

  // Security
  security: {
    twoFactorAuth: 'Two-factor authentication',
    securityCode: 'Security Code',
    accessDenied: 'Access Denied',
    noPermission: 'You do not have permission to access this page',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    authRequired: 'Authentication Required',
  },

  // Profile/Account
  profile: {
    profile: 'Profile',
    account: 'Account',
    accountSettings: 'Account Settings',
  },
};
