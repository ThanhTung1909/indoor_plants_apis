import mongoose, {Schema} from "mongoose";

const UserSchema: Schema = new Schema(
    {
        username : {type: String, required: true, unique: true},
        password : {type: String, required: true},
        email : {type: String, required: true, unique: true},
        token : {type : String, required: true},
        avatar : { type: String},
        myFavouriteTree : {type : [String]},
        address : {type : [String]},
        phone : {type : String},
        role : {type: String, default: "user"},
        status : {type: String, default: "active"},
    },
    {
        timestamps: true
    }

)

const User = mongoose.model("User", UserSchema, "user")
export default User;