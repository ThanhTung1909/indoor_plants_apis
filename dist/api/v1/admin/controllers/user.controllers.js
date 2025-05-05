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
exports.login = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const generate = __importStar(require("../../../../helper/generate"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existEmail = yield user_model_1.default.findOne({
        email: req.body.email,
    });
    if (existEmail) {
        res.status(400).json({
            success: false,
            message: "Email đã tồn tại",
        });
    }
    const inforUser = {
        username: req.body.username,
        email: req.body.email,
        password: (0, md5_1.default)(req.body.password),
        phone: req.body.phone,
        token: generate.generateRandomString(30),
        role: "admin",
    };
    const user = new user_model_1.default(inforUser);
    const data = yield user.save();
    const token = data.token;
    res.status(200).json({
        success: true,
        message: "Đăng ký tài khoản thành công",
        token: token,
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const user = yield user_model_1.default.findOne({
        email: email,
    });
    if (!user) {
        res.status(400).json({
            success: false,
            message: "Email không tồn tại",
        });
        return;
    }
    if ((0, md5_1.default)(password) !== user.password) {
        res.status(400).json({
            success: false,
            message: "Sai mật khẩu",
        });
        return;
    }
    if (user.role !== "admin") {
        res.status(400).json({
            success: false,
            message: "Không có quyền truy cập",
        });
        return;
    }
    const token = user.token;
    res.status(201).json({
        success: true,
        message: "Đăng nhập thành công",
        token: token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.username,
        },
    });
});
exports.login = login;
