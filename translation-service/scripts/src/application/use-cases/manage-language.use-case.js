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
exports.ManageLanguageUseCase = void 0;
var common_1 = require("@nestjs/common");
var language_entity_1 = require("../../domain/entities/language.entity");
var language_response_dto_1 = require("../dto/language-response.dto");
/**
 * ManageLanguageUseCase
 *
 * This use case handles the creation, retrieval, update, and deletion of languages.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
var ManageLanguageUseCase = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ManageLanguageUseCase = _classThis = /** @class */ (function () {
        function ManageLanguageUseCase_1(languageRepository, translationDomainService) {
            this.languageRepository = languageRepository;
            this.translationDomainService = translationDomainService;
        }
        /**
         * Creates a new language.
         * @param createLanguageDto The data for creating the language.
         * @returns Created language response
         */
        ManageLanguageUseCase_1.prototype.create = function (createLanguageDto) {
            return __awaiter(this, void 0, void 0, function () {
                var validation, existingLanguage, currentDefault, language, savedLanguage;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            validation = this.translationDomainService.validateLanguageCreationData(createLanguageDto);
                            if (!validation.isValid) {
                                throw new common_1.BadRequestException(validation.errors.join(", "));
                            }
                            return [4 /*yield*/, this.languageRepository.findByCode(createLanguageDto.code)];
                        case 1:
                            existingLanguage = _b.sent();
                            if (existingLanguage) {
                                throw new common_1.ConflictException("Language with code ".concat(createLanguageDto.code, " already exists"));
                            }
                            if (!createLanguageDto.isDefault) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.languageRepository.findDefault()];
                        case 2:
                            currentDefault = _b.sent();
                            if (!currentDefault) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.languageRepository.update(currentDefault.code, {
                                    isDefault: false,
                                })];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4:
                            language = new language_entity_1.Language({
                                code: createLanguageDto.code,
                                name: createLanguageDto.name,
                                localName: createLanguageDto.localName || createLanguageDto.name,
                                status: createLanguageDto.status || 'active',
                                flag: createLanguageDto.flag,
                                isDefault: (_a = createLanguageDto.isDefault) !== null && _a !== void 0 ? _a : false,
                                metadata: createLanguageDto.metadata || {},
                            });
                            return [4 /*yield*/, this.languageRepository.create(language)];
                        case 5:
                            savedLanguage = _b.sent();
                            // 6. Return response
                            return [2 /*return*/, language_response_dto_1.LanguageResponseDto.fromDomain(savedLanguage)];
                    }
                });
            });
        };
        /**
         * Retrieves a language by its code (primary key in old system).
         * @param code The language code.
         * @returns The language response DTO.
         * @throws NotFoundException if the language is not found.
         */
        ManageLanguageUseCase_1.prototype.getById = function (code) {
            return __awaiter(this, void 0, void 0, function () {
                var language;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageRepository.findById(code)];
                        case 1:
                            language = _a.sent();
                            if (!language) {
                                throw new common_1.NotFoundException("Language not found");
                            }
                            return [2 /*return*/, language_response_dto_1.LanguageResponseDto.fromDomain(language)];
                    }
                });
            });
        };
        /**
         * Retrieves a language by its code.
         * @param code The language code.
         * @returns The language response DTO.
         * @throws NotFoundException if the language is not found.
         */
        ManageLanguageUseCase_1.prototype.getByCode = function (code) {
            return __awaiter(this, void 0, void 0, function () {
                var language;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageRepository.findByCode(code)];
                        case 1:
                            language = _a.sent();
                            if (!language) {
                                throw new common_1.NotFoundException("Language not found");
                            }
                            return [2 /*return*/, language_response_dto_1.LanguageResponseDto.fromDomain(language)];
                    }
                });
            });
        };
        /**
         * Retrieves all languages with pagination.
         * @param pagination Pagination parameters
         * @returns A paginated list of language response DTOs.
         */
        ManageLanguageUseCase_1.prototype.getAll = function (pagination) {
            return __awaiter(this, void 0, void 0, function () {
                var result, languages;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!pagination) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.languageRepository.findPaginated(pagination)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    languages: result.languages.map(function (language) {
                                        return _this.mapToResponseDto(language);
                                    }),
                                    total: result.total,
                                }];
                        case 2: return [4 /*yield*/, this.languageRepository.findActive()];
                        case 3:
                            languages = _a.sent();
                            return [2 /*return*/, {
                                    languages: languages.map(function (language) { return _this.mapToResponseDto(language); }),
                                    total: languages.length,
                                }];
                    }
                });
            });
        };
        /**
         * Retrieves all active languages.
         * @returns A list of active language response DTOs.
         */
        ManageLanguageUseCase_1.prototype.getActive = function () {
            return __awaiter(this, void 0, void 0, function () {
                var languages;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageRepository.findActive()];
                        case 1:
                            languages = _a.sent();
                            return [2 /*return*/, languages.map(function (language) { return _this.mapToResponseDto(language); })];
                    }
                });
            });
        };
        /**
         * Retrieves the total count of languages.
         * @returns An object containing the total count.
         */
        ManageLanguageUseCase_1.prototype.getCount = function () {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageRepository.count()];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, { count: count }];
                    }
                });
            });
        };
        /**
         * Updates an existing language.
         * @param code The language code (primary key).
         * @param updateLanguageDto The data for updating the language.
         * @returns Updated language response
         */
        ManageLanguageUseCase_1.prototype.update = function (code, updateLanguageDto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingLanguage, validation, currentDefault, updatedLanguage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageRepository.findById(code)];
                        case 1:
                            existingLanguage = _a.sent();
                            if (!existingLanguage) {
                                throw new common_1.NotFoundException("Language not found");
                            }
                            validation = this.translationDomainService.validateLanguageUpdateData(updateLanguageDto);
                            if (!validation.isValid) {
                                throw new common_1.BadRequestException(validation.errors.join(", "));
                            }
                            if (!updateLanguageDto.isDefault) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.languageRepository.findDefault()];
                        case 2:
                            currentDefault = _a.sent();
                            if (!(currentDefault && currentDefault.code !== code)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.languageRepository.update(currentDefault.code, {
                                    isDefault: false,
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.languageRepository.update(code, updateLanguageDto)];
                        case 5:
                            updatedLanguage = _a.sent();
                            // 5. Return response
                            return [2 /*return*/, language_response_dto_1.LanguageResponseDto.fromDomain(updatedLanguage)];
                    }
                });
            });
        };
        /**
         * Deletes a language.
         * @param code The language code (primary key).
         * @throws NotFoundException if the language is not found.
         * @throws BadRequestException if the language cannot be deleted due to business rules.
         */
        ManageLanguageUseCase_1.prototype.delete = function (code) {
            return __awaiter(this, void 0, void 0, function () {
                var existingLanguage, hasTranslations;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageRepository.findById(code)];
                        case 1:
                            existingLanguage = _a.sent();
                            if (!existingLanguage) {
                                throw new common_1.NotFoundException("Language not found");
                            }
                            hasTranslations = false;
                            if (!this.translationDomainService.canDeleteLanguage(existingLanguage, hasTranslations)) {
                                throw new common_1.BadRequestException("Cannot delete default language or language with existing translations");
                            }
                            // 3. Delete language from repository
                            return [4 /*yield*/, this.languageRepository.delete(code)];
                        case 2:
                            // 3. Delete language from repository
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Maps a domain Language entity to a LanguageResponseDto.
         * @param language The domain Language entity.
         * @returns The LanguageResponseDto.
         */
        ManageLanguageUseCase_1.prototype.mapToResponseDto = function (language) {
            return language_response_dto_1.LanguageResponseDto.fromDomain(language);
        };
        return ManageLanguageUseCase_1;
    }());
    __setFunctionName(_classThis, "ManageLanguageUseCase");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ManageLanguageUseCase = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ManageLanguageUseCase = _classThis;
}();
exports.ManageLanguageUseCase = ManageLanguageUseCase;
