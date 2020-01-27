const CMS = require('../models/cms');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    
    const cms = new CMS(req.body);
    cms.save((error,data)=>{
        if(error){
            console.log(error);
            return res.status(400).json({
                error:errorHandler(error)?errorHandler(error):"Invalid Data"
            })
        }
        // return save data
        return res.json(data)
    }) 
}

exports.update = (req, res) => {    
    const {key} = req.params;
    
    // Get the cms id
    CMS.findOne({key}, (err,cmsdata)=>{
        
    if(err){
        return res.status(500).json({error:"Key not found"})
    }
       
    
        CMS.findOneAndUpdate({_id:cmsdata._id},{$set:req.body},{new:true},(error,udata)=>{
            if(error){
            return res.status(400).json({erro:"Error Occured while updating the Data"})
            }
            return res.json(udata);
        })        
    })
}

exports.remove = (req,res)=>{
    let removecmsdata = req.cms;
    console.log(removecmsdata);
    removecmsdata.remove((err,cmsrem)=>{
        if(err){
            return res.status(400).json({"error":errorHandler(err)})
        }
        return res.json({"message":"Data successfully deleted"})
    })
} 
exports.cmsById = (req,res,next,id) =>{
    
        CMS.findById(id).exec((err,cmsdata)=>{
            if(err){
                return res.status(400).json({error:"Category does Not Exists"});
            }
            req.cms = cmsdata;
            next();
        })
    
}
exports.list = (req,res)=>{
    CMS.find()
        .exec((err,cmsdata)=>{
            if(err){
                return res.status(400).json({"error":"CMS not found"})
            }
            res.json(cmsdata)
        })
    return 
}