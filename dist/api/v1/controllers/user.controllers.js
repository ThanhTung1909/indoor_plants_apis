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
exports.deleteFavouriteTree = exports.addFavouriteTree = exports.myFavourite = void 0;
const user_model_1 = __importDefault(require("../../../models/user.model"));
const plant_model_1 = __importDefault(require("../../../models/plant.model"));
const myFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const listTreeId = yield user_model_1.default.find({ token: token }).select("myFavouriteTree");
        let data = [];
        if (listTreeId) {
            data = yield plant_model_1.default.find({ id: { $in: listTreeId } });
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
        const myFavouriteTree = yield user_model_1.default.findById({ token: token }).select("myFavouriteTree");
        if (myFavouriteTree.includes(treeId)) {
            res.status(500).json({
                success: false,
                message: "Cây đã có trong danh sách yêu thích",
            });
        }
        else {
            yield user_model_1.default.findByIdAndUpdate({ token: token }, {
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
        const myFavouriteTree = yield user_model_1.default.findById({ id: token }).select("myFavouriteTree");
        if (myFavouriteTree.includes(treeId)) {
            yield user_model_1.default.findByIdAndUpdate({ token: token }, {
                $pull: { myFavouriteTree: treeId },
            });
            res.status(200).json({
                success: true,
                message: "Đã xóa cây thành công",
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Không tìm thấy cây trong danh sách yêu thích",
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
exports.deleteFavouriteTree = deleteFavouriteTree;
