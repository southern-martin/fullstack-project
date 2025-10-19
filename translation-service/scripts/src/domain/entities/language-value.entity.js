"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageValue = void 0;
var LanguageValue = /** @class */ (function () {
    function LanguageValue(data) {
        if (data === void 0) { data = {}; }
        var _a, _b;
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.key = data.key || "";
        this.languageCode = data.languageCode || "";
        this.original = data.original || "";
        this.destination = data.destination || "";
        this.language = data.language;
        this.context = data.context;
        this.isApproved = (_a = data.isApproved) !== null && _a !== void 0 ? _a : false;
        this.approvedBy = data.approvedBy;
        this.approvedAt = data.approvedAt;
        this.usageCount = (_b = data.usageCount) !== null && _b !== void 0 ? _b : 0;
        this.lastUsedAt = data.lastUsedAt;
    }
    Object.defineProperty(LanguageValue.prototype, "isPendingApproval", {
        get: function () {
            return !this.isApproved;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LanguageValue.prototype, "hasBeenUsed", {
        get: function () {
            return this.usageCount > 0;
        },
        enumerable: false,
        configurable: true
    });
    return LanguageValue;
}());
exports.LanguageValue = LanguageValue;
