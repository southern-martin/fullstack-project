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
exports.ManageTranslationUseCase = void 0;
var common_1 = require("@nestjs/common");
var language_value_entity_1 = require("../../domain/entities/language-value.entity");
var translation_response_dto_1 = require("../dto/translation-response.dto");
/**
 * ManageTranslationUseCase
 *
 * This use case handles the creation, retrieval, update, and deletion of translations.
 * It orchestrates the domain logic (validation) and persistence (repository).
 */
var ManageTranslationUseCase = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ManageTranslationUseCase = _classThis = /** @class */ (function () {
        function ManageTranslationUseCase_1(languageValueRepository, translationDomainService) {
            this.languageValueRepository = languageValueRepository;
            this.translationDomainService = translationDomainService;
        }
        /**
         * Creates a new translation.
         * @param createTranslationDto The data for creating the translation.
         * @returns Created translation response
         */
        ManageTranslationUseCase_1.prototype.create = function (createTranslationDto) {
            return __awaiter(this, void 0, void 0, function () {
                var validation, key, existingTranslation, languageValue, savedTranslation;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            validation = this.translationDomainService.validateTranslationCreationData(createTranslationDto);
                            if (!validation.isValid) {
                                throw new common_1.BadRequestException(validation.errors.join(", "));
                            }
                            key = this.translationDomainService.generateTranslationKey(createTranslationDto.original, createTranslationDto.languageCode);
                            return [4 /*yield*/, this.languageValueRepository.findByKeyAndLanguage(key, createTranslationDto.languageCode)];
                        case 1:
                            existingTranslation = _b.sent();
                            if (existingTranslation) {
                                throw new common_1.ConflictException("Translation already exists");
                            }
                            languageValue = new language_value_entity_1.LanguageValue({
                                key: key,
                                original: createTranslationDto.original,
                                destination: createTranslationDto.destination,
                                languageCode: createTranslationDto.languageCode,
                                context: createTranslationDto.context || {},
                                isApproved: (_a = createTranslationDto.isApproved) !== null && _a !== void 0 ? _a : false,
                            });
                            return [4 /*yield*/, this.languageValueRepository.create(languageValue)];
                        case 2:
                            savedTranslation = _b.sent();
                            // 6. Return response
                            return [2 /*return*/, translation_response_dto_1.TranslationResponseDto.fromDomain(savedTranslation)];
                    }
                });
            });
        };
        /**
         * Retrieves a translation by its ID.
         * @param id The ID of the translation.
         * @returns The translation response DTO.
         * @throws NotFoundException if the translation is not found.
         */
        ManageTranslationUseCase_1.prototype.getById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var translation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageValueRepository.findById(id)];
                        case 1:
                            translation = _a.sent();
                            if (!translation) {
                                throw new common_1.NotFoundException("Translation not found");
                            }
                            return [2 /*return*/, translation_response_dto_1.TranslationResponseDto.fromDomain(translation)];
                    }
                });
            });
        };
        /**
         * Retrieves all translations with pagination and optional search.
         * @param pagination Pagination parameters
         * @returns A paginated list of translation response DTOs.
         */
        ManageTranslationUseCase_1.prototype.getAll = function (pagination) {
            return __awaiter(this, void 0, void 0, function () {
                var result, languageValues;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!pagination) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.languageValueRepository.findPaginated(pagination)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
                                    translations: result.languageValues.map(function (translation) {
                                        return _this.mapToResponseDto(translation);
                                    }),
                                    total: result.total,
                                }];
                        case 2: return [4 /*yield*/, this.languageValueRepository.findMany([])];
                        case 3:
                            languageValues = _a.sent();
                            return [2 /*return*/, {
                                    translations: languageValues.map(function (translation) {
                                        return _this.mapToResponseDto(translation);
                                    }),
                                    total: languageValues.length,
                                }];
                    }
                });
            });
        };
        /**
         * Retrieves all pending approval translations.
         * @returns A list of pending translation response DTOs.
         */
        ManageTranslationUseCase_1.prototype.getPendingApprovals = function () {
            return __awaiter(this, void 0, void 0, function () {
                var pendingTranslations;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageValueRepository.findPendingApproval()];
                        case 1:
                            pendingTranslations = _a.sent();
                            return [2 /*return*/, pendingTranslations.map(function (translation) {
                                    return _this.mapToResponseDto(translation);
                                })];
                    }
                });
            });
        };
        /**
         * Retrieves the total count of translations.
         * @returns An object containing the total count.
         */
        ManageTranslationUseCase_1.prototype.getCount = function () {
            return __awaiter(this, void 0, void 0, function () {
                var count;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageValueRepository.count()];
                        case 1:
                            count = _a.sent();
                            return [2 /*return*/, { count: count }];
                    }
                });
            });
        };
        /**
         * Updates an existing translation.
         * @param id The ID of the translation to update.
         * @param updateTranslationDto The data for updating the translation.
         * @returns Updated translation response
         */
        ManageTranslationUseCase_1.prototype.update = function (id, updateTranslationDto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingTranslation, validation, updatedTranslation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageValueRepository.findById(id)];
                        case 1:
                            existingTranslation = _a.sent();
                            if (!existingTranslation) {
                                throw new common_1.NotFoundException("Translation not found");
                            }
                            validation = this.translationDomainService.validateTranslationUpdateData(updateTranslationDto);
                            if (!validation.isValid) {
                                throw new common_1.BadRequestException(validation.errors.join(", "));
                            }
                            return [4 /*yield*/, this.languageValueRepository.update(id, updateTranslationDto)];
                        case 2:
                            updatedTranslation = _a.sent();
                            // 4. Return response
                            return [2 /*return*/, translation_response_dto_1.TranslationResponseDto.fromDomain(updatedTranslation)];
                    }
                });
            });
        };
        /**
         * Approves a translation.
         * @param id The ID of the translation to approve.
         * @param approvedBy The user who approved the translation.
         * @returns Approved translation response
         */
        ManageTranslationUseCase_1.prototype.approve = function (id, approvedBy) {
            return __awaiter(this, void 0, void 0, function () {
                var existingTranslation, updatedTranslation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageValueRepository.findById(id)];
                        case 1:
                            existingTranslation = _a.sent();
                            if (!existingTranslation) {
                                throw new common_1.NotFoundException("Translation not found");
                            }
                            // 2. Check if translation can be approved
                            if (!this.translationDomainService.canApproveTranslation(existingTranslation)) {
                                throw new common_1.BadRequestException("Translation is already approved");
                            }
                            return [4 /*yield*/, this.languageValueRepository.update(id, {
                                    isApproved: true,
                                    approvedBy: approvedBy,
                                    approvedAt: new Date(),
                                })];
                        case 2:
                            updatedTranslation = _a.sent();
                            // 4. Return response
                            return [2 /*return*/, translation_response_dto_1.TranslationResponseDto.fromDomain(updatedTranslation)];
                    }
                });
            });
        };
        /**
         * Deletes a translation.
         * @param id The ID of the translation to delete.
         * @throws NotFoundException if the translation is not found.
         * @throws BadRequestException if the translation cannot be deleted due to business rules.
         */
        ManageTranslationUseCase_1.prototype.delete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var existingTranslation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.languageValueRepository.findById(id)];
                        case 1:
                            existingTranslation = _a.sent();
                            if (!existingTranslation) {
                                throw new common_1.NotFoundException("Translation not found");
                            }
                            // 2. Apply business rules for deletion
                            if (!this.translationDomainService.canDeleteTranslation(existingTranslation)) {
                                throw new common_1.BadRequestException("Cannot delete approved translation with high usage count");
                            }
                            // 3. Delete translation from repository
                            return [4 /*yield*/, this.languageValueRepository.delete(id)];
                        case 2:
                            // 3. Delete translation from repository
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Maps a domain LanguageValue entity to a TranslationResponseDto.
         * @param translation The domain LanguageValue entity.
         * @returns The TranslationResponseDto.
         */
        ManageTranslationUseCase_1.prototype.mapToResponseDto = function (translation) {
            return translation_response_dto_1.TranslationResponseDto.fromDomain(translation);
        };
        return ManageTranslationUseCase_1;
    }());
    __setFunctionName(_classThis, "ManageTranslationUseCase");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ManageTranslationUseCase = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ManageTranslationUseCase = _classThis;
}();
exports.ManageTranslationUseCase = ManageTranslationUseCase;
