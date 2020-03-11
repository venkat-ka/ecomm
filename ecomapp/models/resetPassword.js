const mongoose = require('mongoose');


const resetPasswordSchema = new mongoose.Schema({
    userId:{
        type:Number
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
        type:Boolean
    }
})

module.exports = mongoose.model("resetPassword",resetPasswordSchema)