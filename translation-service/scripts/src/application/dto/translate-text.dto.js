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
exports.TranslateTextDto = void 0;
var class_validator_1 = require("class-validator");
var TranslateTextDto = function () {
    var _a;
    var _text_decorators;
    var _text_initializers = [];
    var _text_extraInitializers = [];
    var _targetLanguage_decorators;
    var _targetLanguage_initializers = [];
    var _targetLanguage_extraInitializers = [];
    var _sourceLanguage_decorators;
    var _sourceLanguage_initializers = [];
    var _sourceLanguage_extraInitializers = [];
    var _context_decorators;
    var _context_initializers = [];
    var _context_extraInitializers = [];
    return _a = /** @class */ (function () {
            function TranslateTextDto() {
                this.text = __runInitializers(this, _text_initializers, void 0);
                this.targetLanguage = (__runInitializers(this, _text_extraInitializers), __runInitializers(this, _targetLanguage_initializers, void 0));
                this.sourceLanguage = (__runInitializers(this, _targetLanguage_extraInitializers), __runInitializers(this, _sourceLanguage_initializers, void 0));
                this.context = (__runInitializers(this, _sourceLanguage_extraInitializers), __runInitializers(this, _context_initializers, void 0));
                __runInitializers(this, _context_extraInitializers);
            }
            return TranslateTextDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _text_decorators = [(0, class_validator_1.IsString)()];
            _targetLanguage_decorators = [(0, class_validator_1.IsString)()];
            _sourceLanguage_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _context_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: function (obj) { return "text" in obj; }, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            __esDecorate(null, null, _targetLanguage_decorators, { kind: "field", name: "targetLanguage", static: false, private: false, access: { has: function (obj) { return "targetLanguage" in obj; }, get: function (obj) { return obj.targetLanguage; }, set: function (obj, value) { obj.targetLanguage = value; } }, metadata: _metadata }, _targetLanguage_initializers, _targetLanguage_extraInitializers);
            __esDecorate(null, null, _sourceLanguage_decorators, { kind: "field", name: "sourceLanguage", static: false, private: false, access: { has: function (obj) { return "sourceLanguage" in obj; }, get: function (obj) { return obj.sourceLanguage; }, set: function (obj, value) { obj.sourceLanguage = value; } }, metadata: _metadata }, _sourceLanguage_initializers, _sourceLanguage_extraInitializers);
            __esDecorate(null, null, _context_decorators, { kind: "field", name: "context", static: false, private: false, access: { has: function (obj) { return "context" in obj; }, get: function (obj) { return obj.context; }, set: function (obj, value) { obj.context = value; } }, metadata: _metadata }, _context_initializers, _context_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.TranslateTextDto = TranslateTextDto;
