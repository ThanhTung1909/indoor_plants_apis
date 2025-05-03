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
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planData = req.body;
        const newPlan = new plant_model_1.default(planData);
        yield newPlan.save();
        res.status(201).json({
            success: true,
            message: "Add Plant SuccessFully",
            data: newPlan,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi thêm cây mới",
            error: error.message,
        });
    }
});
exports.create = create;
const editProductBySku = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sku } = req.params;
        const updateData = req.body;
        const updatedPlant = yield plant_model_1.default.findOneAndUpdate({ sku }, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedPlant) {
            return res
                .status(404)
                .json({ success: false, message: "Plant not found with this SKU" });
        }
        res.status(201).json({
            success: true,
            message: "Plant update successfully",
            data: updatedPlant,
        });
    }
    catch (error) {
        console.error("Error updating plant by SKU:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.editProductBySku = editProductBySku;
const deleteProductBySku = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sku = req.params;
        const deleteProduct = yield plant_model_1.default.findOneAndUpdate({ sku }, { deleted: true }, { new: true });
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
        const plants = yield plant_model_1.default.find({ deleted: { $ne: true } });
        if (plants.length < 0) {
            return res.status(404).json({
                success: false,
                message: "Plant not found",
            });
        }
        res.status(201).json({
            success: true,
            message: "Plant found successfully",
            data: plants,
        });
    }
    catch (error) {
        console.error("Error updating plant by SKU:", error);
        res.status(500).json({ message: "Server error" });
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
