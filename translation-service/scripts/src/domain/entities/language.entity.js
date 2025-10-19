"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
var Language = /** @class */ (function () {
    function Language(data) {
        if (data === void 0) { data = {}; }
        var _a;
        this.code = data.code || "";
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.name = data.name || "";
        this.localName = data.localName;
        this.flag = data.flag;
        this.status = data.status || "active";
        this.isDefault = (_a = data.isDefault) !== null && _a !== void 0 ? _a : false;
        this.metadata = data.metadata;
    }
    Object.defineProperty(Language.prototype, "displayName", {
        get: function () {
            return this.localName || this.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Language.prototype, "isRTL", {
        get: function () {
            var _a;
            return ((_a = this.metadata) === null || _a === void 0 ? void 0 : _a.direction) === "rtl";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Language.prototype, "isActive", {
        get: function () {
            return this.status === "active";
        },
        enumerable: false,
        configurable: true
    });
    return Language;
}());
exports.Language = Language;
