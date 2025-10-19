"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var app_module_1 = require("../src/app.module");
var manage_language_use_case_1 = require("../src/application/use-cases/manage-language.use-case");
var manage_translation_use_case_1 = require("../src/application/use-cases/manage-translation.use-case");
var translate_text_use_case_1 = require("../src/application/use-cases/translate-text.use-case");
function seedData() {
    return __awaiter(this, void 0, void 0, function () {
        var app, manageLanguageUseCase, manageTranslationUseCase, translateTextUseCase, sampleLanguages, createdLanguages, _i, sampleLanguages_1, languageData, language, error_1, sampleTranslations, _a, sampleTranslations_1, translationData, translation, error_2, languageCount, translationCount, testTranslation, error_3, error_4;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0:
                    console.log("🌱 Starting Translation Service data seeding...");
                    return [4 /*yield*/, core_1.NestFactory.createApplicationContext(app_module_1.AppModule)];
                case 1:
                    app = _x.sent();
                    manageLanguageUseCase = app.get(manage_language_use_case_1.ManageLanguageUseCase);
                    manageTranslationUseCase = app.get(manage_translation_use_case_1.ManageTranslationUseCase);
                    translateTextUseCase = app.get(translate_text_use_case_1.TranslateTextUseCase);
                    _x.label = 2;
                case 2:
                    _x.trys.push([2, 21, 22, 24]);
                    // Clear existing data
                    console.log("🧹 Clearing existing data...");
                    sampleLanguages = [
                        {
                            code: "en",
                            name: "English",
                            localName: "English",
                            flag: "🇺🇸",
                            status: "active",
                            isDefault: true,
                            metadata: {
                                direction: "ltr",
                                region: "US",
                                currency: "USD",
                                dateFormat: "MM/DD/YYYY",
                            },
                        },
                        {
                            code: "es",
                            name: "Spanish",
                            localName: "Español",
                            flag: "🇪🇸",
                            status: "active",
                            isDefault: false,
                            metadata: {
                                direction: "ltr",
                                region: "ES",
                                currency: "EUR",
                                dateFormat: "DD/MM/YYYY",
                            },
                        },
                        {
                            code: "fr",
                            name: "French",
                            localName: "Français",
                            flag: "🇫🇷",
                            status: "active",
                            isDefault: false,
                            metadata: {
                                direction: "ltr",
                                region: "FR",
                                currency: "EUR",
                                dateFormat: "DD/MM/YYYY",
                            },
                        },
                        {
                            code: "de",
                            name: "German",
                            localName: "Deutsch",
                            flag: "🇩🇪",
                            status: "active",
                            isDefault: false,
                            metadata: {
                                direction: "ltr",
                                region: "DE",
                                currency: "EUR",
                                dateFormat: "DD.MM.YYYY",
                            },
                        },
                        {
                            code: "ar",
                            name: "Arabic",
                            localName: "العربية",
                            flag: "🇸🇦",
                            status: "active",
                            isDefault: false,
                            metadata: {
                                direction: "rtl",
                                region: "SA",
                                currency: "SAR",
                                dateFormat: "DD/MM/YYYY",
                            },
                        },
                    ];
                    console.log("🌍 Creating sample languages...");
                    createdLanguages = [];
                    _i = 0, sampleLanguages_1 = sampleLanguages;
                    _x.label = 3;
                case 3:
                    if (!(_i < sampleLanguages_1.length)) return [3 /*break*/, 8];
                    languageData = sampleLanguages_1[_i];
                    _x.label = 4;
                case 4:
                    _x.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, manageLanguageUseCase.create(languageData)];
                case 5:
                    language = _x.sent();
                    createdLanguages.push(language);
                    console.log("\u2705 Created language: ".concat(language.name, " (").concat(language.code, ")"));
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _x.sent();
                    if (error_1.status === 409) {
                        // ConflictException
                        console.warn("\u26A0\uFE0F Language with code ".concat(languageData.code, " already exists. Skipping."));
                    }
                    else {
                        console.error("\u274C Failed to create language ".concat(languageData.code, ": ").concat(error_1.message));
                    }
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8:
                    // Create sample translations
                    console.log("📝 Creating sample translations...");
                    sampleTranslations = [
                        // English (default language)
                        {
                            original: "Welcome",
                            destination: "Welcome",
                            languageCode: ((_b = createdLanguages.find(function (l) { return l.code === "en"; })) === null || _b === void 0 ? void 0 : _b.id) || 1,
                            context: { category: "ui", module: "auth", component: "message" },
                            isApproved: true,
                        },
                        {
                            original: "Login",
                            destination: "Login",
                            languageCode: ((_c = createdLanguages.find(function (l) { return l.code === "en"; })) === null || _c === void 0 ? void 0 : _c.id) || 1,
                            context: { category: "ui", module: "auth", component: "button" },
                            isApproved: true,
                        },
                        {
                            original: "Email",
                            destination: "Email",
                            languageCode: ((_d = createdLanguages.find(function (l) { return l.code === "en"; })) === null || _d === void 0 ? void 0 : _d.id) || 1,
                            context: {
                                category: "ui",
                                module: "auth",
                                component: "form",
                                field: "email",
                            },
                            isApproved: true,
                        },
                        {
                            original: "Password",
                            destination: "Password",
                            languageCode: ((_e = createdLanguages.find(function (l) { return l.code === "en"; })) === null || _e === void 0 ? void 0 : _e.id) || 1,
                            context: {
                                category: "ui",
                                module: "auth",
                                component: "form",
                                field: "password",
                            },
                            isApproved: true,
                        },
                        // Spanish translations
                        {
                            original: "Welcome",
                            destination: "Bienvenido",
                            languageCode: ((_f = createdLanguages.find(function (l) { return l.code === "es"; })) === null || _f === void 0 ? void 0 : _f.id) || 2,
                            context: { category: "ui", module: "auth", component: "message" },
                            isApproved: true,
                        },
                        {
                            original: "Login",
                            destination: "Iniciar sesión",
                            languageCode: ((_g = createdLanguages.find(function (l) { return l.code === "es"; })) === null || _g === void 0 ? void 0 : _g.id) || 2,
                            context: { category: "ui", module: "auth", component: "button" },
                            isApproved: true,
                        },
                        {
                            original: "Email",
                            destination: "Correo electrónico",
                            languageCode: ((_h = createdLanguages.find(function (l) { return l.code === "es"; })) === null || _h === void 0 ? void 0 : _h.id) || 2,
                            context: {
                                category: "ui",
                                module: "auth",
                                component: "form",
                                field: "email",
                            },
                            isApproved: true,
                        },
                        {
                            original: "Password",
                            destination: "Contraseña",
                            languageCode: ((_j = createdLanguages.find(function (l) { return l.code === "es"; })) === null || _j === void 0 ? void 0 : _j.id) || 2,
                            context: {
                                category: "ui",
                                module: "auth",
                                component: "form",
                                field: "password",
                            },
                            isApproved: true,
                        },
                        // French translations
                        {
                            original: "Welcome",
                            destination: "Bienvenue",
                            languageCode: ((_k = createdLanguages.find(function (l) { return l.code === "fr"; })) === null || _k === void 0 ? void 0 : _k.id) || 3,
                            context: { category: "ui", module: "auth", component: "message" },
                            isApproved: true,
                        },
                        {
                            original: "Login",
                            destination: "Se connecter",
                            languageCode: ((_l = createdLanguages.find(function (l) { return l.code === "fr"; })) === null || _l === void 0 ? void 0 : _l.id) || 3,
                            context: { category: "ui", module: "auth", component: "button" },
                            isApproved: true,
                        },
                        {
                            original: "Email",
                            destination: "E-mail",
                            languageCode: ((_m = createdLanguages.find(function (l) { return l.code === "fr"; })) === null || _m === void 0 ? void 0 : _m.id) || 3,
                            context: {
                                category: "ui",
                                module: "auth",
                                component: "form",
                                field: "email",
                            },
                            isApproved: true,
                        },
                        {
                            original: "Password",
                            destination: "Mot de passe",
                            languageCode: ((_o = createdLanguages.find(function (l) { return l.code === "fr"; })) === null || _o === void 0 ? void 0 : _o.id) || 3,
                            context: {
                                category: "ui",
                                module: "auth",
                                component: "form",
                                field: "password",
                            },
                            isApproved: true,
                        },
                        // German translations
                        {
                            original: "Welcome",
                            destination: "Willkommen",
                            languageCode: ((_p = createdLanguages.find(function (l) { return l.code === "de"; })) === null || _p === void 0 ? void 0 : _p.id) || 4,
                            context: { category: "ui", module: "auth", component: "message" },
                            isApproved: true,
                        },
                        {
                            original: "Login",
                            destination: "Anmelden",
                            languageCode: ((_q = createdLanguages.find(function (l) { return l.code === "de"; })) === null || _q === void 0 ? void 0 : _q.id) || 4,
                            context: { category: "ui", module: "auth", component: "button" },
                            isApproved: true,
                        },
                        {
                            original: "Email",
                            destination: "E-Mail",
                            languageCode: ((_r = createdLanguages.find(function (l) { return l.code === "de"; })) === null || _r === void 0 ? void 0 : _r.id) || 4,
                            context: {
                                category: "ui",
                                module: "auth",
                                component: "form",
                                field: "email",
                            },
                            isApproved: true,
                        },
                        {
                            original: "Password",
                            destination: "Passwort",
                            languageCode: ((_s = createdLanguages.find(function (l) { return l.code === "de"; })) === null || _s === void 0 ? void 0 : _s.id) || 4,
                            context: {
                                category: "ui",
                                module: "auth",
                                component: "form",
                                field: "password",
                            },
                            isApproved: true,
                        },
                        // Arabic translations
                        {
                            original: "Welcome",
                            destination: "أهلاً وسهلاً",
                            languageCode: ((_t = createdLanguages.find(function (l) { return l.code === "ar"; })) === null || _t === void 0 ? void 0 : _t.id) || 5,
                            context: { category: "ui", module: "auth", component: "message" },
                            isApproved: true,
                        },
                        {
                            original: "Login",
                            destination: "تسجيل الدخول",
                            languageCode: ((_u = createdLanguages.find(function (l) { return l.code === "ar"; })) === null || _u === void 0 ? void 0 : _u.id) || 5,
                            context: { category: "ui", module: "auth", component: "button" },
                            isApproved: true,
                        },
                        {
                            original: "Email",
                            destination: "البريد الإلكتروني",
                            languageCode: ((_v = createdLanguages.find(function (l) { return l.code === "ar"; })) === null || _v === void 0 ? void 0 : _v.id) || 5,
                            context: {
                                category: "ui",
                                module: "auth",
                                component: "form",
                                field: "email",
                            },
                            isApproved: true,
                        },
                        {
                            original: "Password",
                            destination: "كلمة المرور",
                            languageCode: ((_w = createdLanguages.find(function (l) { return l.code === "ar"; })) === null || _w === void 0 ? void 0 : _w.id) || 5,
                            context: {
                                category: "ui",
                                module: "auth",
                                component: "form",
                                field: "password",
                            },
                            isApproved: true,
                        },
                    ];
                    _a = 0, sampleTranslations_1 = sampleTranslations;
                    _x.label = 9;
                case 9:
                    if (!(_a < sampleTranslations_1.length)) return [3 /*break*/, 14];
                    translationData = sampleTranslations_1[_a];
                    _x.label = 10;
                case 10:
                    _x.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, manageTranslationUseCase.create(translationData)];
                case 11:
                    translation = _x.sent();
                    console.log("\u2705 Created translation: \"".concat(translation.original, "\" \u2192 \"").concat(translation.destination, "\""));
                    return [3 /*break*/, 13];
                case 12:
                    error_2 = _x.sent();
                    if (error_2.status === 409) {
                        // ConflictException
                        console.warn("\u26A0\uFE0F Translation already exists. Skipping.");
                    }
                    else {
                        console.error("\u274C Failed to create translation: ".concat(error_2.message));
                    }
                    return [3 /*break*/, 13];
                case 13:
                    _a++;
                    return [3 /*break*/, 9];
                case 14: return [4 /*yield*/, manageLanguageUseCase.getCount()];
                case 15:
                    languageCount = _x.sent();
                    return [4 /*yield*/, manageTranslationUseCase.getCount()];
                case 16:
                    translationCount = _x.sent();
                    console.log("\uD83D\uDCCA Total languages in database: ".concat(languageCount.count));
                    console.log("\uD83D\uDCCA Total translations in database: ".concat(translationCount.count));
                    // Test translation
                    console.log("🧮 Testing translation...");
                    _x.label = 17;
                case 17:
                    _x.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, translateTextUseCase.execute({
                            text: "Welcome",
                            targetLanguage: "es",
                            context: { category: "ui", module: "auth", component: "message" },
                        })];
                case 18:
                    testTranslation = _x.sent();
                    console.log("\u2705 Test translation successful: \"Welcome\" \u2192 \"".concat(testTranslation.translatedText, "\" (fromCache: ").concat(testTranslation.fromCache, ")"));
                    return [3 /*break*/, 20];
                case 19:
                    error_3 = _x.sent();
                    console.error("❌ Error in test translation:", error_3.message);
                    return [3 /*break*/, 20];
                case 20:
                    console.log("🎉 Translation Service seeding completed successfully!");
                    return [3 /*break*/, 24];
                case 21:
                    error_4 = _x.sent();
                    console.error("❌ Error during seeding:", error_4);
                    return [3 /*break*/, 24];
                case 22: return [4 /*yield*/, app.close()];
                case 23:
                    _x.sent();
                    return [7 /*endfinally*/];
                case 24: return [2 /*return*/];
            }
        });
    });
}
// Run seeding
seedData().catch(console.error);
