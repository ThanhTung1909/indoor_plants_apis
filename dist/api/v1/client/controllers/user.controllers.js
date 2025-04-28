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
exports.myFavouriteFilter = exports.deleteFavouriteTree = exports.addFavouriteTree = exports.myFavourite = exports.getUser = exports.resetPassword = exports.forgotPasswordOTP = exports.forgotPassword = exports.login = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../../../../models/user.model"));
const plant_model_1 = __importDefault(require("../../../../models/plant.model"));
const forgotPassword_model_1 = __importDefault(require("../../../../models/forgotPassword.model"));
const generate = __importStar(require("../../../../helper/generate"));
const pagination_helpler_1 = __importDefault(require("../../../../helper/pagination.helpler"));
const mongoose_1 = __importDefault(require("mongoose"));
const sendMail_1 = __importDefault(require("../../../../helper/sendMail"));
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
    res.cookie("token", user.token);
    res.status(201).json({
        success: true,
        message: "Đăng nhập thành công",
        token: token,
    });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_model_1.default.findOne({ email: email });
    if (!user) {
        res.status(400).json({
            success: false,
            message: "Email không tồn tại",
        });
        return;
    }
    const otp = generate.generateRandomNumber(8);
    const forgotPassword = new forgotPassword_model_1.default({
        email: email,
        otp: otp,
        expireAt: Date.now()
    });
    yield forgotPassword.save();
    const subject = "Mã OTP xác minh yêu cầu thay đổi mật khẩu từ Paradise Plants";
    const html = `
    <p>Chào bạn,</p>

    <p>Để bảo mật tài khoản của bạn, Paradise Plants đã nhận được yêu cầu thay đổi mật khẩu. Mã OTP xác minh của bạn là:</p>

    <h2 style="color: #4CAF50; font-weight: bold;">${otp}</h2>

    <p>Vui lòng nhập mã OTP trên trong vòng 3 phút để hoàn tất việc thay đổi mật khẩu.</p>

    <p>Chú ý: Mã OTP này chỉ có hiệu lực trong 3 phút và không được chia sẻ với bất kỳ ai. Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>

    <p>Trân trọng,<br>Đội ngũ hỗ trợ của Paradise Plants</p>
  `;
    (0, sendMail_1.default)(email, subject, html);
    res.status(200).json({
        success: true,
        message: "Email không tồn tại",
    });
});
exports.forgotPassword = forgotPassword;
const forgotPasswordOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = yield forgotPassword_model_1.default.findOne({
        email: email,
        otp: otp,
    });
    if (!result) {
        res.status(400).json({
            success: false,
            message: "Mã OTP không chính xác hoặc đã hết hạn",
        });
        return;
    }
    const user = yield user_model_1.default.findOne({
        email: email,
    });
    res.status(200).json({
        success: true,
        message: "Mã OTP chính xác",
        token: user.token,
    });
});
exports.forgotPasswordOTP = forgotPasswordOTP;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const token = req.body.tokenValue;
    const result = yield user_model_1.default.updateOne({
        token: token,
    }, {
        password: (0, md5_1.default)(password),
    });
    if (!result) {
        res.status(400).json({
            success: false,
            message: "Cập nhật mật khẩu không thành công",
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: "Cập nhật mật khẩu thành công",
    });
});
exports.resetPassword = resetPassword;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const user = yield user_model_1.default.findOne({ token: token });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng",
            });
        }
        else {
            res.status(200).json({
                success: true,
                data: user,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Khong tìm thấy người dùng",
            error: error.message,
        });
    }
});
exports.getUser = getUser;
const myFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = (yield user_model_1.default.findOne({ id: userId }).select("myFavouriteTree"));
        let data = [];
        if (user && user.myFavouriteTree) {
            data = yield plant_model_1.default.find({ id: { $in: user.myFavouriteTree } });
        }
        res.status(200).json({
            success: true,
            data: data,
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
exports.myFavourite = myFavourite;
const addFavouriteTree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const treeId = req.body.treeId;
        const token = req.body.token;
        const user = (yield user_model_1.default.findOne({ token: token }).select("myFavouriteTree"));
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng",
            });
        }
        if (user.myFavouriteTree.includes(treeId)) {
            return res.status(400).json({
                success: false,
                message: "Cây đã có trong danh sách yêu thích",
            });
        }
        else {
            yield user_model_1.default.updateOne({ token: token }, {
                $push: { myFavouriteTree: treeId },
            });
            res.status(200).json({
                success: true,
                message: "Cây đã được thêm vào danh sách yêu thích",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi thêm cây vào danh sách yêu thích",
            error: error.message,
        });
    }
});
exports.addFavouriteTree = addFavouriteTree;
const deleteFavouriteTree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const treeId = req.body.treeId;
        const token = req.body.token;
        const user = (yield user_model_1.default.findOne({ token: token }).select("myFavouriteTree"));
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng",
            });
        }
        if (user.myFavouriteTree.includes(treeId)) {
            yield user_model_1.default.updateOne({ token: token }, {
                $pull: { myFavouriteTree: treeId },
            });
            return res.status(200).json({
                success: true,
                message: "Xóa cây khỏi danh sách yêu thích thành công",
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Cây chưa có trong danh sách yêu thích",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi xóa cây khỏi danh sách yêu thích",
            error: error.message,
        });
    }
});
exports.deleteFavouriteTree = deleteFavouriteTree;
const myFavouriteFilter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = (yield user_model_1.default.findById(userId).select("myFavouriteTree"));
        const objectIds = user.myFavouriteTree.map((id) => new mongoose_1.default.Types.ObjectId(id));
        const currentLimit = 8;
        const { page = 1, category, sort } = req.query;
        const [key, value] = typeof sort === "string" ? sort.split("-") : ["", ""];
        const find = {};
        const sortVa = {};
        console.log(req.query);
        console.log("category", category);
        console.log("sort", sort);
        if (category) {
            find["category"] = category;
        }
        if (key && value) {
            sortVa[key] = value === "asc" ? 1 : -1;
        }
        const data = yield plant_model_1.default.find(Object.assign({ _id: { $in: objectIds } }, find));
        const pagination = (0, pagination_helpler_1.default)(parseInt(page), currentLimit, data.length);
        const result = yield plant_model_1.default.find(Object.assign(Object.assign({}, find), { _id: { $in: objectIds } }))
            .sort(sortVa)
            .skip(pagination.skip)
            .limit(currentLimit);
        console.log(find);
        console.log(sortVa);
        console.log(pagination);
        res.status(200).json({
            success: true,
            data: result,
            pagination,
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
exports.myFavouriteFilter = myFavouriteFilter;
