import mongoose, { Schema, Document, Types } from "mongoose";

interface OrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  UserId: Types.ObjectId;
  orderItems: OrderItem[];
  receiverName: string;
  receiverEmail: string;
  shippingAddress: string;
  phone: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cod" | "bank_transfer" | "paypal";
  paymentStatus: "unpaid" | "paid";
  shippingFee?: number;
  deliveryDate?: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    UserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Plant",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    receiverName: { type: String, required: true },
    receiverEmail: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    phone: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "bank_transfer", "paypal"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    shippingFee: { type: Number, default: 0 },
    deliveryDate: { type: Date },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema, "orders");
export default Order;
