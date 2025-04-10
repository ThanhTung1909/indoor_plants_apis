import mongoose, {Schema} from "mongoose";

const HistorySchema: Schema = new Schema(
    {
      userId : {type : mongoose.Types.ObjectId, required: true},
      myProducts : {type : [
        {
            productId : {type: mongoose.Types.ObjectId},
            quantity : {type: Number, default: 1},
            totalPrice : {type: Number, required: true},
        }
      ]},
      addressId : {type : mongoose.Types.ObjectId, required: true},
      total : {type: Number, required: true},
      status : {type: String, required: true,default: "pending"},
    },
    {
        timestamps: true
    }

)

const History = mongoose.model("History", HistorySchema, "history");
export default History;