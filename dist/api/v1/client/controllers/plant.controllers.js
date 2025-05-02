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
exports.plantsFilter = exports.getPlantsByLimit = exports.getCategories = exports.getPlantDetail = exports.getPlantsByCategory = exports.index = void 0;
const plant_model_1 = __importDefault(require("../../../../models/plant.model"));
const category_model_1 = __importDefault(require("../../../../models/category.model"));
const pagination_helpler_1 = __importDefault(require("../../../../helper/pagination.helpler"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plants = yield plant_model_1.default.find();
        res.status(200).json({
            success: true,
            data: plants,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách cây",
            error: error.message,
        });
    }
});
exports.index = index;
const getPlantsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const plants = yield plant_model_1.default.find({ category: categoryId });
        res.status(201).json({
            success: true,
            message: "Get Plants By Category SuccessFully",
            data: plants,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Get Plants By Category Fail",
            error: error.message,
        });
    }
});
exports.getPlantsByCategory = getPlantsByCategory;
const getPlantDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sku } = req.params;
        const plant = yield plant_model_1.default.findOne({ sku: sku });
        res.status(201).json({
            success: true,
            message: "Get Plant SuccessFully",
            data: plant,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Get Plant Fail",
            error: error.message,
        });
    }
});
exports.getPlantDetail = getPlantDetail;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.find();
        res.status(200).json({
            success: true,
            message: "Get All Category SuccessFully",
            data: categories,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Get All Category Fail",
            error: error.message,
        });
    }
});
exports.getCategories = getCategories;
const getPlantsByLimit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit } = req.params;
        const limitNumber = parseInt(limit);
        if (isNaN(limitNumber) || limitNumber <= 0) {
            return res.status(400).json({
                success: false,
                message: "Limit must be a positive number",
            });
        }
        const plants = yield plant_model_1.default.find().limit(limitNumber);
        res.status(201).json({
            success: true,
            message: "Get Plants SuccessFully",
            data: plants,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Get Plants Fail",
            error: error.message,
        });
    }
});
exports.getPlantsByLimit = getPlantsByLimit;
const plantsFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentLimit = 8;
        const { page, category, sort } = req.query;
        const [key, value] = typeof sort === "string" ? sort.split("-") : ["", ""];
        const find = {};
        const sortVa = {};
        if (category) {
            find["category"] = category;
        }
        if (key !== "" && value !== "") {
            sortVa[key] = value;
        }
        const data = yield plant_model_1.default.find(find);
        const pagination = (0, pagination_helpler_1.default)(parseInt(page), currentLimit, data.length);
        const plants = yield plant_model_1.default.find(find)
            .sort(sortVa)
            .skip(pagination.skip)
            .limit(currentLimit);
        res.status(201).json({
            success: true,
            data: plants,
            pagination: pagination,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
    }
});
exports.plantsFilter = plantsFilter;
