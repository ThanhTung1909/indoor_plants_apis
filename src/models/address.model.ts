import mongoose, {Schema} from "mongoose";

const AddressSchema: Schema = new Schema(
    {
        country : {type: String, required: true, default: "Vietnam"},
        city : {type: String, required: true},
        district : {type: String, required: true},
        ward : {type: String, required: true},
        street : {type: String, required: true},
        note : {type: String}
    },
    {
        timestamps: true
    }

)

const Address = mongoose.model("Address", AddressSchema, "address");
export default Address;