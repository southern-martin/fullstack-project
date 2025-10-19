import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { CreateLanguageDto } from "../src/application/dto/create-language.dto";
import { CreateTranslationDto } from "../src/application/dto/create-translation.dto";
import { ManageLanguageUseCase } from "../src/application/use-cases/manage-language.use-case";
import { ManageTranslationUseCase } from "../src/application/use-cases/manage-translation.use-case";
import { TranslateTextUseCase } from "../src/application/use-cases/translate-text.use-case";

async function seedData() {
  console.log("🌱 Starting Translation Service data seeding...");

  const app = await NestFactory.createApplicationContext(AppModule);
  const manageLanguageUseCase = app.get(ManageLanguageUseCase);
  const manageTranslationUseCase = app.get(ManageTranslationUseCase);
  const translateTextUseCase = app.get(TranslateTextUseCase);

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    // Note: In a real scenario, you might want to be more selective about clearing data

    // Create sample languages
    const sampleLanguages: CreateLanguageDto[] = [
      {
        code: "en",
        name: "English",
        localName: "English",
        flag: "🇺🇸",
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
    ];

    console.log("🌍 Creating sample languages...");
    const createdLanguages = [];
    for (const languageData of sampleLanguages) {
      try {
        const language = await manageLanguageUseCase.create(languageData);
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
        original: "Welcome",
        destination: "Welcome",
        languageCode: createdLanguages.find((l) => l.code === "en")?.id || 1,
        context: { category: "ui", module: "auth", component: "message" },
        isApproved: true,
      },
      {
        original: "Login",
        destination: "Login",
        languageCode: createdLanguages.find((l) => l.code === "en")?.id || 1,
        context: { category: "ui", module: "auth", component: "button" },
        isApproved: true,
      },
      {
        original: "Email",
        destination: "Email",
        languageCode: createdLanguages.find((l) => l.code === "en")?.id || 1,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "email",
        },
        isApproved: true,
      },
      {
        original: "Password",
        destination: "Password",
        languageCode: createdLanguages.find((l) => l.code === "en")?.id || 1,
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
        original: "Welcome",
        destination: "Bienvenido",
        languageCode: createdLanguages.find((l) => l.code === "es")?.id || 2,
        context: { category: "ui", module: "auth", component: "message" },
        isApproved: true,
      },
      {
        original: "Login",
        destination: "Iniciar sesión",
        languageCode: createdLanguages.find((l) => l.code === "es")?.id || 2,
        context: { category: "ui", module: "auth", component: "button" },
        isApproved: true,
      },
      {
        original: "Email",
        destination: "Correo electrónico",
        languageCode: createdLanguages.find((l) => l.code === "es")?.id || 2,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "email",
        },
        isApproved: true,
      },
      {
        original: "Password",
        destination: "Contraseña",
        languageCode: createdLanguages.find((l) => l.code === "es")?.id || 2,
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
        original: "Welcome",
        destination: "Bienvenue",
        languageCode: createdLanguages.find((l) => l.code === "fr")?.id || 3,
        context: { category: "ui", module: "auth", component: "message" },
        isApproved: true,
      },
      {
        original: "Login",
        destination: "Se connecter",
        languageCode: createdLanguages.find((l) => l.code === "fr")?.id || 3,
        context: { category: "ui", module: "auth", component: "button" },
        isApproved: true,
      },
      {
        original: "Email",
        destination: "E-mail",
        languageCode: createdLanguages.find((l) => l.code === "fr")?.id || 3,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "email",
        },
        isApproved: true,
      },
      {
        original: "Password",
        destination: "Mot de passe",
        languageCode: createdLanguages.find((l) => l.code === "fr")?.id || 3,
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
        original: "Welcome",
        destination: "Willkommen",
        languageCode: createdLanguages.find((l) => l.code === "de")?.id || 4,
        context: { category: "ui", module: "auth", component: "message" },
        isApproved: true,
      },
      {
        original: "Login",
        destination: "Anmelden",
        languageCode: createdLanguages.find((l) => l.code === "de")?.id || 4,
        context: { category: "ui", module: "auth", component: "button" },
        isApproved: true,
      },
      {
        original: "Email",
        destination: "E-Mail",
        languageCode: createdLanguages.find((l) => l.code === "de")?.id || 4,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "email",
        },
        isApproved: true,
      },
      {
        original: "Password",
        destination: "Passwort",
        languageCode: createdLanguages.find((l) => l.code === "de")?.id || 4,
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
        original: "Welcome",
        destination: "أهلاً وسهلاً",
        languageCode: createdLanguages.find((l) => l.code === "ar")?.id || 5,
        context: { category: "ui", module: "auth", component: "message" },
        isApproved: true,
      },
      {
        original: "Login",
        destination: "تسجيل الدخول",
        languageCode: createdLanguages.find((l) => l.code === "ar")?.id || 5,
        context: { category: "ui", module: "auth", component: "button" },
        isApproved: true,
      },
      {
        original: "Email",
        destination: "البريد الإلكتروني",
        languageCode: createdLanguages.find((l) => l.code === "ar")?.id || 5,
        context: {
          category: "ui",
          module: "auth",
          component: "form",
          field: "email",
        },
        isApproved: true,
      },
      {
        original: "Password",
        destination: "كلمة المرور",
        languageCode: createdLanguages.find((l) => l.code === "ar")?.id || 5,
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
          await manageTranslationUseCase.create(translationData);
        console.log(
          `✅ Created translation: "${translation.original}" → "${translation.destination}"`
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
    const languageCount = await manageLanguageUseCase.getCount();
    const translationCount = await manageTranslationUseCase.getCount();
    console.log(`📊 Total languages in database: ${languageCount.count}`);
    console.log(`📊 Total translations in database: ${translationCount.count}`);

    // Test translation
    console.log("🧮 Testing translation...");
    try {
      const testTranslation = await translateTextUseCase.execute({
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
