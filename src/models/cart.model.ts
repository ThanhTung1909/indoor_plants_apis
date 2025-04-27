import mongoose, { Schema, Document, Types } from "mongoose";
import { title } from "process";

// Định nghĩa interface cho từng mục trong giỏ hàng
interface CartItem {
  productId: Types.ObjectId | any;
  quantity: number;
  totalPrice: number;

}

export interface ICart extends Document {
  UserId:  Types.ObjectId;
  myCart: CartItem[];
}

const CartSchema: Schema = new Schema(
  {
    UserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    myCart: [
      {
        productId: { type:  mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
        quantity: { type: Number, default: 1 },
        totalPrice: { type: Number, required: true },
       
        
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Khai báo model với kiểu ICart
const Cart = mongoose.model<ICart>('Cart', CartSchema, 'cart');
export default Cart;
