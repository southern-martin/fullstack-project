"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationDomainService = void 0;
var common_1 = require("@nestjs/common");
/**
 * TranslationDomainService
 *
 * This service encapsulates the core business logic and rules related to translations.
 * It operates on Language and LanguageValue entities and ensures that business rules are enforced
 * independently of application-specific concerns (like data storage or UI).
 */
var TranslationDomainService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TranslationDomainService = _classThis = /** @class */ (function () {
        function TranslationDomainService_1() {
        }
        /**
         * Validates language creation data against business rules.
         * @param languageData Partial language data for creation.
         * @returns Validation result with isValid flag and an array of errors.
         */
        TranslationDomainService_1.prototype.validateLanguageCreationData = function (languageData) {
            var errors = [];
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
            if (languageData.localName && languageData.localName.trim().length < 2) {
                errors.push("Local name must be at least 2 characters if provided");
            }
            return {
                isValid: errors.length === 0,
                errors: errors,
            };
        };
        /**
         * Validates language update data against business rules.
         * @param updateData Partial language data for update.
         * @returns Validation result with isValid flag and an array of errors.
         */
        TranslationDomainService_1.prototype.validateLanguageUpdateData = function (updateData) {
            var errors = [];
            // Code validation
            if (updateData.code !== undefined &&
                !this.isValidLanguageCode(updateData.code)) {
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
            if (updateData.localName !== undefined &&
                updateData.localName &&
                updateData.localName.trim().length < 2) {
                errors.push("Local name must be at least 2 characters if provided");
            }
            return {
                isValid: errors.length === 0,
                errors: errors,
            };
        };
        /**
         * Validates translation creation data against business rules.
         * @param translationData Partial translation data for creation.
         * @returns Validation result with isValid flag and an array of errors.
         */
        TranslationDomainService_1.prototype.validateTranslationCreationData = function (translationData) {
            var errors = [];
            // Original text validation
            if (!translationData.original ||
                translationData.original.trim().length === 0) {
                errors.push("Original text is required");
            }
            if (translationData.original &&
                translationData.original.length > 5000) {
                errors.push("Original text must not exceed 5000 characters");
            }
            // Translated text validation
            if (!translationData.destination ||
                translationData.destination.trim().length === 0) {
                errors.push("Translated text is required");
            }
            if (translationData.destination &&
                translationData.destination.length > 5000) {
                errors.push("Translated text must not exceed 5000 characters");
            }
            // Language code validation (old system uses string code)
            if (!translationData.languageCode || typeof translationData.languageCode !== 'string') {
                errors.push("Valid language code is required");
            }
            return {
                isValid: errors.length === 0,
                errors: errors,
            };
        };
        /**
         * Validates translation update data against business rules.
         * @param updateData Partial translation data for update.
         * @returns Validation result with isValid flag and an array of errors.
         */
        TranslationDomainService_1.prototype.validateTranslationUpdateData = function (updateData) {
            var errors = [];
            // Original text validation
            if (updateData.original !== undefined) {
                if (!updateData.original ||
                    updateData.original.trim().length === 0) {
                    errors.push("Original text cannot be empty");
                }
                if (updateData.original.length > 5000) {
                    errors.push("Original text must not exceed 5000 characters");
                }
            }
            // Translated text validation
            if (updateData.destination !== undefined) {
                if (!updateData.destination ||
                    updateData.destination.trim().length === 0) {
                    errors.push("Translated text cannot be empty");
                }
                if (updateData.destination.length > 5000) {
                    errors.push("Translated text must not exceed 5000 characters");
                }
            }
            return {
                isValid: errors.length === 0,
                errors: errors,
            };
        };
        /**
         * Generates an MD5 key for translation caching.
         * Business rule: Key must be unique and consistent for the same text and language.
         * @param text The original text.
         * @param languageCode The language code (e.g., 'en', 'es').
         * @returns MD5 hash key.
         */
        TranslationDomainService_1.prototype.generateTranslationKey = function (text, languageCode) {
            if (!text || typeof text !== "string") {
                throw new Error("Text must be a non-empty string");
            }
            if (!languageCode || typeof languageCode !== "string") {
                throw new Error("Valid language code is required");
            }
            var keyData = "".concat(text.trim(), "_").concat(languageCode);
            return this.createMD5Hash(keyData);
        };
        /**
         * Determines if a translation can be approved.
         * Business rule: Only pending translations can be approved.
         * @param translation The translation entity.
         * @returns True if the translation can be approved, false otherwise.
         */
        TranslationDomainService_1.prototype.canApproveTranslation = function (translation) {
            return !translation.isApproved;
        };
        /**
         * Determines if a translation can be deleted.
         * Business rule: Cannot delete approved translations that are frequently used.
         * @param translation The translation entity.
         * @returns True if the translation can be deleted, false otherwise.
         */
        TranslationDomainService_1.prototype.canDeleteTranslation = function (translation) {
            // Business rule: Cannot delete approved translations with high usage
            if (translation.isApproved && translation.usageCount > 100) {
                return false;
            }
            return true;
        };
        /**
         * Determines if a language can be deleted.
         * Business rule: Cannot delete default language or languages with translations.
         * @param language The language entity.
         * @param hasTranslations True if the language has associated translations.
         * @returns True if the language can be deleted, false otherwise.
         */
        TranslationDomainService_1.prototype.canDeleteLanguage = function (language, hasTranslations) {
            // Business rule: Cannot delete default language
            if (language.isDefault) {
                return false;
            }
            // Business rule: Cannot delete languages with translations
            if (hasTranslations) {
                return false;
            }
            return true;
        };
        /**
         * Validates translation request data.
         * @param request The translation request data.
         * @returns Validation result with isValid flag and an array of errors.
         */
        TranslationDomainService_1.prototype.validateTranslationRequest = function (request) {
            var errors = [];
            if (!request.text || request.text.trim().length === 0) {
                errors.push("Text to translate is required");
            }
            if (request.text && request.text.length > 5000) {
                errors.push("Text to translate must not exceed 5000 characters");
            }
            if (!request.targetLanguage ||
                !this.isValidLanguageCode(request.targetLanguage)) {
                errors.push("Valid target language code is required");
            }
            return {
                isValid: errors.length === 0,
                errors: errors,
            };
        };
        /**
         * Calculates translation quality score based on various factors.
         * @param translation The translation entity.
         * @returns Quality score between 0 and 100.
         */
        TranslationDomainService_1.prototype.calculateTranslationQuality = function (translation) {
            var score = 50; // Base score
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
                var daysSinceLastUse = Math.floor((Date.now() - translation.lastUsedAt.getTime()) / (1000 * 60 * 60 * 24));
                if (daysSinceLastUse < 30) {
                    score += 10;
                }
            }
            return Math.min(100, Math.max(0, score));
        };
        // --- Private Helper Methods for Validation ---
        TranslationDomainService_1.prototype.isValidLanguageCode = function (code) {
            // ISO 639-1 language codes are 2 characters
            var languageCodeRegex = /^[a-z]{2}$/;
            return languageCodeRegex.test(code.toLowerCase());
        };
        TranslationDomainService_1.prototype.createMD5Hash = function (data) {
            var crypto = require("crypto");
            return crypto.createHash("md5").update(data).digest("hex");
        };
        return TranslationDomainService_1;
    }());
    __setFunctionName(_classThis, "TranslationDomainService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TranslationDomainService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TranslationDomainService = _classThis;
}();
exports.TranslationDomainService = TranslationDomainService;
