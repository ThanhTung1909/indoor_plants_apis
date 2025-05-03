"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const PlantSchema = new mongoose_1.Schema({
    sku: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    short_description: { type: String },
    description: { type: String },
    characteristics: {
        scientific_name: { type: String },
        family: { type: String },
        origin: { type: String },
        growth_habit: { type: String },
        leaves: { type: String },
        flowers: { type: String },
        roots: { type: String },
    },
    meaning: {
        feng_shui: { type: String },
        placement: { type: String },
    },
    care_instructions: {
        watering: { type: String },
        lighting: { type: String },
        temperature: { type: String },
        fertilizing: { type: String },
        cleaning: { type: String },
    },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    discount: { type: String },
    specifications: {
        height: { type: String },
        pot_size: { type: String },
        difficulty: { type: String },
        lighting_requirements: { type: String },
        water_needs: { type: String },
    },
    stock: { type: Number, required: true },
    import_date: { type: Date, default: Date.now },
    origin_country: { type: String },
    deleted: { type: Boolean, default: false },
}, { timestamps: true });
const Plant = mongoose_1.default.model("Plant", PlantSchema, "plants");
exports.default = Plant;
