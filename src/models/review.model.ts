import mongoose, { mongo, Document, Schema } from "mongoose";

interface IReview extends Document {
    user_id: mongoose.Types.ObjectId
    plant_id: mongoose.Types.ObjectId
    rating: number;
    content: string
    rating_date: Date
}

const ReviewSchema: Schema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User', require: true},
    plant_id: {type: Schema.Types.ObjectId, ref: 'Plant', require: true},
    rating: {type: Number, require: true, min: 1, max: 5},
    content: {type: String},
    rating_date: {type: Date, default: Date.now}
}, {
    timestamps: true,
})

const Review = mongoose.model<IReview>('Review', ReviewSchema, 'review')
export default Review