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
exports.ApplicationModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
// Use Cases
var manage_language_use_case_1 = require("./use-cases/manage-language.use-case");
var manage_translation_use_case_1 = require("./use-cases/manage-translation.use-case");
var translate_text_use_case_1 = require("./use-cases/translate-text.use-case");
// Domain Services
var translation_domain_service_1 = require("../domain/services/translation.domain.service");
// Repository Interfaces (will be implemented in infrastructure)
// Infrastructure Implementations
var language_value_repository_1 = require("../infrastructure/database/typeorm/repositories/language-value.repository");
var language_repository_1 = require("../infrastructure/database/typeorm/repositories/language.repository");
var language_typeorm_entity_1 = require("../infrastructure/database/typeorm/entities/language.typeorm.entity");
var language_value_typeorm_entity_1 = require("../infrastructure/database/typeorm/entities/language-value.typeorm.entity");
/**
 * Application Module
 * Configures application layer dependencies
 * Follows Clean Architecture principles
 */
var ApplicationModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                // Register TypeORM entities for dependency injection
                typeorm_1.TypeOrmModule.forFeature([language_typeorm_entity_1.LanguageTypeOrmEntity, language_value_typeorm_entity_1.LanguageValueTypeOrmEntity]),
            ],
            providers: [
                // Domain Services
                translation_domain_service_1.TranslationDomainService,
                // Use Cases
                manage_language_use_case_1.ManageLanguageUseCase,
                manage_translation_use_case_1.ManageTranslationUseCase,
                translate_text_use_case_1.TranslateTextUseCase,
                // Repository Implementations
                {
                    provide: "LanguageRepositoryInterface",
                    useClass: language_repository_1.LanguageRepository,
                },
                {
                    provide: "LanguageValueRepositoryInterface",
                    useClass: language_value_repository_1.LanguageValueRepository,
                },
            ],
            exports: [
                // Export use cases and domain services for use by the interfaces layer
                manage_language_use_case_1.ManageLanguageUseCase,
                manage_translation_use_case_1.ManageTranslationUseCase,
                translate_text_use_case_1.TranslateTextUseCase,
                // Export domain services
                translation_domain_service_1.TranslationDomainService,
                // Export repository interfaces for controllers if needed
                "LanguageRepositoryInterface",
                "LanguageValueRepositoryInterface",
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ApplicationModule = _classThis = /** @class */ (function () {
        function ApplicationModule_1() {
        }
        return ApplicationModule_1;
    }());
    __setFunctionName(_classThis, "ApplicationModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApplicationModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApplicationModule = _classThis;
}();
exports.ApplicationModule = ApplicationModule;
