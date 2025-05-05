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
exports.softDeleteCategoryBySlug = exports.updateCategoryBySlug = exports.getCategoryBySlug = exports.getAllCategories = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("../../../../models/category.model"));
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCategory = new category_model_1.default(req.body);
        const saved = yield newCategory.save();
        res.status(201).json({
            success: true,
            message: "Add Category SuccessFully",
            data: saved,
        });
    }
    catch (err) {
        res.status(400).json({ message: "Failed to create category", error: err });
    }
});
exports.createCategory = createCategory;
const getAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.find({ isActive: true }).populate("parentCategory");
        res.status(201).json({
            success: true,
            data: categories,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch categories", error: err });
    }
});
exports.getAllCategories = getAllCategories;
const getCategoryBySlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const category = yield category_model_1.default.findOne({ slug, isActive: true }).populate("parentCategory");
        if (!category)
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        res.status(200).json({
            success: true,
            message: "Category found successfuly",
            data: category,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch category", error: err });
    }
});
exports.getCategoryBySlug = getCategoryBySlug;
const updateCategoryBySlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const updated = yield category_model_1.default.findOneAndUpdate({ slug }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated)
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        res.status(201).json({
            success: true,
            message: "Category update successfully",
            data: updated,
        });
    }
    catch (err) {
        res.status(400).json({ message: "Failed to update category", error: err });
    }
});
exports.updateCategoryBySlug = updateCategoryBySlug;
const softDeleteCategoryBySlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const deleted = yield category_model_1.default.findOneAndUpdate({ slug }, { isActive: false }, { new: true });
        if (!deleted)
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        res.status(201).json({
            success: true,
            message: "Category deleted (soft)",
            category: deleted,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to delete category", error: err });
    }
});
exports.softDeleteCategoryBySlug = softDeleteCategoryBySlug;
