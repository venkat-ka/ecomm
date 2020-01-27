const express = require("express")
const router = express.Router();
const {requireSignin, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');
const {create, update, remove, cmsById,list} = require('../controllers/cms')
router.post('/cms/create/:userId',requireSignin, isAuth,create)
router.put('/cms/update/:key/:userId',requireSignin, isAuth,update)
router.delete('/cms/:cmsId/:userId',requireSignin, isAuth,remove)
router.get('/cms/list/:userId',requireSignin, isAuth,list)
router.param("userId",userById);
router.param("cmsId",cmsById);

module.exports = router;