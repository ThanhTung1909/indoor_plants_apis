import mongoose, {Schema} from "mongoose";

const CategorySchema: Schema = new Schema(
    {
        title: {type: String, required: true},
    },
    {
        timestamps: true
    }

)

const Category = mongoose.model("Category", CategorySchema, "category")
export default Category