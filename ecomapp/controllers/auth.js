const User = require('../models/user');
const {errorHandler} = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken'); //to generate signed token
const expressJwt = require('express-jwt'); // for authoriztion check

exports.signup = (req,res)=>{
    console.log('req.body',req.body)
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