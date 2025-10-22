/**
 * Seed Script for Roles Tab Translation
 * 
 * This script seeds the translation for the "Roles & Permissions" tab label
 * into the Translation Service database.
 */

export {};

interface TranslationPair {
  sourceText: string;
  french: string;
  spanish: string;
}

const TRANSLATION_SERVICE_URL = 'http://localhost:3007/api/v1/translation';

// Translation for the new Roles tab
const rolesTabTranslation: TranslationPair = {
  sourceText: 'Roles & Permissions',
  french: 'Rôles et autorisations',
  spanish: 'Roles y permisos'
};

async function seedTranslation(sourceText: string, destination: string, languageCode: string) {
  try {
    const response = await fetch(`${TRANSLATION_SERVICE_URL}/translations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        original: sourceText,
        destination: destination,
        languageCode: languageCode,
        context: { module: 'profile', component: 'tabs' },
        isApproved: true,
      }),
    });

    if (response.status === 201) {
      console.log(`✅ Seeded ${languageCode.toUpperCase()}: "${sourceText}" → "${destination}"`);
      return { success: true, existed: false };
    } else if (response.status === 409) {
      console.log(`⚠️  Already exists ${languageCode.toUpperCase()}: "${sourceText}"`);
      return { success: true, existed: true };
    } else {
      const errorText = await response.text();
      console.error(`❌ Error seeding ${languageCode.toUpperCase()}: "${sourceText}" - ${response.status} ${errorText}`);
      return { success: false, existed: false };
    }
  } catch (error) {
    console.error(`❌ Error seeding ${languageCode.toUpperCase()}: "${sourceText}"`, error);
    return { success: false, existed: false };
  }
}

async function seedRolesTabTranslation() {
  console.log('🌱 Starting Roles Tab Translation Seeding...');
  console.log(`📊 Seeding: "${rolesTabTranslation.sourceText}"\n`);

  let successCount = 0;
  let existedCount = 0;
  let errorCount = 0;

  // Seed French translation
  const frResult = await seedTranslation(
    rolesTabTranslation.sourceText,
    rolesTabTranslation.french,
    'fr'
  );
  
  if (frResult.success) {
    if (frResult.existed) {
      existedCount++;
    } else {
      successCount++;
    }
  } else {
    errorCount++;
  }

  // Small delay between requests
  await new Promise(resolve => setTimeout(resolve, 50));

  // Seed Spanish translation
  const esResult = await seedTranslation(
    rolesTabTranslation.sourceText,
    rolesTabTranslation.spanish,
    'es'
  );
  
  if (esResult.success) {
    if (esResult.existed) {
      existedCount++;
    } else {
      successCount++;
    }
  } else {
    errorCount++;
  }

  console.log('\n✅ Roles Tab Translation Seeding Complete!');
  console.log('📊 Summary:');
  console.log(`   - Successfully seeded: ${successCount}`);
  console.log(`   - Already existed (skipped): ${existedCount}`);
  console.log(`   - Errors: ${errorCount}`);
  console.log(`   - Total processed: ${successCount + existedCount + errorCount}`);
  console.log('\n🎉 Seeding process finished!');
}

// Run the seeding
seedRolesTabTranslation().catch(console.error);
