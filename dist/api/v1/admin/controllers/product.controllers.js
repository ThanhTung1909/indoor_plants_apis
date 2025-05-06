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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetailBySku = exports.getAllProduct = exports.deleteProductBySku = exports.editProductBySku = exports.create = void 0;
const plant_model_1 = __importDefault(require("../../../../models/plant.model"));
const validatePlant_1 = require("../../../../helper/validatePlant");
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plantData = Object.assign(Object.assign({}, req.body), { characteristics: {
                scientific_name: req.body.characteristics.scientific_name,
                family: req.body.characteristics.family,
                origin: req.body.characteristics.origin,
                growth_habit: req.body.characteristics.growth_habit,
                leaves: req.body.characteristics.leaves,
                flowers: req.body.characteristics.flowers,
                roots: req.body.characteristics.roots,
            }, meaning: {
                feng_shui: req.body.meaning.feng_shui,
                placement: req.body.meaning.placement,
            }, care_instructions: {
                watering: req.body.care_instructions.watering,
                lighting: req.body.care_instructions.lighting,
                temperature: req.body.care_instructions.temperature,
                fertilizing: req.body.care_instructions.fertilizing,
                cleaning: req.body.care_instructions.cleaning,
            }, specifications: {
                height: req.body.specifications.height,
                pot_size: req.body.specifications.pot_size,
                difficulty: req.body.specifications.difficulty,
                lighting_requirements: req.body.specifications.lighting_requirements,
                water_needs: req.body.specifications.water_needs,
            }, images: req.body.images, import_date: req.body.import_date, origin_country: req.body.origin_country });
        const errors = (0, validatePlant_1.validatePlant)(plantData);
        console.log(errors);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            });
        }
        console.log("plant data", plantData);
        const newPlant = new plant_model_1.default(plantData);
        yield newPlant.save();
        res.status(201).json({
            success: true,
            message: "Add Plant SuccessFully",
            data: newPlant,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi thêm cây mới",
            error: error.message,
        });
        console.log(error);
    }
});
exports.create = create;
const editProductBySku = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sku } = req.params;
        console.log("body", req.body);
        const updateData = {
            sku: req.body.sku,
            title: req.body.title,
            category: req.body.category,
            short_description: req.body.short_description,
            description: req.body.description,
            price: req.body.price,
            discount: req.body.discount,
            stock: req.body.stock,
            characteristics: {
                scientific_name: req.body.characteristics.scientific_name,
                family: req.body.characteristics.family,
                origin: req.body.characteristics.origin,
                growth_habit: req.body.characteristics.growth_habit,
                leaves: req.body.characteristics.leaves,
                flowers: req.body.characteristics.flowers,
                roots: req.body.characteristics.roots,
            },
            meaning: {
                feng_shui: req.body.meaning.feng_shui,
                placement: req.body.meaning.placement,
            },
            care_instructions: {
                watering: req.body.care_instructions.watering,
                lighting: req.body.care_instructions.lighting,
                temperature: req.body.care_instructions.temperature,
                fertilizing: req.body.care_instructions.fertilizing,
                cleaning: req.body.care_instructions.cleaning,
            },
            specifications: {
                height: req.body.specifications.height,
                pot_size: req.body.specifications.pot_size,
                difficulty: req.body.specifications.difficulty,
                lighting_requirements: req.body.specifications.lighting_requirements,
                water_needs: req.body.specifications.water_needs,
            },
            images: req.body.images,
            import_date: req.body.import_date,
            origin_country: req.body.origin_country,
        };
        const updatedPlant = yield plant_model_1.default.findOneAndUpdate({ sku }, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedPlant) {
            return res
                .status(404)
                .json({ success: false, message: "Plant not found" });
        }
        res
            .status(200)
            .json({ success: true, message: "Updated", data: updatedPlant });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.editProductBySku = editProductBySku;
const deleteProductBySku = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sku } = req.params;
        const deleteProduct = yield plant_model_1.default.findOneAndUpdate({ sku: sku }, { deleted: true }, { new: true });
        if (!deleteProduct) {
            return res.status(404).json({
                success: false,
                message: "Plant not found with this SKU",
            });
        }
        res.status(201).json({
            success: true,
            message: "Plant deleted successfully",
            data: deleteProduct,
        });
    }
    catch (error) {
        console.error("Error updating plant by SKU:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteProductBySku = deleteProductBySku;
const getAllProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plants = yield plant_model_1.default.find({ deleted: { $ne: true } }).populate("category");
        if (!plants || plants.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No plants found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Plants retrieved successfully",
            data: plants,
        });
    }
    catch (error) {
        console.error("Error fetching plants:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.getAllProduct = getAllProduct;
const getDetailBySku = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sku = req.params;
        const plant = yield plant_model_1.default.findOne({ sku, deleted: { $ne: true } });
        if (!plant) {
            return res.status(404).json({
                success: false,
                message: "Plant not found with this SKU",
            });
        }
        res.status(201).json({
            success: true,
            message: "Plant found with this SKU successfully",
            data: plant,
        });
    }
    catch (error) {
        console.error("Error updating plant by SKU:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getDetailBySku = getDetailBySku;
