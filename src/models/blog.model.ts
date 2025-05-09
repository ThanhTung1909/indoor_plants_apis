import mongoose, { Schema, Document, Types } from "mongoose";

interface IBlog extends Document {
  title: string;
  content: string;
  summary: string;
  image: string;
  posting_date: Date;
  views: number;
  blog_category: Types.ObjectId;
  sections: {
    title: string;
    content: string;
    subSections?: {
      title: string;
      content: string;
    }[];
  }[];
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String },
  posting_date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  blog_category: {
    type: Schema.Types.ObjectId,
    ref: "BlogCategory",
    required: true,
  },
  sections: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      subSections: [
        {
          title: { type: String, required: true },
          content: { type: String, required: true },
        },
      ],
    },
  ],
}, {
    timestamps: true,
});

const Blog = mongoose.model<IBlog>("Blog", BlogSchema, "blog")
export default Blog
