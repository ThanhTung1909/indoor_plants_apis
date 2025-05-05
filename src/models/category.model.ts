import mongoose, { Schema, Document } from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

interface ICategory extends Document {
  title: string;
  description?: string;
  slug?: string;
  parentCategory?: mongoose.Types.ObjectId;
  imageUrl?: string;
  isActive?: boolean;
}

const CategorySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    slug: {
      type: String,
      slug: "title", 
      unique: true,
      slugPaddingSize: 4, 
      permanent: false, 
    },
    parentCategory: { type: mongoose.Types.ObjectId, ref: "Category" },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<ICategory>(
  "Category",
  CategorySchema,
  "categories"
);
export default Category;
