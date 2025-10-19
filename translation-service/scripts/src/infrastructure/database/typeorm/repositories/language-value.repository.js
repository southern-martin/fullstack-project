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
exports.LanguageValueRepository = void 0;
var language_value_entity_1 = require("@/domain/entities/language-value.entity");
var common_1 = require("@nestjs/common");
var language_value_typeorm_entity_1 = require("../entities/language-value.typeorm.entity");
var LanguageValueRepository = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LanguageValueRepository = _classThis = /** @class */ (function () {
        function LanguageValueRepository_1(repository) {
            this.repository = repository;
        }
        LanguageValueRepository_1.prototype.create = function (languageValue) {
            return __awaiter(this, void 0, void 0, function () {
                var entity, savedEntity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entity = this.toTypeOrmEntity(languageValue);
                            return [4 /*yield*/, this.repository.save(entity)];
                        case 1:
                            savedEntity = _a.sent();
                            return [2 /*return*/, this.toDomainEntity(savedEntity)];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var entity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repository.findOne({ where: { id: id } })];
                        case 1:
                            entity = _a.sent();
                            return [2 /*return*/, entity ? this.toDomainEntity(entity) : null];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.findByKey = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var entity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repository.findOne({ where: { key: key } })];
                        case 1:
                            entity = _a.sent();
                            return [2 /*return*/, entity ? this.toDomainEntity(entity) : null];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.findByKeyAndLanguage = function (key, languageCode) {
            return __awaiter(this, void 0, void 0, function () {
                var entity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repository.findOne({
                                where: { key: key, languageCode: languageCode },
                            })];
                        case 1:
                            entity = _a.sent();
                            return [2 /*return*/, entity ? this.toDomainEntity(entity) : null];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.save = function (languageValue) {
            return __awaiter(this, void 0, void 0, function () {
                var entity, savedEntity;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entity = this.toTypeOrmEntity(languageValue);
                            return [4 /*yield*/, this.repository.save(entity)];
                        case 1:
                            savedEntity = _a.sent();
                            return [2 /*return*/, this.toDomainEntity(savedEntity)];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.update = function (id, languageValue) {
            return __awaiter(this, void 0, void 0, function () {
                var updatedLanguageValue;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repository.update(id, languageValue)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.findById(id)];
                        case 2:
                            updatedLanguageValue = _a.sent();
                            if (!updatedLanguageValue) {
                                throw new Error("LanguageValue with id ".concat(id, " not found"));
                            }
                            return [2 /*return*/, updatedLanguageValue];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.findMany = function (ids) {
            return __awaiter(this, void 0, void 0, function () {
                var entities;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repository.findByIds(ids)];
                        case 1:
                            entities = _a.sent();
                            return [2 /*return*/, entities.map(function (entity) { return _this.toDomainEntity(entity); })];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.findByLanguage = function (languageCode) {
            return __awaiter(this, void 0, void 0, function () {
                var entities;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repository.find({
                                where: { languageCode: languageCode },
                            })];
                        case 1:
                            entities = _a.sent();
                            return [2 /*return*/, entities.map(function (entity) { return _this.toDomainEntity(entity); })];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.findByContext = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var entities;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repository
                                .createQueryBuilder("languageValue")
                                .where("JSON_EXTRACT(languageValue.context, '$.category') = :category", {
                                category: context.category,
                            })
                                .orWhere("JSON_EXTRACT(languageValue.context, '$.module') = :module", {
                                module: context.module,
                            })
                                .orWhere("JSON_EXTRACT(languageValue.context, '$.component') = :component", {
                                component: context.component,
                            })
                                .getMany()];
                        case 1:
                            entities = _a.sent();
                            return [2 /*return*/, entities.map(function (entity) { return _this.toDomainEntity(entity); })];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.findPendingApproval = function () {
            return __awaiter(this, void 0, void 0, function () {
                var entities;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repository.find({
                                where: { isApproved: false },
                            })];
                        case 1:
                            entities = _a.sent();
                            return [2 /*return*/, entities.map(function (entity) { return _this.toDomainEntity(entity); })];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.count = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.repository.count()];
                });
            });
        };
        LanguageValueRepository_1.prototype.countByLanguage = function (languageCode) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.repository.count({ where: { languageCode: languageCode } })];
                });
            });
        };
        LanguageValueRepository_1.prototype.countApprovedByLanguage = function (languageCode) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.repository.count({
                            where: { languageCode: languageCode, isApproved: true },
                        })];
                });
            });
        };
        LanguageValueRepository_1.prototype.incrementUsageCount = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repository
                                .createQueryBuilder()
                                .update(language_value_typeorm_entity_1.LanguageValueTypeOrmEntity)
                                .set({
                                usageCount: function () { return "usageCount + 1"; },
                                lastUsedAt: new Date(),
                            })
                                .where("id = :id", { id: id })
                                .execute()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.search = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var entities;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repository
                                .createQueryBuilder("languageValue")
                                .where("languageValue.original ILIKE :query", { query: "%".concat(query, "%") })
                                .orWhere("languageValue.destination ILIKE :query", {
                                query: "%".concat(query, "%"),
                            })
                                .orWhere("languageValue.key ILIKE :query", { query: "%".concat(query, "%") })
                                .getMany()];
                        case 1:
                            entities = _a.sent();
                            return [2 /*return*/, entities.map(function (entity) { return _this.toDomainEntity(entity); })];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.findPaginated = function (pagination) {
            return __awaiter(this, void 0, void 0, function () {
                var queryBuilder, _a, entities, total, languageValues;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            queryBuilder = this.repository.createQueryBuilder("languageValue");
                            // Apply search if provided
                            if (pagination.search) {
                                queryBuilder.where("languageValue.original ILIKE :search OR languageValue.destination ILIKE :search OR languageValue.key ILIKE :search", { search: "%".concat(pagination.search, "%") });
                            }
                            // Apply sorting
                            if (pagination.sortBy && pagination.sortOrder) {
                                queryBuilder.orderBy("languageValue.".concat(pagination.sortBy), pagination.sortOrder.toUpperCase());
                            }
                            else {
                                queryBuilder.orderBy("languageValue.createdAt", "DESC");
                            }
                            // Apply pagination
                            queryBuilder
                                .skip((pagination.page - 1) * pagination.limit)
                                .take(pagination.limit);
                            return [4 /*yield*/, queryBuilder.getManyAndCount()];
                        case 1:
                            _a = _b.sent(), entities = _a[0], total = _a[1];
                            languageValues = entities.map(function (entity) {
                                return _this.toDomainEntity(entity);
                            });
                            return [2 /*return*/, { languageValues: languageValues, total: total }];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.delete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.repository.delete(id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LanguageValueRepository_1.prototype.toDomainEntity = function (entity) {
            return new language_value_entity_1.LanguageValue({
                id: entity.id,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
                key: entity.key,
                original: entity.original,
                destination: entity.destination,
                languageCode: entity.languageCode,
                context: entity.context,
                isApproved: entity.isApproved,
                approvedBy: entity.approvedBy,
                approvedAt: entity.approvedAt,
                usageCount: entity.usageCount,
                lastUsedAt: entity.lastUsedAt,
            });
        };
        LanguageValueRepository_1.prototype.toTypeOrmEntity = function (languageValue) {
            var entity = new language_value_typeorm_entity_1.LanguageValueTypeOrmEntity();
            entity.id = languageValue.id;
            entity.createdAt = languageValue.createdAt;
            entity.updatedAt = languageValue.updatedAt;
            entity.key = languageValue.key;
            entity.original = languageValue.original;
            entity.destination = languageValue.destination;
            entity.languageCode = languageValue.languageCode;
            entity.context = languageValue.context;
            entity.isApproved = languageValue.isApproved;
            entity.approvedBy = languageValue.approvedBy;
            entity.approvedAt = languageValue.approvedAt;
            entity.usageCount = languageValue.usageCount;
            entity.lastUsedAt = languageValue.lastUsedAt;
            return entity;
        };
        return LanguageValueRepository_1;
    }());
    __setFunctionName(_classThis, "LanguageValueRepository");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LanguageValueRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LanguageValueRepository = _classThis;
}();
exports.LanguageValueRepository = LanguageValueRepository;
