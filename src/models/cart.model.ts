import mongoose, {Schema} from "mongoose";

const CartSchema: Schema = new Schema(
    {
        userId : {type : mongoose.Types.ObjectId, required: true},
        myCart : {type : [
           {
            productId : {type: mongoose.Types.ObjectId},
            quantity : {type: Number, default: 1},
            totalPrice : {type: Number, required: true},
           }
            
        ]} 
    },
    {
        timestamps: true
    }

)

const Cart = mongoose.model("Cart", CartSchema, "cart");
export default Cart;