const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const User =  require('../blogModels/usersModel');
const JWT = require('jsonwebtoken');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (request, file, callback){
        callback(null, 'C:/Users/Sean/Desktop/React/mern-blog/client/public/UserImages');
    },
    filename: function(request, file, callback){
        callback(null, Date.now() + file.originalname);
    },
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*3
    },
})


const signDaToken = userID =>{
    return JWT.sign({
        iss : "SejoMernBlog" /*aka the issuer */ ,
        sub : userID,   
    }, "SejoMernBlog", {expiresIn: "1h"})
}
router.post('/register',upload.single('userImage'), (req, res)=>{
    const {username, password, role, email} = req.body;
    const{filename} = req.file;

    console.log(username, password, role, email, filename);
    User.findOne({username}, (err, user)=>{
        if(err)
            res.status(500).json({message: {msgBody : "Error has occured at server when finding this user", msgError: true}});
        if(user)
            res.status(400).json({message: {msgBody : "Username is already taken", msgError: true}});
        else{
            const newUser = new User(
                {
                    username: username, 
                    password: password,
                    role: role, 
                    email: email, 
                    userImageUrl: filename
                }
                );
            newUser.save(err=>{
                if(err)
                    res.status(500).json({message: {msgBody : "Error has occured at server after save", msgError: true}});
                else
                    res.status(201).json({message: {msgBody : "New user registered bro!!", msgError: false}});
    
            })
        }
    })
});

router.post('/login', passport.authenticate('local', {session : false}),(req, res)=>{
    if(req.isAuthenticated()){
        const {_id, username, role, userImageUrl, email} = req.user;
        const token = signDaToken(_id);
        res.cookie('access_token', token, {httpOnly: true, sameSite:true});
        res.status(200).json({isAuthenticated: true, user: { username,email, role, userImageUrl}})
    }
})

router.get('/logout', passport.authenticate('jwt', {session: false}), (req, res)=>{
    res.clearCookie('access_token');
    res.status(200).json({user:{username:"", role:"", userImageUrl:""}, success : true});
});

router.get('/admin', passport.authenticate('jwt', {session: false}), (req, res) =>{
    if(req.user.role ==='admin'){
        res.status(200).json({message : {msgBody : 'Sup admin bro?!', msgError : false}})
    }
    else
        res.status(403).json({message : {msgBody: "Not an admin bro!", msgError : true}})
});

/*The following endpoint makes sure that the front-end and back-end syncs. Without this, 
if the user were to close the browser, the react State that says that they area logged in
would be reset.This would essentially kick the user out even if they didn't log out*/
router.get('/authenticated', passport.authenticate('jwt', {session: false}), (req, res) =>{
   const{username, role, userImageUrl, email} = req.user;
   res.status(200).json({isAuthenticated: true, user : {username, role, userImageUrl, email}})
});
module.exports = router;