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
exports.getBlogById = exports.getAll = exports.getAllBlogCategory = void 0;
const blog_model_1 = __importDefault(require("../../../../models/blog.model"));
const blogCategory_model_1 = __importDefault(require("../../../../models/blogCategory.model"));
const getAllBlogCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogCategories = yield blogCategory_model_1.default.find();
        if (!blogCategories) {
            return res.status(404).json({
                success: false,
                message: "Lấy danh sách danh mục blog thất bại",
            });
        }
        const categoriesWithCount = yield Promise.all(blogCategories.map((category) => __awaiter(void 0, void 0, void 0, function* () {
            const count = yield blog_model_1.default.countDocuments({
                blog_category: category._id,
            });
            return Object.assign(Object.assign({}, category.toObject()), { blogCount: count });
        })));
        res.status(200).json({
            success: true,
            message: "Lấy danh sách danh mục blog thành công",
            blogCategories: categoriesWithCount,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách danh mục blog",
            error: error.message,
        });
    }
});
exports.getAllBlogCategory = getAllBlogCategory;
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blog_model_1.default.find().populate("blog_category");
        if (!blogs) {
            return res.status(404).json({
                success: false,
                message: "Lấy thông tin blog thất bại",
            });
        }
        res.status(200).json({
            success: true,
            message: "Lấy danh sách blog thành công",
            blogs: blogs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách blog",
            error: error.message,
        });
    }
});
exports.getAll = getAll;
const getBlogById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blog = yield blog_model_1.default.findById(id).populate("blog_category");
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Lấy thông tin blog thất bại",
            });
        }
        res.status(200).json({
            success: true,
            message: "Lấy thông tin blog thành công",
            blogs: blog,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy blog",
            error: error.message,
        });
    }
});
exports.getBlogById = getBlogById;
