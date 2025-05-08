import mongoose, { Schema } from "mongoose";
export interface Address {
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  token: string;
  avatar?: string;
  myFavouriteTree?: string[];
  address?: Address[];
  phone?: string;
  role: string;
  status: string;
  otp?: string;
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true },
    avatar: { type: String },
    myFavouriteTree: { type: [String] },
    address: [
      {
        street: { type: String }, // Tên đường, số nhà
        ward: { type: String }, // Phường, xã
        district: { type: String }, // Quận, huyện
        city: { type: String }, // Tỉnh, thành phố
        isDefault: { type: Boolean, default: false }, // Địa chỉ mặc định
      },
    ],
    phone: { type: String },
    role: { type: String, default: "user" },
    status: { type: String, default: "active" },
    otp: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", UserSchema, "user");
export default User;
