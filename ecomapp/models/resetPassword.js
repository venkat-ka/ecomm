const mongoose = require('mongoose');


const resetPasswordSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    resetPasswordToken:{
        type:String,
        trim:true,
        required:true,
        unique:32
    },
    expire:{
        type:String,
        trim:true,
        required:true
    },
    status:{
        required:false,
        type:Number,
        default:0,
        enum:[0,1]
    }
})

module.exports = mongoose.model("resetPassword",resetPasswordSchema)