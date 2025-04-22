import mongoose, { Schema, Document } from "mongoose";

interface IBlogCategory extends Document {
  title: string;
  description: string;
}

const BlogCategorySchema: Schema = new Schema({
  title: { type: String, require: true },
  description: { type: String },
},{
    timestamps: true,
});

const BlogCategory = mongoose.model<IBlogCategory>(
  "BlogCategory",
  BlogCategorySchema,
  "blogCategory"
);

export default BlogCategory;
