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
exports.deleteReview = exports.getReviewsByPlant = exports.createReview = void 0;
const review_model_1 = __importDefault(require("../../../../models/review.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, plant_id, rating, content } = req.body;
        if (!user_id || !plant_id || !rating) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
        }
        const newReview = yield review_model_1.default.create({
            user_id,
            plant_id,
            rating,
            content,
            rating_date: new Date(),
        });
        return res.status(201).json({ success: true, data: newReview });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi tạo đánh giá', error: error.message });
    }
});
exports.createReview = createReview;
const getReviewsByPlant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { plant_id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(plant_id)) {
            return res.status(400).json({ success: false, message: 'plant_id không hợp lệ' });
        }
        const reviews = yield review_model_1.default.find({ plant_id })
            .populate('user_id', 'username avatar')
            .sort({ rating_date: -1 });
        return res.status(200).json({ success: true, data: reviews });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy đánh giá', error: error.message });
    }
});
exports.getReviewsByPlant = getReviewsByPlant;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewId } = req.params;
        const review = yield review_model_1.default.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
        }
        return res.status(200).json({ success: true, message: 'Xóa đánh giá thành công' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi xóa đánh giá', error: error.message });
    }
});
exports.deleteReview = deleteReview;
