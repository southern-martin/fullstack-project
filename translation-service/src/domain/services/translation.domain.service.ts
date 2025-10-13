import { Injectable } from "@nestjs/common";
import { LanguageValue } from "../entities/language-value.entity";
import { Language } from "../entities/language.entity";

/**
 * TranslationDomainService
 *
 * This service encapsulates the core business logic and rules related to translations.
 * It operates on Language and LanguageValue entities and ensures that business rules are enforced
 * independently of application-specific concerns (like data storage or UI).
 */
@Injectable()
export class TranslationDomainService {
  /**
   * Validates language creation data against business rules.
   * @param languageData Partial language data for creation.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateLanguageCreationData(languageData: Partial<Language>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Code validation
    if (!languageData.code || !this.isValidLanguageCode(languageData.code)) {
      errors.push("Valid language code is required (ISO 639-1 format)");
    }

    // Name validation
    if (!languageData.name || languageData.name.trim().length < 2) {
      errors.push("Language name must be at least 2 characters");
    }

    if (languageData.name && languageData.name.length > 100) {
      errors.push("Language name must not exceed 100 characters");
    }

    // Native name validation (optional)
    if (languageData.nativeName && languageData.nativeName.trim().length < 2) {
      errors.push("Native name must be at least 2 characters if provided");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates language update data against business rules.
   * @param updateData Partial language data for update.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateLanguageUpdateData(updateData: Partial<Language>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Code validation
    if (
      updateData.code !== undefined &&
      !this.isValidLanguageCode(updateData.code)
    ) {
      errors.push("Language code must be in ISO 639-1 format");
    }

    // Name validation
    if (updateData.name !== undefined) {
      if (!updateData.name || updateData.name.trim().length < 2) {
        errors.push("Language name must be at least 2 characters");
      }
      if (updateData.name.length > 100) {
        errors.push("Language name must not exceed 100 characters");
      }
    }

    // Native name validation
    if (
      updateData.nativeName !== undefined &&
      updateData.nativeName &&
      updateData.nativeName.trim().length < 2
    ) {
      errors.push("Native name must be at least 2 characters if provided");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates translation creation data against business rules.
   * @param translationData Partial translation data for creation.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateTranslationCreationData(translationData: Partial<LanguageValue>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Original text validation
    if (
      !translationData.originalText ||
      translationData.originalText.trim().length === 0
    ) {
      errors.push("Original text is required");
    }

    if (
      translationData.originalText &&
      translationData.originalText.length > 5000
    ) {
      errors.push("Original text must not exceed 5000 characters");
    }

    // Translated text validation
    if (
      !translationData.translatedText ||
      translationData.translatedText.trim().length === 0
    ) {
      errors.push("Translated text is required");
    }

    if (
      translationData.translatedText &&
      translationData.translatedText.length > 5000
    ) {
      errors.push("Translated text must not exceed 5000 characters");
    }

    // Language ID validation
    if (!translationData.languageId || translationData.languageId <= 0) {
      errors.push("Valid language ID is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates translation update data against business rules.
   * @param updateData Partial translation data for update.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateTranslationUpdateData(updateData: Partial<LanguageValue>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Original text validation
    if (updateData.originalText !== undefined) {
      if (
        !updateData.originalText ||
        updateData.originalText.trim().length === 0
      ) {
        errors.push("Original text cannot be empty");
      }
      if (updateData.originalText.length > 5000) {
        errors.push("Original text must not exceed 5000 characters");
      }
    }

    // Translated text validation
    if (updateData.translatedText !== undefined) {
      if (
        !updateData.translatedText ||
        updateData.translatedText.trim().length === 0
      ) {
        errors.push("Translated text cannot be empty");
      }
      if (updateData.translatedText.length > 5000) {
        errors.push("Translated text must not exceed 5000 characters");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generates an MD5 key for translation caching.
   * Business rule: Key must be unique and consistent for the same text and language.
   * @param text The original text.
   * @param languageId The language ID.
   * @returns MD5 hash key.
   */
  generateTranslationKey(text: string, languageId: number): string {
    if (!text || typeof text !== "string") {
      throw new Error("Text must be a non-empty string");
    }
    if (!languageId || languageId <= 0) {
      throw new Error("Valid language ID is required");
    }

    const keyData = `${text.trim()}_${languageId}`;
    return this.createMD5Hash(keyData);
  }

  /**
   * Determines if a translation can be approved.
   * Business rule: Only pending translations can be approved.
   * @param translation The translation entity.
   * @returns True if the translation can be approved, false otherwise.
   */
  canApproveTranslation(translation: LanguageValue): boolean {
    return !translation.isApproved;
  }

  /**
   * Determines if a translation can be deleted.
   * Business rule: Cannot delete approved translations that are frequently used.
   * @param translation The translation entity.
   * @returns True if the translation can be deleted, false otherwise.
   */
  canDeleteTranslation(translation: LanguageValue): boolean {
    // Business rule: Cannot delete approved translations with high usage
    if (translation.isApproved && translation.usageCount > 100) {
      return false;
    }
    return true;
  }

  /**
   * Determines if a language can be deleted.
   * Business rule: Cannot delete default language or languages with translations.
   * @param language The language entity.
   * @param hasTranslations True if the language has associated translations.
   * @returns True if the language can be deleted, false otherwise.
   */
  canDeleteLanguage(language: Language, hasTranslations: boolean): boolean {
    // Business rule: Cannot delete default language
    if (language.isDefault) {
      return false;
    }

    // Business rule: Cannot delete languages with translations
    if (hasTranslations) {
      return false;
    }

    return true;
  }

  /**
   * Validates translation request data.
   * @param request The translation request data.
   * @returns Validation result with isValid flag and an array of errors.
   */
  validateTranslationRequest(request: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!request.text || request.text.trim().length === 0) {
      errors.push("Text to translate is required");
    }

    if (request.text && request.text.length > 5000) {
      errors.push("Text to translate must not exceed 5000 characters");
    }

    if (
      !request.targetLanguage ||
      !this.isValidLanguageCode(request.targetLanguage)
    ) {
      errors.push("Valid target language code is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculates translation quality score based on various factors.
   * @param translation The translation entity.
   * @returns Quality score between 0 and 100.
   */
  calculateTranslationQuality(translation: LanguageValue): number {
    let score = 50; // Base score

    // Approved translations get higher score
    if (translation.isApproved) {
      score += 30;
    }

    // High usage count indicates good translation
    if (translation.usageCount > 10) {
      score += 20;
    }

    // Recent usage indicates relevance
    if (translation.lastUsedAt) {
      const daysSinceLastUse = Math.floor(
        (Date.now() - translation.lastUsedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastUse < 30) {
        score += 10;
      }
    }

    return Math.min(100, Math.max(0, score));
  }

  // --- Private Helper Methods for Validation ---

  private isValidLanguageCode(code: string): boolean {
    // ISO 639-1 language codes are 2 characters
    const languageCodeRegex = /^[a-z]{2}$/;
    return languageCodeRegex.test(code.toLowerCase());
  }

  private createMD5Hash(data: string): string {
    const crypto = require("crypto");
    return crypto.createHash("md5").update(data).digest("hex");
  }
}
