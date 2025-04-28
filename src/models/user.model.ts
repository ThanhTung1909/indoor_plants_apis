
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true },
    avatar: { type: String },
    myFavouriteTree: { type: [String] },
    address: [
      {
        street: { type: String },        // Tên đường, số nhà
        ward: { type: String },          // Phường, xã
        district: { type: String },      // Quận, huyện
        city: { type: String },          // Tỉnh, thành phố
        isDefault: { type: Boolean, default: false }, // Địa chỉ mặc định
      },
    ],
    phone: { type: String },
    role: { type: String, default: "user" },
    status: { type: String, default: "active" },
    otp : {type : String},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema, "user");
export default User;
