const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    {
        email : {type : String, required : true},
        otp : {type : String, required : true},
        expireAt : {
            type : Date,
            expires : 180
        }
    },
    {
        timestamps : true
    }
);

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema,"forgot-password");

export default ForgotPassword;