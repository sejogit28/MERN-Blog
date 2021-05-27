const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');  
let blogPosts = require('./blogModels/blogPostsModel');


require('dotenv').config();

const blogApp = express();
const blogPort = process.env.PORT || 5000;

const http = require('http').Server(blogApp);


blogApp.use(cors());
blogApp.use(express.json());
blogApp.use(cookieParser());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})


const io = require('socket.io')(http);
let users = [];
io.on('connection', socket => {
   console.log(socket.id + ' connected bro!')
    
    socket.on('joinRoom', id => {
        const user = {userId: socket.id, room: id}
        users.push(user)

        const check = users.every(user => user.userId !== socket.id);

        if(check){
            users.push(user)
            socket.join(user.room)
        }
        else{

            users.map(user => {
            if(user.userId === socket.id){
                if(user.room !== id){
                    socket.leave(user.room)
                    socket.join(id)
                    user.room = id
                }
            }
        })
        }
        
    })

    socket.on('createComment',  async msg => {
        const {commBody, postfinder, username, parentcommfinder, posterImageUrl} = msg;
        console.log(commBody, postfinder, username, parentcommfinder, posterImageUrl);
        const currPost = await blogPosts.findById(postfinder)
        if(currPost != null)
        {
             currPost.comments.push(
                {
                    commBody, postfinder, username, parentcommfinder, posterImageUrl
                })

                await currPost.save()
                console.log(postfinder)
                io.emit('sendCommentToClient', currPost)
        }
            
        

        //const newBlogComment = new Comment 
    })

    socket.on('disconnect', ()=>{
        console.log(socket.id + ' disconnected bro')
    })
})

const blogPostRouter = require('./blogRoutes/blogPostRoute');
const registerRouter = require('./blogRoutes/registerRoutes');


blogApp.use('/blogPost', blogPostRouter);
blogApp.use('/entryPoint', registerRouter);


http.listen(blogPort, () => {
    console.log(`Mongo's Up on: ${blogPort}`);
});

