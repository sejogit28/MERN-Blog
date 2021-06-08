const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const {OAuth2Client} = require('google-auth-library');
const JWT = require('jsonwebtoken');
const multer = require('multer');
const blogUser = require('../blogModels/usersModel');


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
            const newUser = new blogUser(
                {
                    username: username, 
                    password: password,
                    role: role, 
                    email: email, 
                    userImageUrl: filename
                });
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
        res.status(200).json({isAuthenticated: true, user: {_id, username,email, role, userImageUrl}})
    }
});

const client = new OAuth2Client("909343250416-nj79c4cachka2hbd0dptdl6rp36feql3.apps.googleusercontent.com");

/*The commented out part(passport.authenticate...) was causing a 400 error. It doesn't appear
 to be neccesary for the google OAUTH to work*/
 
router.post('/googlelogin', /*passport.authenticate('local', {session : false}),*/ (req, res) => {
    const {tokenId} = req.body;
    client.verifyIdToken({idToken: tokenId, audience: "909343250416-nj79c4cachka2hbd0dptdl6rp36feql3.apps.googleusercontent.com"}).then(response =>{
        const{email_verified, name, email, picture, at_hash} = response.payload;
        //console.log(response.payload);
        console.log(name, email, picture, at_hash);
        if(email_verified)
        {
            blogUser.findOne({email}, (err, user)=>{
                if(err)
                {
                    res.status(500).json({message: {msgBody : "Error has occured at server: " + err, msgError: true}});
                }
                else
                {
                    if(user)
                    {
                       const {_id, username, role, userImageUrl, email} = user; 
                       const token = signDaToken(_id);
                        res.cookie('access_token', token, {httpOnly: true, sameSite:true});
                        res.status(200).json({isAuthenticated: true, user: {_id, username,email, role, userImageUrl},message:{msgError: false}})
                    }
                    else
                    {
                        const username = name;
                        const password = at_hash;
                        const role = "user";
                        const email = email;
                        const userImageUrl = picture;
                        
                        const newUser = new blogUser(
                        {
                            username, 
                            password,
                            role, 
                            emaill, 
                            userImageUrl
                            
                        });
                        newUser.save(err=>{
                            if(err)
                                res.status(500).json({message: {msgBody : "Error has occured at server after save:" + err, msgError: true}});
                            else
                            {
                                const {_id, username, role, userImageUrl, email} = newUser; 
                                const token = signDaToken(_id);
                                res.cookie('access_token', token, {httpOnly: true, sameSite:true});
                                res.status(200).json({isAuthenticated: true, user: {_id, username,email, role, userImageUrl}, message:{msgError: false}})
                            }                       
                         });
                    }
                }
            });


        }
    })
});

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
   const{_id, username, role, userImageUrl, email} = req.user;
   res.status(200).json({isAuthenticated: true, user : {_id, username, role, userImageUrl, email}})
});

router.get('/userList',(req, res) =>
{
    blogUser.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/singleUser/:id',(req, res) => {
    blogUser.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/updateUserPic/:id',  upload.single('newUserImage'), (req, res) =>
{
    blogUser.findById(req.params.id)
    .then(user => 
        {
            user.userImageUrl = req.file.filename,
            user.username = user.username,
            user.email = user.email,
            user.bio = user.bio
            user.role = user.role,
            user.password = user.password

            user.save()
            .then(() => res.json({message: {msgBody : "User Updated With New Pic Bro!", msgError: false}}))
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/updateUserBio/:id',   (req, res) =>
{
    blogUser.findById(req.params.id)
    .then(user => 
        {
            user.bio = req.body.bio
            user.userImageUrl = user.userImageUrl,
            user.username = user.username,
            user.email = user.email,
            user.role = user.role,
            user.password = user.password

            user.save()
            .then(() => res.json({message: {msgBody : "User Updated With New Bio Bro!", msgError: false}}))
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;