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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationResponseDto = void 0;
var class_transformer_1 = require("class-transformer");
var TranslationResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _key_decorators;
    var _key_initializers = [];
    var _key_extraInitializers = [];
    var _original_decorators;
    var _original_initializers = [];
    var _original_extraInitializers = [];
    var _destination_decorators;
    var _destination_initializers = [];
    var _destination_extraInitializers = [];
    var _languageCode_decorators;
    var _languageCode_initializers = [];
    var _languageCode_extraInitializers = [];
    var _language_decorators;
    var _language_initializers = [];
    var _language_extraInitializers = [];
    var _context_decorators;
    var _context_initializers = [];
    var _context_extraInitializers = [];
    var _isApproved_decorators;
    var _isApproved_initializers = [];
    var _isApproved_extraInitializers = [];
    var _approvedBy_decorators;
    var _approvedBy_initializers = [];
    var _approvedBy_extraInitializers = [];
    var _approvedAt_decorators;
    var _approvedAt_initializers = [];
    var _approvedAt_extraInitializers = [];
    var _usageCount_decorators;
    var _usageCount_initializers = [];
    var _usageCount_extraInitializers = [];
    var _lastUsedAt_decorators;
    var _lastUsedAt_initializers = [];
    var _lastUsedAt_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function TranslationResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.key = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _key_initializers, void 0));
                this.original = (__runInitializers(this, _key_extraInitializers), __runInitializers(this, _original_initializers, void 0)); // Changed from originalText
                this.destination = (__runInitializers(this, _original_extraInitializers), __runInitializers(this, _destination_initializers, void 0)); // Changed from translatedText
                this.languageCode = (__runInitializers(this, _destination_extraInitializers), __runInitializers(this, _languageCode_initializers, void 0)); // Changed from languageId (number)
                this.language = (__runInitializers(this, _languageCode_extraInitializers), __runInitializers(this, _language_initializers, void 0));
                this.context = (__runInitializers(this, _language_extraInitializers), __runInitializers(this, _context_initializers, void 0));
                this.isApproved = (__runInitializers(this, _context_extraInitializers), __runInitializers(this, _isApproved_initializers, void 0));
                this.approvedBy = (__runInitializers(this, _isApproved_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
                this.approvedAt = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedAt_initializers, void 0));
                this.usageCount = (__runInitializers(this, _approvedAt_extraInitializers), __runInitializers(this, _usageCount_initializers, void 0));
                this.lastUsedAt = (__runInitializers(this, _usageCount_extraInitializers), __runInitializers(this, _lastUsedAt_initializers, void 0));
                this.createdAt = (__runInitializers(this, _lastUsedAt_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
            TranslationResponseDto.fromDomain = function (languageValue) {
                var dto = new _a();
                dto.id = languageValue.id;
                dto.key = languageValue.key;
                dto.original = languageValue.original;
                dto.destination = languageValue.destination;
                dto.languageCode = languageValue.languageCode;
                dto.language = languageValue.language
                    ? {
                        code: languageValue.language.code,
                        name: languageValue.language.name,
                    }
                    : null;
                dto.context = languageValue.context;
                dto.isApproved = languageValue.isApproved;
                dto.approvedBy = languageValue.approvedBy;
                dto.approvedAt = languageValue.approvedAt;
                dto.usageCount = languageValue.usageCount;
                dto.lastUsedAt = languageValue.lastUsedAt;
                dto.createdAt = languageValue.createdAt;
                dto.updatedAt = languageValue.updatedAt;
                return dto;
            };
            return TranslationResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_transformer_1.Expose)()];
            _key_decorators = [(0, class_transformer_1.Expose)()];
            _original_decorators = [(0, class_transformer_1.Expose)()];
            _destination_decorators = [(0, class_transformer_1.Expose)()];
            _languageCode_decorators = [(0, class_transformer_1.Expose)()];
            _language_decorators = [(0, class_transformer_1.Expose)()];
            _context_decorators = [(0, class_transformer_1.Expose)()];
            _isApproved_decorators = [(0, class_transformer_1.Expose)()];
            _approvedBy_decorators = [(0, class_transformer_1.Expose)()];
            _approvedAt_decorators = [(0, class_transformer_1.Expose)()];
            _usageCount_decorators = [(0, class_transformer_1.Expose)()];
            _lastUsedAt_decorators = [(0, class_transformer_1.Expose)()];
            _createdAt_decorators = [(0, class_transformer_1.Expose)()];
            _updatedAt_decorators = [(0, class_transformer_1.Expose)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: function (obj) { return "key" in obj; }, get: function (obj) { return obj.key; }, set: function (obj, value) { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
            __esDecorate(null, null, _original_decorators, { kind: "field", name: "original", static: false, private: false, access: { has: function (obj) { return "original" in obj; }, get: function (obj) { return obj.original; }, set: function (obj, value) { obj.original = value; } }, metadata: _metadata }, _original_initializers, _original_extraInitializers);
            __esDecorate(null, null, _destination_decorators, { kind: "field", name: "destination", static: false, private: false, access: { has: function (obj) { return "destination" in obj; }, get: function (obj) { return obj.destination; }, set: function (obj, value) { obj.destination = value; } }, metadata: _metadata }, _destination_initializers, _destination_extraInitializers);
            __esDecorate(null, null, _languageCode_decorators, { kind: "field", name: "languageCode", static: false, private: false, access: { has: function (obj) { return "languageCode" in obj; }, get: function (obj) { return obj.languageCode; }, set: function (obj, value) { obj.languageCode = value; } }, metadata: _metadata }, _languageCode_initializers, _languageCode_extraInitializers);
            __esDecorate(null, null, _language_decorators, { kind: "field", name: "language", static: false, private: false, access: { has: function (obj) { return "language" in obj; }, get: function (obj) { return obj.language; }, set: function (obj, value) { obj.language = value; } }, metadata: _metadata }, _language_initializers, _language_extraInitializers);
            __esDecorate(null, null, _context_decorators, { kind: "field", name: "context", static: false, private: false, access: { has: function (obj) { return "context" in obj; }, get: function (obj) { return obj.context; }, set: function (obj, value) { obj.context = value; } }, metadata: _metadata }, _context_initializers, _context_extraInitializers);
            __esDecorate(null, null, _isApproved_decorators, { kind: "field", name: "isApproved", static: false, private: false, access: { has: function (obj) { return "isApproved" in obj; }, get: function (obj) { return obj.isApproved; }, set: function (obj, value) { obj.isApproved = value; } }, metadata: _metadata }, _isApproved_initializers, _isApproved_extraInitializers);
            __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: function (obj) { return "approvedBy" in obj; }, get: function (obj) { return obj.approvedBy; }, set: function (obj, value) { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
            __esDecorate(null, null, _approvedAt_decorators, { kind: "field", name: "approvedAt", static: false, private: false, access: { has: function (obj) { return "approvedAt" in obj; }, get: function (obj) { return obj.approvedAt; }, set: function (obj, value) { obj.approvedAt = value; } }, metadata: _metadata }, _approvedAt_initializers, _approvedAt_extraInitializers);
            __esDecorate(null, null, _usageCount_decorators, { kind: "field", name: "usageCount", static: false, private: false, access: { has: function (obj) { return "usageCount" in obj; }, get: function (obj) { return obj.usageCount; }, set: function (obj, value) { obj.usageCount = value; } }, metadata: _metadata }, _usageCount_initializers, _usageCount_extraInitializers);
            __esDecorate(null, null, _lastUsedAt_decorators, { kind: "field", name: "lastUsedAt", static: false, private: false, access: { has: function (obj) { return "lastUsedAt" in obj; }, get: function (obj) { return obj.lastUsedAt; }, set: function (obj, value) { obj.lastUsedAt = value; } }, metadata: _metadata }, _lastUsedAt_initializers, _lastUsedAt_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.TranslationResponseDto = TranslationResponseDto;
