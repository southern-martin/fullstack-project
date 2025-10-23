import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { CreateLanguageDto } from "../src/application/dto/create-language.dto";
import { ManageLanguageUseCase } from "../src/application/use-cases/manage-language.use-case";
import { ManageTranslationUseCase } from "../src/application/use-cases/manage-translation.use-case";
import { TranslateTextUseCase } from "../src/application/use-cases/translate-text.use-case";

async function seedComprehensiveData() {
  console.log(
    "🌱 Starting Comprehensive Translation Service Data Seeding...\n"
  );

  const app = await NestFactory.createApplicationContext(AppModule);
  const manageLanguageUseCase = app.get(ManageLanguageUseCase);
  const manageTranslationUseCase = app.get(ManageTranslationUseCase);
  const translateTextUseCase = app.get(TranslateTextUseCase);

  try {
    // Comprehensive list of 30 languages with proper flags
    const languages: CreateLanguageDto[] = [
      {
        code: "en",
        name: "English",
        localName: "English",
        flag: "🇬🇧",
        status: "active",
        isDefault: true,
        metadata: {
          direction: "ltr",
          region: "US",
          currency: "USD",
          dateFormat: "MM/DD/YYYY",
        },
      },
      {
        code: "es",
        name: "Spanish",
        localName: "Español",
        flag: "🇪🇸",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "ES",
          currency: "EUR",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "fr",
        name: "French",
        localName: "Français",
        flag: "🇫🇷",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "FR",
          currency: "EUR",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "de",
        name: "German",
        localName: "Deutsch",
        flag: "🇩🇪",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "DE",
          currency: "EUR",
          dateFormat: "DD.MM.YYYY",
        },
      },
      {
        code: "it",
        name: "Italian",
        localName: "Italiano",
        flag: "🇮🇹",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "IT",
          currency: "EUR",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "pt",
        name: "Portuguese",
        localName: "Português",
        flag: "🇵🇹",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "PT",
          currency: "EUR",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "ru",
        name: "Russian",
        localName: "Русский",
        flag: "🇷🇺",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "RU",
          currency: "RUB",
          dateFormat: "DD.MM.YYYY",
        },
      },
      {
        code: "ja",
        name: "Japanese",
        localName: "日本語",
        flag: "🇯🇵",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "JP",
          currency: "JPY",
          dateFormat: "YYYY/MM/DD",
        },
      },
      {
        code: "zh",
        name: "Chinese (Simplified)",
        localName: "简体中文",
        flag: "🇨🇳",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "CN",
          currency: "CNY",
          dateFormat: "YYYY-MM-DD",
        },
      },
      {
        code: "ko",
        name: "Korean",
        localName: "한국어",
        flag: "🇰🇷",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "KR",
          currency: "KRW",
          dateFormat: "YYYY.MM.DD",
        },
      },
      {
        code: "ar",
        name: "Arabic",
        localName: "العربية",
        flag: "🇸🇦",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "rtl",
          region: "SA",
          currency: "SAR",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "hi",
        name: "Hindi",
        localName: "हिन्दी",
        flag: "🇮🇳",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "IN",
          currency: "INR",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "nl",
        name: "Dutch",
        localName: "Nederlands",
        flag: "🇳🇱",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "NL",
          currency: "EUR",
          dateFormat: "DD-MM-YYYY",
        },
      },
      {
        code: "pl",
        name: "Polish",
        localName: "Polski",
        flag: "🇵🇱",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "PL",
          currency: "PLN",
          dateFormat: "DD.MM.YYYY",
        },
      },
      {
        code: "tr",
        name: "Turkish",
        localName: "Türkçe",
        flag: "🇹🇷",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "TR",
          currency: "TRY",
          dateFormat: "DD.MM.YYYY",
        },
      },
      {
        code: "sv",
        name: "Swedish",
        localName: "Svenska",
        flag: "🇸🇪",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "SE",
          currency: "SEK",
          dateFormat: "YYYY-MM-DD",
        },
      },
      {
        code: "no",
        name: "Norwegian",
        localName: "Norsk",
        flag: "🇳🇴",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "NO",
          currency: "NOK",
          dateFormat: "DD.MM.YYYY",
        },
      },
      {
        code: "da",
        name: "Danish",
        localName: "Dansk",
        flag: "🇩🇰",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "DK",
          currency: "DKK",
          dateFormat: "DD-MM-YYYY",
        },
      },
      {
        code: "fi",
        name: "Finnish",
        localName: "Suomi",
        flag: "🇫🇮",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "FI",
          currency: "EUR",
          dateFormat: "DD.MM.YYYY",
        },
      },
      {
        code: "cs",
        name: "Czech",
        localName: "Čeština",
        flag: "🇨🇿",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "CZ",
          currency: "CZK",
          dateFormat: "DD.MM.YYYY",
        },
      },
      {
        code: "el",
        name: "Greek",
        localName: "Ελληνικά",
        flag: "🇬🇷",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "GR",
          currency: "EUR",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "he",
        name: "Hebrew",
        localName: "עברית",
        flag: "🇮🇱",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "rtl",
          region: "IL",
          currency: "ILS",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "th",
        name: "Thai",
        localName: "ไทย",
        flag: "🇹🇭",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "TH",
          currency: "THB",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "vi",
        name: "Vietnamese",
        localName: "Tiếng Việt",
        flag: "🇻🇳",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "VN",
          currency: "VND",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "id",
        name: "Indonesian",
        localName: "Bahasa Indonesia",
        flag: "🇮🇩",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "ID",
          currency: "IDR",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "ms",
        name: "Malay",
        localName: "Bahasa Melayu",
        flag: "🇲🇾",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "MY",
          currency: "MYR",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "uk",
        name: "Ukrainian",
        localName: "Українська",
        flag: "🇺🇦",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "UA",
          currency: "UAH",
          dateFormat: "DD.MM.YYYY",
        },
      },
      {
        code: "ro",
        name: "Romanian",
        localName: "Română",
        flag: "🇷🇴",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "RO",
          currency: "RON",
          dateFormat: "DD.MM.YYYY",
        },
      },
      {
        code: "hu",
        name: "Hungarian",
        localName: "Magyar",
        flag: "🇭🇺",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "HU",
          currency: "HUF",
          dateFormat: "YYYY.MM.DD",
        },
      },
      {
        code: "bg",
        name: "Bulgarian",
        localName: "Български",
        flag: "🇧🇬",
        status: "active",
        isDefault: false,
        metadata: {
          direction: "ltr",
          region: "BG",
          currency: "BGN",
          dateFormat: "DD.MM.YYYY",
        },
      },
    ];

    console.log("🌍 Creating/Updating 30 Languages...");
    const createdLanguages = [];
    let createdCount = 0;
    let updatedCount = 0;

    for (const languageData of languages) {
      try {
        const language = await manageLanguageUseCase.create(languageData);
        createdLanguages.push(language);
        createdCount++;
        console.log(
          `  ✅ Created: ${language.code.padEnd(4)} | ${language.flag} ${language.name} (${language.localName})`
        );
      } catch (error) {
        if (error.status === 409) {
          // Language exists, try to update it
          try {
            const updated = await manageLanguageUseCase.update(
              languageData.code,
              languageData
            );
            createdLanguages.push(updated);
            updatedCount++;
            console.log(
              `  🔄 Updated: ${languageData.code.padEnd(4)} | ${languageData.flag} ${languageData.name}`
            );
          } catch (updateError) {
            console.warn(
              `  ⚠️  Failed to update ${languageData.code}: ${updateError.message}`
            );
          }
        } else {
          console.error(
            `  ❌ Failed to create ${languageData.code}: ${error.message}`
          );
        }
      }
    }

    console.log(
      `\n📊 Language Summary: ${createdCount} created, ${updatedCount} updated\n`
    );

    // Create comprehensive translation keys for common UI elements
    console.log("📝 Creating Translation Keys (120+ entries)...\n");

    const translationKeys = [
      // Auth Module
      "Welcome",
      "Login",
      "Logout",
      "Register",
      "Email",
      "Password",
      "Confirm Password",
      "Forgot Password",
      "Reset Password",
      "Remember Me",
      "Sign In",
      "Sign Up",

      // Common UI
      "Home",
      "Dashboard",
      "Profile",
      "Settings",
      "Help",
      "About",
      "Contact",
      "Search",
      "Filter",
      "Sort",
      "Export",
      "Import",
      "Download",
      "Upload",
      "Save",
      "Cancel",
      "Delete",
      "Edit",
      "Create",
      "Update",
      "Submit",
      "Back",
      "Next",
      "Previous",
      "Finish",
      "Close",
      "Open",

      // Data Table
      "No Data",
      "Loading",
      "Actions",
      "Name",
      "Description",
      "Status",
      "Date",
      "Created At",
      "Updated At",
      "Active",
      "Inactive",
      "Enabled",
      "Disabled",

      // Validation Messages
      "Required Field",
      "Invalid Email",
      "Password Too Short",
      "Passwords Do Not Match",
      "Success",
      "Error",
      "Warning",
      "Info",
      "Confirmation",

      // Business Entities
      "Carrier",
      "Carriers",
      "Customer",
      "Customers",
      "User",
      "Users",
      "Role",
      "Roles",
      "Permission",
      "Permissions",
      "Translation",
      "Translations",
      "Language",
      "Languages",
      "Pricing",
      "Price",
      "Service",
      "Services",

      // CRUD Operations
      "Create New",
      "Edit Item",
      "Delete Item",
      "View Details",
      "Save Changes",
      "Confirm Delete",
      "Are you sure?",
      "This action cannot be undone",

      // Navigation
      "Main Menu",
      "Sidebar",
      "Navigation",
      "Breadcrumb",
      "Go To",

      // Forms
      "First Name",
      "Last Name",
      "Phone Number",
      "Address",
      "City",
      "Country",
      "Postal Code",
      "Company",
      "Department",
      "Title",

      // Date/Time
      "Today",
      "Yesterday",
      "Tomorrow",
      "This Week",
      "Last Week",
      "This Month",
      "Last Month",
      "This Year",
      "Last Year",
      "Select Date",
      "Select Time",

      // Pagination
      "Page",
      "Per Page",
      "Showing",
      "of",
      "entries",
      "First",
      "Last",

      // File Operations
      "Choose File",
      "Upload File",
      "Download File",
      "File Name",
      "File Size",
      "File Type",
      "Select Files",
    ];

    const translations: Record<string, Record<string, string>> = {
      en: {},
      es: {},
      fr: {},
      de: {},
      it: {},
      pt: {},
      ru: {},
      ja: {},
      zh: {},
      ko: {},
      ar: {},
      hi: {},
      nl: {},
      pl: {},
      tr: {},
    };

    // Sample translations for major languages (abbreviated for brevity)
    const sampleTranslations: Record<string, Record<string, string>> = {
      es: {
        Welcome: "Bienvenido",
        Login: "Iniciar sesión",
        Logout: "Cerrar sesión",
        Register: "Registrarse",
        Email: "Correo electrónico",
        Password: "Contraseña",
        Home: "Inicio",
        Dashboard: "Tablero",
        Profile: "Perfil",
        Settings: "Configuración",
        Search: "Buscar",
        Save: "Guardar",
        Cancel: "Cancelar",
        Delete: "Eliminar",
        Edit: "Editar",
      },
      fr: {
        Welcome: "Bienvenue",
        Login: "Se connecter",
        Logout: "Se déconnecter",
        Register: "S'inscrire",
        Email: "E-mail",
        Password: "Mot de passe",
        Home: "Accueil",
        Dashboard: "Tableau de bord",
        Profile: "Profil",
        Settings: "Paramètres",
        Search: "Rechercher",
        Save: "Enregistrer",
        Cancel: "Annuler",
        Delete: "Supprimer",
        Edit: "Modifier",
      },
      de: {
        Welcome: "Willkommen",
        Login: "Anmelden",
        Logout: "Abmelden",
        Register: "Registrieren",
        Email: "E-Mail",
        Password: "Passwort",
        Home: "Startseite",
        Dashboard: "Dashboard",
        Profile: "Profil",
        Settings: "Einstellungen",
        Search: "Suchen",
        Save: "Speichern",
        Cancel: "Abbrechen",
        Delete: "Löschen",
        Edit: "Bearbeiten",
      },
      it: {
        Welcome: "Benvenuto",
        Login: "Accedi",
        Logout: "Esci",
        Register: "Registrati",
        Email: "Email",
        Password: "Password",
        Home: "Home",
        Dashboard: "Pannello",
        Profile: "Profilo",
      },
      pt: {
        Welcome: "Bem-vindo",
        Login: "Entrar",
        Logout: "Sair",
        Register: "Registrar",
        Email: "E-mail",
        Password: "Senha",
        Home: "Início",
        Dashboard: "Painel",
        Profile: "Perfil",
      },
    };

    let translationCount = 0;
    let skipCount = 0;

    for (const key of translationKeys) {
      // English (default) - always same as key
      try {
        await manageTranslationUseCase.create({
          original: key,
          destination: key,
          languageCode: "en",
          context: { category: "ui", module: "common" },
          isApproved: true,
        });
        translationCount++;
      } catch (error) {
        if (error.status !== 409) {
          console.error(
            `  ❌ Error creating EN translation for "${key}": ${error.message}`
          );
        }
        skipCount++;
      }

      // Other languages - use sample translations or fallback to English
      for (const [langCode, translations] of Object.entries(
        sampleTranslations
      )) {
        const translatedText = translations[key] || key;

        try {
          await manageTranslationUseCase.create({
            original: key,
            destination: translatedText,
            languageCode: langCode,
            context: { category: "ui", module: "common" },
            isApproved: translatedText !== key, // Only approved if actually translated
          });
          translationCount++;
        } catch (error) {
          if (error.status !== 409) {
            console.error(
              `  ❌ Error creating ${langCode.toUpperCase()} translation for "${key}": ${error.message}`
            );
          }
          skipCount++;
        }
      }
    }

    console.log(
      `\n✅ Translation Keys: ${translationCount} created, ${skipCount} skipped (already exist)\n`
    );

    // Final counts
    const finalLanguageCount = await manageLanguageUseCase.getCount();
    const finalTranslationCount = await manageTranslationUseCase.getCount();

    console.log("═══════════════════════════════════════════════════════════");
    console.log("📊 FINAL DATABASE STATISTICS");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(`  Languages:    ${finalLanguageCount.count}`);
    console.log(`  Translations: ${finalTranslationCount.count}`);
    console.log(
      "═══════════════════════════════════════════════════════════\n"
    );

    // Test translation with correlation ID tracking
    console.log("🧪 Testing Translation Service...\n");

    const testCases = [
      { text: "Welcome", lang: "es", expected: "Bienvenido" },
      { text: "Login", lang: "fr", expected: "Se connecter" },
      { text: "Dashboard", lang: "de", expected: "Dashboard" },
    ];

    for (const test of testCases) {
      try {
        const result = await translateTextUseCase.execute({
          text: test.text,
          targetLanguage: test.lang,
          context: { category: "ui" },
        });

        const status = result.translatedText === test.expected ? "✅" : "⚠️ ";
        console.log(
          `  ${status} "${test.text}" → "${result.translatedText}" [${test.lang.toUpperCase()}] (cache: ${result.fromCache})`
        );
      } catch (error) {
        console.error(`  ❌ Translation test failed: ${error.message}`);
      }
    }

    console.log("\n🎉 Comprehensive Translation Service Seeding Complete!\n");
  } catch (error) {
    console.error("\n❌ Error during seeding:", error);
    throw error;
  } finally {
    await app.close();
  }
}

// Execute seeding
seedComprehensiveData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
