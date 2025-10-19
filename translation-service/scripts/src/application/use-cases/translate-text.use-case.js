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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslateTextUseCase = void 0;
var common_1 = require("@nestjs/common");
/**
 * TranslateTextUseCase
 *
 * This use case handles text translation operations, including single text translation
 * and batch translation. It orchestrates between domain services and repositories.
 */
var TranslateTextUseCase = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TranslateTextUseCase = _classThis = /** @class */ (function () {
        function TranslateTextUseCase_1(languageRepository, languageValueRepository, translationDomainService, manageTranslationUseCase) {
            this.languageRepository = languageRepository;
            this.languageValueRepository = languageValueRepository;
            this.translationDomainService = translationDomainService;
            this.manageTranslationUseCase = manageTranslationUseCase;
        }
        /**
         * Translates a single text.
         * @param translateTextDto The data for text translation.
         * @returns Translation result with translated text and cache status.
         */
        TranslateTextUseCase_1.prototype.execute = function (translateTextDto) {
            return __awaiter(this, void 0, void 0, function () {
                var validation, targetLanguage, key, existingTranslation, translatedText, createTranslationDto;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            validation = this.translationDomainService.validateTranslationRequest(translateTextDto);
                            if (!validation.isValid) {
                                throw new common_1.BadRequestException(validation.errors.join(", "));
                            }
                            return [4 /*yield*/, this.languageRepository.findByCode(translateTextDto.targetLanguage)];
                        case 1:
                            targetLanguage = _a.sent();
                            if (!targetLanguage) {
                                throw new common_1.NotFoundException("Language ".concat(translateTextDto.targetLanguage, " not found"));
                            }
                            key = this.translationDomainService.generateTranslationKey(translateTextDto.text, targetLanguage.code);
                            return [4 /*yield*/, this.languageValueRepository.findByKeyAndLanguage(key, targetLanguage.code)];
                        case 2:
                            existingTranslation = _a.sent();
                            if (!existingTranslation) return [3 /*break*/, 4];
                            // 5a. Increment usage count for cached translation
                            return [4 /*yield*/, this.languageValueRepository.incrementUsageCount(existingTranslation.id)];
                        case 3:
                            // 5a. Increment usage count for cached translation
                            _a.sent();
                            return [2 /*return*/, {
                                    translatedText: existingTranslation.destination,
                                    fromCache: true,
                                }];
                        case 4: return [4 /*yield*/, this.performTranslation(translateTextDto.text, translateTextDto.sourceLanguage || "auto", translateTextDto.targetLanguage)];
                        case 5:
                            translatedText = _a.sent();
                            createTranslationDto = {
                                original: translateTextDto.text,
                                destination: translatedText,
                                languageCode: targetLanguage.code,
                                context: translateTextDto.context,
                                isApproved: false, // Mark as pending approval
                            };
                            return [4 /*yield*/, this.manageTranslationUseCase.create(createTranslationDto)];
                        case 6:
                            _a.sent();
                            return [2 /*return*/, {
                                    translatedText: translatedText,
                                    fromCache: false,
                                }];
                    }
                });
            });
        };
        /**
         * Translates multiple texts in batch.
         * @param texts Array of texts to translate.
         * @param targetLanguage Target language code.
         * @param sourceLanguage Source language code (optional).
         * @returns Array of translation results.
         */
        TranslateTextUseCase_1.prototype.executeBatch = function (texts, targetLanguage, sourceLanguage) {
            return __awaiter(this, void 0, void 0, function () {
                var targetLanguageEntity, results, _i, texts_1, text, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageRepository.findByCode(targetLanguage)];
                        case 1:
                            targetLanguageEntity = _a.sent();
                            if (!targetLanguageEntity) {
                                throw new common_1.NotFoundException("Language ".concat(targetLanguage, " not found"));
                            }
                            // 2. Validate texts array
                            if (!texts || texts.length === 0) {
                                throw new common_1.BadRequestException("Texts array cannot be empty");
                            }
                            if (texts.length > 100) {
                                throw new common_1.BadRequestException("Cannot translate more than 100 texts at once");
                            }
                            results = [];
                            _i = 0, texts_1 = texts;
                            _a.label = 2;
                        case 2:
                            if (!(_i < texts_1.length)) return [3 /*break*/, 7];
                            text = texts_1[_i];
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.execute({
                                    text: text,
                                    targetLanguage: targetLanguage,
                                    sourceLanguage: sourceLanguage,
                                    context: {},
                                })];
                        case 4:
                            result = _a.sent();
                            results.push({
                                text: text,
                                translatedText: result.translatedText,
                                fromCache: result.fromCache,
                            });
                            return [3 /*break*/, 6];
                        case 5:
                            error_1 = _a.sent();
                            // If individual translation fails, add error result
                            results.push({
                                text: text,
                                translatedText: text, // Fallback to original text
                                fromCache: false,
                            });
                            return [3 /*break*/, 6];
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/, { translations: results }];
                    }
                });
            });
        };
        /**
         * Gets translation statistics for a language.
         * @param languageCode The language code.
         * @returns Translation statistics.
         */
        TranslateTextUseCase_1.prototype.getTranslationStats = function (languageCode) {
            return __awaiter(this, void 0, void 0, function () {
                var language, totalTranslations, approvedTranslations, pendingTranslations, cacheHitRate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageRepository.findByCode(languageCode)];
                        case 1:
                            language = _a.sent();
                            if (!language) {
                                throw new common_1.NotFoundException("Language ".concat(languageCode, " not found"));
                            }
                            return [4 /*yield*/, this.languageValueRepository.countByLanguage(language.code)];
                        case 2:
                            totalTranslations = _a.sent();
                            return [4 /*yield*/, this.languageValueRepository.countApprovedByLanguage(language.code)];
                        case 3:
                            approvedTranslations = _a.sent();
                            pendingTranslations = totalTranslations - approvedTranslations;
                            cacheHitRate = approvedTranslations > 0
                                ? (approvedTranslations / totalTranslations) * 100
                                : 0;
                            return [2 /*return*/, {
                                    totalTranslations: totalTranslations,
                                    approvedTranslations: approvedTranslations,
                                    pendingTranslations: pendingTranslations,
                                    cacheHitRate: Math.round(cacheHitRate * 100) / 100,
                                }];
                    }
                });
            });
        };
        /**
         * Performs actual translation using external service.
         * This is a placeholder implementation - in a real scenario,
         * this would integrate with Google Translate, Azure Translator, etc.
         * @param text The text to translate.
         * @param sourceLanguage The source language code.
         * @param targetLanguage The target language code.
         * @returns Translated text.
         */
        TranslateTextUseCase_1.prototype.performTranslation = function (text, sourceLanguage, targetLanguage) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // TODO: Integrate with external translation service
                    // For now, return the original text as a placeholder
                    // In a real implementation, you would:
                    // 1. Call Google Translate API
                    // 2. Call Azure Translator API
                    // 3. Call AWS Translate API
                    // 4. Or any other translation service
                    console.log("Translating \"".concat(text, "\" from ").concat(sourceLanguage, " to ").concat(targetLanguage));
                    // Placeholder: return original text with a prefix to indicate it's translated
                    return [2 /*return*/, "[".concat(targetLanguage.toUpperCase(), "] ").concat(text)];
                });
            });
        };
        return TranslateTextUseCase_1;
    }());
    __setFunctionName(_classThis, "TranslateTextUseCase");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TranslateTextUseCase = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TranslateTextUseCase = _classThis;
}();
exports.TranslateTextUseCase = TranslateTextUseCase;
