const User = require('../models/user');
const {userByEmail} = require('../controllers/user')
const ResetPassword = require('../models/resetPassword');
const {errorHandler} = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken'); //to generate signed token
const expressJwt = require('express-jwt'); // for authoriztion check
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const moment = require('moment');
const bcrypt = require('bcrypt');
// require on top
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

exports.signup = (req,res)=>{
   
    const user = new User(req.body);
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({error:errorHandler(err)});
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({user});
    });
    //res.json({message:"Say Hi controller"});
};
exports.signin = (req,res)=>{
    
    //find user based email
    const {email,password} = req.body;
    User.findOne({email},(err,user)=>{
        if(err||!user){
            return res.status(400).json({
                error: 'User with that email doesnot exist'
            })
        }
        // if user is found make sure the email and password match

        //create authentication method in usermodel
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:'Email and Password dont match'
            })
        }
        //generate a signed token with user id and secret
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET)
        //persisits the token as 't' in cookie with expiry date
        res.cookie('t',token,{expire:new Date()+9999})
        //return response with user and token to frontend client
        const {_id, name, email, role} = user
        return res.json({token,user:{_id,email,name,role}});
    })
}

passwordState = (id) =>{
    
    ResetPassword.updateOne({_id : id},{ $set: {status: 1}}
        ,(err, msg) => {
        
        if(!msg){
        
        return err
        }
        else
        
        return "Password state successfully."
        
    });
}

// ValidateTheToken time by using
exports.validateTheToken = (req, res, next)=>{
// To check 

// To check expire time
ResetPassword.findOne({_id:req.body._id},(err, data)=>{
    
    const {expire, status} = data;
    if(status==1){
        console.log("Invalid Token or Token has been expires")
        return res.status(400).json({error: "Invalid Token or Token has been expires" })
    }
    
    let expDate = new Date(expire).getTime()/1000;
    let curDate = new Date().getTime()/1000;
   
    if(curDate > expDate){
        console.log("Expire")
        passwordState(req.body._id);
        return res.status(400).json({error: "Token has been expired" })
        // Here setState as 1
    }
    else{
     console.log("Not Expire")
     // Reset Password Store New Password


     // Make An State of ResetPassword Table state as 1
     //"5e689984be5d3a1c1fe4fc5b"
     passwordState(req.body._id);
     // Here store New Password
     User.findOne({email : req.profile.email},(err,user)=>{
         if(err){
             res.status(401).json({ "error": "Email Id Does not Exists with this User Id"})
         }
        //const encryptPassword = user.encryptPassword(req.body.password);

        if(!req.body.password){
            return res.status(401).json({
                error:'Invalid Password'
            })
        }
        req.profile.password = req.body.password;
        
        next()
        //return res.status(200).json({message: "Password Has been updated succesfully" })
    })
        
    
    
     
     
    }
 return res;
 })

}
// Store Reset Passowrd
exports.storeResetPassword = (req,res)=>{
     // Message
     User.findOneAndUpdate({_id:req.body.userId},{ $set:req.profile},(err,data)=>{
             
        if(err){
            console.log(err)
        }
        if(data){
            console.log(data, 'dddd data')
        return res.status(200).json({message: "Password Has been updated succesfully" })
       }
    })
}
//Code recieve the form datas like token 
exports.updateResetPassword = (req, res, next)=>{
    
    // Token Password
    
    ResetPassword.findOne({resetPasswordToken:req.body.token}, ((err, data)=>{
        if(err || !data){
            // data._id is resetpasword table id
            console.log(err)
            return res.status(400).json({error: "Invalid Token" })
            
        }
       
        if(data){
            

            req.body._id = data._id;
            req.body.userId = data.userId
            // User Email append to req
            User.findOne({_id:data.userId}, function(err, user){
                if(err||!user){
                    return res.status(400).json({
                        error:'User Id does not exists'
                    })
                    }
                   
                  req.profile = user;  
                  next()
                })
            
            
           
        }
    }))
    
}
// Sending Email Link To User
exports.forgetpassword = (req,res)=>{
 
    const {email} = req.body;
    
    User.findOne({email}, function(err, user){
        if(err||!user){
            return res.status(400).json({
                error:'Email Id does not exists'
            })
        }
       
        const userId = user._id;

     // Code will remove existing UserId in resetPasswordTable   
        ResetPassword.findOne({ userId : userId }).exec((err, resetPassword)=>{
                                
            if(resetPassword){
              
                ResetPassword.deleteMany({ userId:userId}, function(err, obj){
                    if(err){
                        console.log(err)
                    }
                } )
            }
        })
        token = crypto.randomBytes(32).toString('hex')//creating the token to be sent to the forgot password form (react)
        //https://meanstackdeveloper.in/implement-reset-password-functionality-in-node-js-express.html

       
            
        bcrypt.hash(token, 10, function (err, hash) {//hashing the password to store in the db node.js
           
        // Create New Entries
        ResetPassword.create({
            userId: userId,
            resetPasswordToken: hash,
            expire: moment.utc().add(4600, 'seconds'),
            status:0
        }).then(function (item) {
            if (!item)
                return res.json({error: 'Oops problem in creating new password record'})
                // console.log(user.email, 'vnnn');	
                let mailOptions = {
                to: user.email,
                from: 'demo@pickthings.in',
                subject: 'Reset your pickthings account password',
                html: '<h4><b>Reset Password</b></h4>' +
                '<p>To reset your password, complete this form:</p>' +
`<a href="${process.env.SITE_URL}/reset/${user._id}/${hash}">Reset Your Password</a>` +
                '<br><br>' +
                '<p>--Team</p>'
            }

                let mailSent = sgMail.send(mailOptions).then(sent => {

            //console.log('token <<<<', token);
            //console.log(user._id)
}
//res.status(200).json({message:"Password Reset Link has been sent to your mail"})
) .catch(err => console.log('ERR >>>', err));//sending mail to the user where he can reset password.User id and the token generated are sent as params in a link
            })
              })
        
    // If Email Id Exists send the OTP to email with expir link withing 12 minutes
     return res.status(200).json({
            message:"Email Id Found"
        })
    })
}
exports.signout = (req,res)=>{
    res.clearCookie('t');
    res.json({message:'Signout Success'});
}
exports.requireSignin = expressJwt({
    secret:process.env.JWT_SECRET,
    userProperty:"auth"
})
exports.isAuth = (req,res,next) =>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
        return res.status(403).json({
            error:"Access Denied"
        });
    }
    next();
};
exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status("403").json({error:"Admin Resource! Access Denied"});
    }
    next();
}