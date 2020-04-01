const express = require('express');
const router = express.Router();

const {userByEmail} = require('../controllers/user')
const {signup,signin, signout, requireSignin, forgetpassword, updateResetPassword,validateTheToken,storeResetPassword} = require("../controllers/auth");
const {userSignupValidator, userPasswordValidator} = require('../validator')
router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.get('/forgetpassword',  userByEmail, forgetpassword)
router.post('/update-password', updateResetPassword, validateTheToken, userPasswordValidator, storeResetPassword)
router.get("/hello", requireSignin, (req,res) =>{
    res.send("hello there");
} )
module.exports = router;