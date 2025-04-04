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
    category: { type: mongoose_1.default.Types.ObjectId, ref: 'Category', required: true },
    short_description: { type: String, required: true },
    description: { type: String, required: true },
    characteristics: {
        scientific_name: { type: String, required: true },
        family: { type: String, required: true },
        origin: { type: String, required: true },
        growth_habit: { type: String, required: true },
        leaves: { type: String, required: true },
        flowers: { type: String, required: true },
        roots: { type: String, required: true },
    },
    meaning: {
        feng_shui: { type: String, required: true },
        placement: { type: String, required: true },
    },
    care_instructions: {
        watering: { type: String, required: true },
        lighting: { type: String, required: true },
        temperature: { type: String, required: true },
        fertilizing: { type: String, required: true },
        cleaning: { type: String, required: true },
    },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    discount: { type: String, required: true },
    specifications: {
        height: { type: String, required: true },
        pot_size: { type: String, required: true },
        difficulty: { type: String, required: true },
        lighting_requirements: { type: String, required: true },
        water_needs: { type: String, required: true },
    },
}, { timestamps: true });
const Plant = mongoose_1.default.model("Plant", PlantSchema, "plants");
exports.default = Plant;
