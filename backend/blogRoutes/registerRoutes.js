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
})

module.exports = router;