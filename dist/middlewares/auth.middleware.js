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
exports.requireAdminAuth = exports.requireAuth = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = yield user_model_1.default.findOne({
            token: token,
        }).select("-password -token");
        if (!user) {
            res.status(403).json({
                success: false,
                message: "Không có quyền truy cập",
            });
        }
        else {
            req.user = user;
            next();
        }
    }
    else {
        res.status(403).json({
            success: false,
            message: "Không có quyền truy cập",
        });
    }
});
exports.requireAuth = requireAuth;
const requireAdminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(403).json({
                success: false,
                message: "Không có quyền truy cập",
            });
        }
        const token = authHeader.split(" ")[1];
        const user = yield user_model_1.default.findOne({ token }).select("-password -token");
        if (!user || user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Không có quyền truy cập",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Auth error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi xác thực người dùng",
        });
    }
});
exports.requireAdminAuth = requireAdminAuth;
