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
exports.login = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const token = user.token;
    res.status(201).json({
        success: true,
        message: "Đăng nhập thành công",
        token: token,
    });
});
exports.login = login;
