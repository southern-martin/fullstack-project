import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { CreateLanguageDto } from "../src/application/dto/create-language.dto";
import { CreateTranslationDto } from "../src/application/dto/create-translation.dto";
import { TranslationService } from "../src/application/services/translation.service";

async function seedData() {
  console.log("🌱 Starting Translation Service data seeding...");

  const app = await NestFactory.createApplicationContext(AppModule);
  const translationService = app.get(TranslationService);

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    // Note: In a real scenario, you might want to be more selective about clearing data

    // Create sample languages
    const sampleLanguages: CreateLanguageDto[] = [
      {
        code: "en",
        name: "English",
        nativeName: "English",
        isActive: true,
        isDefault: true,
        metadata: {
          flag: "🇺🇸",
          direction: "ltr",
          region: "US",
          currency: "USD",
          dateFormat: "MM/DD/YYYY",
        },
      },
      {
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        isActive: true,
        isDefault: false,
        metadata: {
          flag: "🇪🇸",
          direction: "ltr",
          region: "ES",
          currency: "EUR",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "fr",
        name: "French",
        nativeName: "Français",
        isActive: true,
        isDefault: false,
        metadata: {
          flag: "🇫🇷",
          direction: "ltr",
          region: "FR",
          currency: "EUR",
          dateFormat: "DD/MM/YYYY",
        },
      },
      {
        code: "de",
        name: "German",
        nativeName: "Deutsch",
        isActive: true,
        isDefault: false,
        metadata: {
          flag: "🇩🇪",
          direction: "ltr",
          region: "DE",
          currency: "EUR",
          dateFormat: "DD.MM.YYYY",
        },
      },
      {
        code: "ar",
        name: "Arabic",
        nativeName: "العربية",
        isActive: true,
        isDefault: false,
        metadata: {
          flag: "🇸🇦",
          direction: "rtl",
          region: "SA",
          currency: "SAR",
          dateFormat: "DD/MM/YYYY",
        },
      },
    ];

    console.log("🌍 Creating sample languages...");
    const createdLanguages = [];
    for (const languageData of sampleLanguages) {
      try {
        const language = await translationService.createLanguage(languageData);
        createdLanguages.push(language);
        console.log(`✅ Created language: ${language.name} (${language.code})`);
      } catch (error) {
        if (error.status === 409) {
          // ConflictException
          console.warn(
            `⚠️ Language with code ${languageData.code} already exists. Skipping.`
          );
        } else {
          console.error(
            `❌ Failed to create language ${languageData.code}: ${error.message}`
          );
        }
      }
    }

    // Create sample translations
    console.log("📝 Creating sample translations...");
    const sampleTranslations: CreateTranslationDto[] = [
      // English (default language)
      {
        originalText: "Welcome",
        translatedText: "Welcome",
        languageId: createdLanguages.find((l) => l.code === "en")?.id || 1,
        context: { category: "ui", module: "auth", component: "message" },
        isApproved: true,
      },
      {
        originalText: "Login",
        translatedText: "Login",
        languageId: createdLanguages.find((l) => l.code === "en")?.id || 1,
        context: { category: "ui", module: "auth", component: "button" },
        isApproved: true,
      },
      {
        originalText: "Email",
        translatedText: "Email",
        languageId: createdLanguages.find((l) => l.code === "en")?.id || 1,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "email",
        },
        isApproved: true,
      },
      {
        originalText: "Password",
        translatedText: "Password",
        languageId: createdLanguages.find((l) => l.code === "en")?.id || 1,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "password",
        },
        isApproved: true,
      },

      // Spanish translations
      {
        originalText: "Welcome",
        translatedText: "Bienvenido",
        languageId: createdLanguages.find((l) => l.code === "es")?.id || 2,
        context: { category: "ui", module: "auth", component: "message" },
        isApproved: true,
      },
      {
        originalText: "Login",
        translatedText: "Iniciar sesión",
        languageId: createdLanguages.find((l) => l.code === "es")?.id || 2,
        context: { category: "ui", module: "auth", component: "button" },
        isApproved: true,
      },
      {
        originalText: "Email",
        translatedText: "Correo electrónico",
        languageId: createdLanguages.find((l) => l.code === "es")?.id || 2,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "email",
        },
        isApproved: true,
      },
      {
        originalText: "Password",
        translatedText: "Contraseña",
        languageId: createdLanguages.find((l) => l.code === "es")?.id || 2,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "password",
        },
        isApproved: true,
      },

      // French translations
      {
        originalText: "Welcome",
        translatedText: "Bienvenue",
        languageId: createdLanguages.find((l) => l.code === "fr")?.id || 3,
        context: { category: "ui", module: "auth", component: "message" },
        isApproved: true,
      },
      {
        originalText: "Login",
        translatedText: "Se connecter",
        languageId: createdLanguages.find((l) => l.code === "fr")?.id || 3,
        context: { category: "ui", module: "auth", component: "button" },
        isApproved: true,
      },
      {
        originalText: "Email",
        translatedText: "E-mail",
        languageId: createdLanguages.find((l) => l.code === "fr")?.id || 3,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "email",
        },
        isApproved: true,
      },
      {
        originalText: "Password",
        translatedText: "Mot de passe",
        languageId: createdLanguages.find((l) => l.code === "fr")?.id || 3,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "password",
        },
        isApproved: true,
      },

      // German translations
      {
        originalText: "Welcome",
        translatedText: "Willkommen",
        languageId: createdLanguages.find((l) => l.code === "de")?.id || 4,
        context: { category: "ui", module: "auth", component: "message" },
        isApproved: true,
      },
      {
        originalText: "Login",
        translatedText: "Anmelden",
        languageId: createdLanguages.find((l) => l.code === "de")?.id || 4,
        context: { category: "ui", module: "auth", component: "button" },
        isApproved: true,
      },
      {
        originalText: "Email",
        translatedText: "E-Mail",
        languageId: createdLanguages.find((l) => l.code === "de")?.id || 4,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "email",
        },
        isApproved: true,
      },
      {
        originalText: "Password",
        translatedText: "Passwort",
        languageId: createdLanguages.find((l) => l.code === "de")?.id || 4,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "password",
        },
        isApproved: true,
      },

      // Arabic translations
      {
        originalText: "Welcome",
        translatedText: "أهلاً وسهلاً",
        languageId: createdLanguages.find((l) => l.code === "ar")?.id || 5,
        context: { category: "ui", module: "auth", component: "message" },
        isApproved: true,
      },
      {
        originalText: "Login",
        translatedText: "تسجيل الدخول",
        languageId: createdLanguages.find((l) => l.code === "ar")?.id || 5,
        context: { category: "ui", module: "auth", component: "button" },
        isApproved: true,
      },
      {
        originalText: "Email",
        translatedText: "البريد الإلكتروني",
        languageId: createdLanguages.find((l) => l.code === "ar")?.id || 5,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "email",
        },
        isApproved: true,
      },
      {
        originalText: "Password",
        translatedText: "كلمة المرور",
        languageId: createdLanguages.find((l) => l.code === "ar")?.id || 5,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "password",
        },
        isApproved: true,
      },
    ];

    for (const translationData of sampleTranslations) {
      try {
        const translation =
          await translationService.createTranslation(translationData);
        console.log(
          `✅ Created translation: "${translation.originalText}" → "${translation.translatedText}"`
        );
      } catch (error) {
        if (error.status === 409) {
          // ConflictException
          console.warn(`⚠️ Translation already exists. Skipping.`);
        } else {
          console.error(`❌ Failed to create translation: ${error.message}`);
        }
      }
    }

    // Get total counts
    const languageCount = await translationService.getLanguageCount();
    const translationCount = await translationService.getTranslationCount();
    console.log(`📊 Total languages in database: ${languageCount.count}`);
    console.log(`📊 Total translations in database: ${translationCount.count}`);

    // Test translation
    console.log("🧮 Testing translation...");
    try {
      const testTranslation = await translationService.translateText({
        text: "Welcome",
        targetLanguage: "es",
        context: { category: "ui", module: "auth", component: "message" },
      });
      console.log(
        `✅ Test translation successful: "Welcome" → "${testTranslation.translatedText}" (fromCache: ${testTranslation.fromCache})`
      );
    } catch (error) {
      console.error("❌ Error in test translation:", error.message);
    }

    console.log("🎉 Translation Service seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await app.close();
  }
}

// Run seeding
seedData().catch(console.error);







