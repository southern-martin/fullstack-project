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
exports.LanguageResponseDto = void 0;
var class_transformer_1 = require("class-transformer");
var LanguageResponseDto = function () {
    var _a;
    var _code_decorators;
    var _code_initializers = [];
    var _code_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _localName_decorators;
    var _localName_initializers = [];
    var _localName_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _flag_decorators;
    var _flag_initializers = [];
    var _flag_extraInitializers = [];
    var _isDefault_decorators;
    var _isDefault_initializers = [];
    var _isDefault_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LanguageResponseDto() {
                this.code = __runInitializers(this, _code_initializers, void 0); // Primary key in old system (no separate id)
                this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.localName = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _localName_initializers, void 0));
                this.status = (__runInitializers(this, _localName_extraInitializers), __runInitializers(this, _status_initializers, void 0)); // 'active' or 'inactive'
                this.flag = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _flag_initializers, void 0)); // Extracted from metadata
                this.isDefault = (__runInitializers(this, _flag_extraInitializers), __runInitializers(this, _isDefault_initializers, void 0));
                this.metadata = (__runInitializers(this, _isDefault_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
            Object.defineProperty(LanguageResponseDto.prototype, "isActive", {
                // Convenience getter for backward compatibility
                get: function () {
                    return this.status === 'active';
                },
                enumerable: false,
                configurable: true
            });
            LanguageResponseDto.fromDomain = function (language) {
                var dto = new _a();
                dto.code = language.code;
                dto.name = language.name;
                dto.localName = language.localName;
                dto.status = language.status;
                dto.flag = language.flag;
                dto.isDefault = language.isDefault;
                dto.metadata = language.metadata;
                dto.createdAt = language.createdAt;
                dto.updatedAt = language.updatedAt;
                return dto;
            };
            return LanguageResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _code_decorators = [(0, class_transformer_1.Expose)()];
            _name_decorators = [(0, class_transformer_1.Expose)()];
            _localName_decorators = [(0, class_transformer_1.Expose)()];
            _status_decorators = [(0, class_transformer_1.Expose)()];
            _flag_decorators = [(0, class_transformer_1.Expose)()];
            _isDefault_decorators = [(0, class_transformer_1.Expose)()];
            _metadata_decorators = [(0, class_transformer_1.Expose)()];
            _createdAt_decorators = [(0, class_transformer_1.Expose)()];
            _updatedAt_decorators = [(0, class_transformer_1.Expose)()];
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: function (obj) { return "code" in obj; }, get: function (obj) { return obj.code; }, set: function (obj, value) { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _localName_decorators, { kind: "field", name: "localName", static: false, private: false, access: { has: function (obj) { return "localName" in obj; }, get: function (obj) { return obj.localName; }, set: function (obj, value) { obj.localName = value; } }, metadata: _metadata }, _localName_initializers, _localName_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _flag_decorators, { kind: "field", name: "flag", static: false, private: false, access: { has: function (obj) { return "flag" in obj; }, get: function (obj) { return obj.flag; }, set: function (obj, value) { obj.flag = value; } }, metadata: _metadata }, _flag_initializers, _flag_extraInitializers);
            __esDecorate(null, null, _isDefault_decorators, { kind: "field", name: "isDefault", static: false, private: false, access: { has: function (obj) { return "isDefault" in obj; }, get: function (obj) { return obj.isDefault; }, set: function (obj, value) { obj.isDefault = value; } }, metadata: _metadata }, _isDefault_initializers, _isDefault_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LanguageResponseDto = LanguageResponseDto;
