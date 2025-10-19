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
exports.CreateTranslationDto = void 0;
var class_validator_1 = require("class-validator");
var CreateTranslationDto = function () {
    var _a;
    var _original_decorators;
    var _original_initializers = [];
    var _original_extraInitializers = [];
    var _destination_decorators;
    var _destination_initializers = [];
    var _destination_extraInitializers = [];
    var _languageCode_decorators;
    var _languageCode_initializers = [];
    var _languageCode_extraInitializers = [];
    var _context_decorators;
    var _context_initializers = [];
    var _context_extraInitializers = [];
    var _isApproved_decorators;
    var _isApproved_initializers = [];
    var _isApproved_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateTranslationDto() {
                this.original = __runInitializers(this, _original_initializers, void 0); // Changed from originalText
                this.destination = (__runInitializers(this, _original_extraInitializers), __runInitializers(this, _destination_initializers, void 0)); // Changed from translatedText
                this.languageCode = (__runInitializers(this, _destination_extraInitializers), __runInitializers(this, _languageCode_initializers, void 0)); // Changed from languageId (number)
                this.context = (__runInitializers(this, _languageCode_extraInitializers), __runInitializers(this, _context_initializers, void 0));
                this.isApproved = (__runInitializers(this, _context_extraInitializers), __runInitializers(this, _isApproved_initializers, void 0));
                __runInitializers(this, _isApproved_extraInitializers);
            }
            return CreateTranslationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _original_decorators = [(0, class_validator_1.IsString)()];
            _destination_decorators = [(0, class_validator_1.IsString)()];
            _languageCode_decorators = [(0, class_validator_1.IsString)()];
            _context_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _isApproved_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _original_decorators, { kind: "field", name: "original", static: false, private: false, access: { has: function (obj) { return "original" in obj; }, get: function (obj) { return obj.original; }, set: function (obj, value) { obj.original = value; } }, metadata: _metadata }, _original_initializers, _original_extraInitializers);
            __esDecorate(null, null, _destination_decorators, { kind: "field", name: "destination", static: false, private: false, access: { has: function (obj) { return "destination" in obj; }, get: function (obj) { return obj.destination; }, set: function (obj, value) { obj.destination = value; } }, metadata: _metadata }, _destination_initializers, _destination_extraInitializers);
            __esDecorate(null, null, _languageCode_decorators, { kind: "field", name: "languageCode", static: false, private: false, access: { has: function (obj) { return "languageCode" in obj; }, get: function (obj) { return obj.languageCode; }, set: function (obj, value) { obj.languageCode = value; } }, metadata: _metadata }, _languageCode_initializers, _languageCode_extraInitializers);
            __esDecorate(null, null, _context_decorators, { kind: "field", name: "context", static: false, private: false, access: { has: function (obj) { return "context" in obj; }, get: function (obj) { return obj.context; }, set: function (obj, value) { obj.context = value; } }, metadata: _metadata }, _context_initializers, _context_extraInitializers);
            __esDecorate(null, null, _isApproved_decorators, { kind: "field", name: "isApproved", static: false, private: false, access: { has: function (obj) { return "isApproved" in obj; }, get: function (obj) { return obj.isApproved; }, set: function (obj, value) { obj.isApproved = value; } }, metadata: _metadata }, _isApproved_initializers, _isApproved_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateTranslationDto = CreateTranslationDto;
