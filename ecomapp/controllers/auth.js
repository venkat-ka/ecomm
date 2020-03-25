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
exports.forgetpassword = (req,res)=>{

   
   
    
    const {email,password} = req.body;
    
    User.findOne({email}, function(err, user){
        if(err||!user){
            return res.status(400).json({
                error:'Email Id does not exists'
            })
        }
        const {userId} = user._id; 
    // Code will take the UserId using User Email
       // let userProfile =  userByEmail(email, '')
     // Code will remove existing UserId in resetPasswordTable and newEntrie will set   
        ResetPassword.findOne({

            where: { userId : userId, status: 0 } 

                            })
                            .then(function(resetPassword){
            if(resetPassword){
                resetPassword.destroy({ where : { id: resetPassword.id } })
            }
        })
        token = crypto.randomBytes(32).toString('hex')//creating the token to be sent to the forgot password form (react)
        //https://meanstackdeveloper.in/implement-reset-password-functionality-in-node-js-express.html

       
        bcrypt.hash(token, 10, function (err, hash) {//hashing the password to store in the db node.js
            
            ResetPassword.create({
                userId: userId,
                resetPasswordToken: hash,
                expire: moment.utc().add(15, 'seconds'),
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
   `<a href='${process.env.SITE_URL}/reset/${user._id}/${token}'>Reset Your Password</a>` +
                    '<br><br>' +
                    '<p>--Team</p>'
                }
//console.log(`${process.env.SITE_URL}/reset/${user._id}/${token}`)
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
