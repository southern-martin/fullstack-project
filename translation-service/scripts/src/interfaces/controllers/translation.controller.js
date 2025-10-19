"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
exports.TranslationController = void 0;
var common_1 = require("@nestjs/common");
var infrastructure_1 = require("@shared/infrastructure");
/**
 * TranslationController
 *
 * This controller handles incoming HTTP requests related to translation management.
 * It acts as an adapter, translating HTTP requests into calls to application
 * layer use cases and mapping their results back to HTTP responses.
 */
var TranslationController = function () {
    var _classDecorators = [(0, common_1.Controller)("translation")];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createLanguage_decorators;
    var _findAllLanguages_decorators;
    var _findActiveLanguages_decorators;
    var _getLanguageCount_decorators;
    var _findLanguageById_decorators;
    var _findLanguageByCode_decorators;
    var _updateLanguage_decorators;
    var _deleteLanguage_decorators;
    var _createTranslation_decorators;
    var _findAllTranslations_decorators;
    var _getTranslationCount_decorators;
    var _findPendingApprovals_decorators;
    var _findTranslationById_decorators;
    var _updateTranslation_decorators;
    var _approveTranslation_decorators;
    var _deleteTranslation_decorators;
    var _translateText_decorators;
    var _translateBatch_decorators;
    var _getTranslationStats_decorators;
    var TranslationController = _classThis = /** @class */ (function () {
        function TranslationController_1(manageLanguageUseCase, manageTranslationUseCase, translateTextUseCase) {
            this.manageLanguageUseCase = (__runInitializers(this, _instanceExtraInitializers), manageLanguageUseCase);
            this.manageTranslationUseCase = manageTranslationUseCase;
            this.translateTextUseCase = translateTextUseCase;
        }
        // Language Management
        /**
         * Creates a new language.
         * POST /translation/languages
         * @param createLanguageDto The data for creating the language.
         * @returns The created language.
         */
        TranslationController_1.prototype.createLanguage = function (createLanguageDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageLanguageUseCase.create(createLanguageDto)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Retrieves all languages.
         * GET /translation/languages
         * @returns A list of languages.
         */
        TranslationController_1.prototype.findAllLanguages = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageLanguageUseCase.getAll()];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result.languages];
                    }
                });
            });
        };
        /**
         * Retrieves all active languages.
         * GET /translation/languages/active
         * @returns A list of active languages.
         */
        TranslationController_1.prototype.findActiveLanguages = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageLanguageUseCase.getActive()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Retrieves the total count of languages.
         * GET /translation/languages/count
         * @returns An object containing the total count.
         */
        TranslationController_1.prototype.getLanguageCount = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageLanguageUseCase.getCount()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Retrieves a language by code (primary key in old system).
         * GET /translation/languages/:code
         * @param code The language code.
         * @returns The language.
         */
        TranslationController_1.prototype.findLanguageById = function (code) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageLanguageUseCase.getById(code)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Retrieves a language by code.
         * GET /translation/languages/code/:code
         * @param code The language code.
         * @returns The language.
         */
        TranslationController_1.prototype.findLanguageByCode = function (code) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageLanguageUseCase.getByCode(code)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Updates an existing language.
         * PATCH /translation/languages/:code
         * @param code The language code (primary key).
         * @param updateLanguageDto The data for updating the language.
         * @returns The updated language.
         */
        TranslationController_1.prototype.updateLanguage = function (code, updateLanguageDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageLanguageUseCase.update(code, updateLanguageDto)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Deletes a language.
         * DELETE /translation/languages/:code
         * @param code The language code to delete.
         */
        TranslationController_1.prototype.deleteLanguage = function (code) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageLanguageUseCase.delete(code)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // Translation Management
        /**
         * Creates a new translation.
         * POST /translation/translations
         * @param createTranslationDto The data for creating the translation.
         * @returns The created translation.
         */
        TranslationController_1.prototype.createTranslation = function (createTranslationDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageTranslationUseCase.create(createTranslationDto)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Retrieves all translations with pagination and optional search.
         * GET /translation/translations
         * @param page The page number (default: 1).
         * @param limit The number of items per page (default: 10).
         * @param search Optional search string.
         * @returns A paginated list of translations.
         */
        TranslationController_1.prototype.findAllTranslations = function () {
            return __awaiter(this, arguments, void 0, function (page, limit, search) {
                var pageNum, limitNum, pagination;
                if (page === void 0) { page = "1"; }
                if (limit === void 0) { limit = "10"; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pageNum = parseInt(page, 10) || 1;
                            limitNum = parseInt(limit, 10) || 10;
                            pagination = new infrastructure_1.PaginationDto();
                            pagination.page = pageNum;
                            pagination.limit = limitNum;
                            pagination.search = search || "";
                            pagination.sortBy = "createdAt";
                            pagination.sortOrder = "desc";
                            return [4 /*yield*/, this.manageTranslationUseCase.getAll(pagination)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Retrieves the total count of translations.
         * GET /translation/translations/count
         * @returns An object containing the total count.
         */
        TranslationController_1.prototype.getTranslationCount = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageTranslationUseCase.getCount()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Retrieves all pending approval translations.
         * GET /translation/translations/pending
         * @returns A list of pending translations.
         */
        TranslationController_1.prototype.findPendingApprovals = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageTranslationUseCase.getPendingApprovals()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Retrieves a translation by ID.
         * GET /translation/translations/:id
         * @param id The ID of the translation.
         * @returns The translation.
         */
        TranslationController_1.prototype.findTranslationById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageTranslationUseCase.getById(id)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Updates an existing translation.
         * PATCH /translation/translations/:id
         * @param id The ID of the translation to update.
         * @param updateTranslationDto The data for updating the translation.
         * @returns The updated translation.
         */
        TranslationController_1.prototype.updateTranslation = function (id, updateTranslationDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageTranslationUseCase.update(id, updateTranslationDto)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Approves a translation.
         * PATCH /translation/translations/:id/approve
         * @param id The ID of the translation to approve.
         * @param body The approval data.
         * @returns The approved translation.
         */
        TranslationController_1.prototype.approveTranslation = function (id, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageTranslationUseCase.approve(id, body.approvedBy)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Deletes a translation.
         * DELETE /translation/translations/:id
         * @param id The ID of the translation to delete.
         */
        TranslationController_1.prototype.deleteTranslation = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.manageTranslationUseCase.delete(id)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // Translation Operations
        /**
         * Translates a text.
         * POST /translation/translate
         * @param translateTextDto The data for text translation.
         * @returns Translation result with translated text and cache status.
         */
        TranslationController_1.prototype.translateText = function (translateTextDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.translateTextUseCase.execute(translateTextDto)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Translates multiple texts in batch.
         * POST /translation/translate/batch
         * @param body The batch translation data.
         * @returns Array of translation results.
         */
        TranslationController_1.prototype.translateBatch = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.translateTextUseCase.executeBatch(body.texts, body.targetLanguage, body.sourceLanguage)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Gets translation statistics for a language.
         * GET /translation/stats/:languageCode
         * @param languageCode The language code.
         * @returns Translation statistics.
         */
        TranslationController_1.prototype.getTranslationStats = function (languageCode) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.translateTextUseCase.getTranslationStats(languageCode)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return TranslationController_1;
    }());
    __setFunctionName(_classThis, "TranslationController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createLanguage_decorators = [(0, common_1.Post)("languages"), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        _findAllLanguages_decorators = [(0, common_1.Get)("languages")];
        _findActiveLanguages_decorators = [(0, common_1.Get)("languages/active")];
        _getLanguageCount_decorators = [(0, common_1.Get)("languages/count")];
        _findLanguageById_decorators = [(0, common_1.Get)("languages/:code")];
        _findLanguageByCode_decorators = [(0, common_1.Get)("languages/code/:code")];
        _updateLanguage_decorators = [(0, common_1.Patch)("languages/:code")];
        _deleteLanguage_decorators = [(0, common_1.Delete)("languages/:code"), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT)];
        _createTranslation_decorators = [(0, common_1.Post)("translations"), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED)];
        _findAllTranslations_decorators = [(0, common_1.Get)("translations")];
        _getTranslationCount_decorators = [(0, common_1.Get)("translations/count")];
        _findPendingApprovals_decorators = [(0, common_1.Get)("translations/pending")];
        _findTranslationById_decorators = [(0, common_1.Get)("translations/:id")];
        _updateTranslation_decorators = [(0, common_1.Patch)("translations/:id")];
        _approveTranslation_decorators = [(0, common_1.Patch)("translations/:id/approve")];
        _deleteTranslation_decorators = [(0, common_1.Delete)("translations/:id"), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT)];
        _translateText_decorators = [(0, common_1.Post)("translate")];
        _translateBatch_decorators = [(0, common_1.Post)("translate/batch")];
        _getTranslationStats_decorators = [(0, common_1.Get)("stats/:languageCode")];
        __esDecorate(_classThis, null, _createLanguage_decorators, { kind: "method", name: "createLanguage", static: false, private: false, access: { has: function (obj) { return "createLanguage" in obj; }, get: function (obj) { return obj.createLanguage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllLanguages_decorators, { kind: "method", name: "findAllLanguages", static: false, private: false, access: { has: function (obj) { return "findAllLanguages" in obj; }, get: function (obj) { return obj.findAllLanguages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findActiveLanguages_decorators, { kind: "method", name: "findActiveLanguages", static: false, private: false, access: { has: function (obj) { return "findActiveLanguages" in obj; }, get: function (obj) { return obj.findActiveLanguages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLanguageCount_decorators, { kind: "method", name: "getLanguageCount", static: false, private: false, access: { has: function (obj) { return "getLanguageCount" in obj; }, get: function (obj) { return obj.getLanguageCount; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findLanguageById_decorators, { kind: "method", name: "findLanguageById", static: false, private: false, access: { has: function (obj) { return "findLanguageById" in obj; }, get: function (obj) { return obj.findLanguageById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findLanguageByCode_decorators, { kind: "method", name: "findLanguageByCode", static: false, private: false, access: { has: function (obj) { return "findLanguageByCode" in obj; }, get: function (obj) { return obj.findLanguageByCode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateLanguage_decorators, { kind: "method", name: "updateLanguage", static: false, private: false, access: { has: function (obj) { return "updateLanguage" in obj; }, get: function (obj) { return obj.updateLanguage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteLanguage_decorators, { kind: "method", name: "deleteLanguage", static: false, private: false, access: { has: function (obj) { return "deleteLanguage" in obj; }, get: function (obj) { return obj.deleteLanguage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createTranslation_decorators, { kind: "method", name: "createTranslation", static: false, private: false, access: { has: function (obj) { return "createTranslation" in obj; }, get: function (obj) { return obj.createTranslation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllTranslations_decorators, { kind: "method", name: "findAllTranslations", static: false, private: false, access: { has: function (obj) { return "findAllTranslations" in obj; }, get: function (obj) { return obj.findAllTranslations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTranslationCount_decorators, { kind: "method", name: "getTranslationCount", static: false, private: false, access: { has: function (obj) { return "getTranslationCount" in obj; }, get: function (obj) { return obj.getTranslationCount; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findPendingApprovals_decorators, { kind: "method", name: "findPendingApprovals", static: false, private: false, access: { has: function (obj) { return "findPendingApprovals" in obj; }, get: function (obj) { return obj.findPendingApprovals; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findTranslationById_decorators, { kind: "method", name: "findTranslationById", static: false, private: false, access: { has: function (obj) { return "findTranslationById" in obj; }, get: function (obj) { return obj.findTranslationById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateTranslation_decorators, { kind: "method", name: "updateTranslation", static: false, private: false, access: { has: function (obj) { return "updateTranslation" in obj; }, get: function (obj) { return obj.updateTranslation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approveTranslation_decorators, { kind: "method", name: "approveTranslation", static: false, private: false, access: { has: function (obj) { return "approveTranslation" in obj; }, get: function (obj) { return obj.approveTranslation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteTranslation_decorators, { kind: "method", name: "deleteTranslation", static: false, private: false, access: { has: function (obj) { return "deleteTranslation" in obj; }, get: function (obj) { return obj.deleteTranslation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _translateText_decorators, { kind: "method", name: "translateText", static: false, private: false, access: { has: function (obj) { return "translateText" in obj; }, get: function (obj) { return obj.translateText; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _translateBatch_decorators, { kind: "method", name: "translateBatch", static: false, private: false, access: { has: function (obj) { return "translateBatch" in obj; }, get: function (obj) { return obj.translateBatch; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTranslationStats_decorators, { kind: "method", name: "getTranslationStats", static: false, private: false, access: { has: function (obj) { return "getTranslationStats" in obj; }, get: function (obj) { return obj.getTranslationStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TranslationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TranslationController = _classThis;
}();
exports.TranslationController = TranslationController;
