import { Request, Response } from 'express';
import Review from '../../../../models/review.model';
import mongoose from 'mongoose';

// Tạo review mới
export const createReview = async (req: Request, res: Response) => {
  try {
    const { user_id, plant_id, rating, content } = req.body;

    if (!user_id || !plant_id || !rating) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const newReview = await Review.create({
      user_id,
      plant_id,
      rating,
      content,
      rating_date: new Date(),
    });

    return res.status(201).json({ success: true, data: newReview });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Lỗi khi tạo đánh giá', error: error.message });
  }
};

// Lấy tất cả review của 1 cây theo plant_id
export const getReviewsByPlant = async (req: Request, res: Response) => {
  try {
    const { plant_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(plant_id)) {
      return res.status(400).json({ success: false, message: 'plant_id không hợp lệ' });
    }

    const reviews = await Review.find({ plant_id })
      .populate('user_id', 'username avatar')
      .sort({ rating_date: -1 });

    return res.status(200).json({ success: true, data: reviews });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy đánh giá', error: error.message });
  }
};



// Xóa đánh giá
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá' });
    }

    return res.status(200).json({ success: true, message: 'Xóa đánh giá thành công' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa đánh giá', error: error.message });
  }
};
