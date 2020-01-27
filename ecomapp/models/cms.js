const mongoose = require("mongoose");
//https://vegibit.com/mongoose-validation-examples/
const cmsSchema  = new mongoose.Schema({
    key:{
        type:String,
        trim:true,
        required:true,
        unique:32,
        index: true,
        validate:{
            validator:function(v){                
                 
                if (!/^[a-z_A-Z]+$/i.test(v)) {
                    return false
                }
                return v.length > 1
            },
         error : 'You must Provide more than 1 Charachter'   
        }
    },
    value:{
        type:String,
        trim:true,
        required:true,
        maxlength:2000
    }
},{timestamps:true}) 
module.exports = mongoose.model("CMS",cmsSchema)