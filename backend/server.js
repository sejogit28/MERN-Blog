const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');  
let blogPosts = require('./blogModels/blogPostsModel');


require('dotenv').config();

const blogApp = express();
const blogPort = process.env.PORT || 5000;

const http = require('http').Server(blogApp);
const io = require('socket.io')(http);

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



let users = [];
io.on('connection', socket => {
   console.log(socket.id + ' connected bro!')
    
    socket.on('joinRoom', async id => {
        const user = {userId: socket.id, room: id};
        console.log("newUser: "+ user.room);
        

        const check = users.every(user => user.userId !== socket.id);

        if(check){
            users.push(user)
            await socket.join(user.room)
        }
        else{

            users.map(async user => {
            if(user.userId === socket.id){
                if(user.room !== id){
                    await socket.leave(user.room);
                    await socket.join(id);
                    user.room = id;
                }
            }
        })
        }
        
    })

   
        
            console.log(users)

        
    //console.log(socket.adapter.rooms)

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
                await io.to(postfinder).emit('sendCommentToClient', currPost)
        
            
        

    
        }
    })
    socket.on('disconnect', ()=>{
        console.log(socket.id + ' disconnected bro')
        users.forEach(user =>
        
            console.log("user : " + user.room)

        );
        
        console.log(socket.adapter.rooms)
    })
})

const blogPostRouter = require('./blogRoutes/blogPostRoute');
const registerRouter = require('./blogRoutes/registerRoutes');


blogApp.use('/blogPost', blogPostRouter);
blogApp.use('/entryPoint', registerRouter);


http.listen(blogPort, () => {
    console.log(`Express is up on: ${blogPort}`);
});

