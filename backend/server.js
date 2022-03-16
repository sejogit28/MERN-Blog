const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
let blogPosts = require("./blogModels/blogPostsModel");
//var passport = require()
const localClientUrl = "http://localhost:3000";
const remoteClientUrl = "https://mern-blog-backend28.herokuapp.com";

require("dotenv").config();

const blogApp = express();
blogApp.set("trust proxy", 1);
const blogPort = process.env.PORT || 5000;

blogApp.use(
  cors({
    credentials: true,
    origin: remoteClientUrl,
  })
);

blogApp.use(express.json());
//blogApp.enable('trust proxy');
blogApp.use(cookieParser());

//const http = require('http').Server(blogApp);
const http = require("http").createServer(blogApp);
const io = require("socket.io")(http, {
  cors: {
    credentials: true,
    origin: remoteClientUrl,
  },
});

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

let users = [];
io.on("connection", (socket) => {
  console.log(socket.id + " connected bro!");

  socket.on("joinRoom", async (id) => {
    const user = { userId: socket.id, room: id };
    console.log("newUser: " + user.room);

    const check = users.every((user) => user.userId !== socket.id);

    if (check) {
      users.push(user);
      await socket.join(user.room);
    } else {
      users.map(async (user) => {
        if (user.userId === socket.id) {
          if (user.room !== id) {
            await socket.leave(user.room);
            await socket.join(id);
            user.room = id;
          }
        }
      });
    }
  });

  socket.on("createComment", async (msg) => {
    const { commBody, postfinder, username, parentcommfinder, posterImageUrl } =
      msg;
    const currPost = await blogPosts.findById(postfinder);
    if (currPost != null) {
      currPost.comments.push({
        commBody,
        postfinder,
        username,
        parentcommfinder,
        posterImageUrl,
      });

      await currPost.save();
      await io.to(postfinder).emit("sendCommentToClient", currPost);
    }
  });
  socket.on("disconnect", () => {
    users.forEach((user) => console.log("user : " + user.room));
  });
});

const blogPostRouter = require("./blogRoutes/blogPostRoute");
const registerRouter = require("./blogRoutes/registerRoutes");

blogApp.use("/blogPost", blogPostRouter);
blogApp.use("/entryPoint", registerRouter);

http.listen(blogPort, () => {
  console.log(`Express is up on: ${blogPort}`);
});
