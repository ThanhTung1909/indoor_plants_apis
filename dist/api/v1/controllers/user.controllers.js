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
exports.myFavouriteFilter = exports.deleteFavouriteTree = exports.addFavouriteTree = exports.myFavourite = exports.getUser = void 0;
const user_model_1 = __importDefault(require("../../../models/user.model"));
const plant_model_1 = __importDefault(require("../../../models/plant.model"));
const pagination_helpler_1 = __importDefault(require("../../../helper/pagination.helpler"));
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
        const user = yield user_model_1.default.findOne({ id: userId }).select("myFavouriteTree");
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
        const user = yield user_model_1.default.findOne({ token: token }).select("myFavouriteTree");
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
        const user = yield user_model_1.default.findOne({ token: token }).select("myFavouriteTree");
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
        const user = yield user_model_1.default.findOne({ id: userId }).select("myFavouriteTree");
        let data = [];
        if (user && user.myFavouriteTree) {
            const currentLimit = 8;
            const { page, category, sort } = req.query;
            const [key, value] = typeof sort === 'string' ? sort.split("-") : ["", ""];
            const find = {};
            const sortVa = {};
            if (category) {
                find['category'] = category;
            }
            if (key !== "" && value !== "") {
                sortVa[key] = value;
            }
            data = yield plant_model_1.default.find({ id: { $in: user.myFavouriteTree } });
            const pagination = (0, pagination_helpler_1.default)(parseInt(page), currentLimit, data.length);
            const result = yield plant_model_1.default.find(Object.assign({ id: { $in: user.myFavouriteTree } }, find))
                .sort(sortVa)
                .skip(pagination.skip)
                .limit(currentLimit);
            res.status(200).json({
                success: true,
                data: result,
                pagination: pagination
            });
        }
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
