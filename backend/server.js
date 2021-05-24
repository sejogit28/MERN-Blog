const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');  

require('dotenv').config();

const blogApp = express();
const blogPort = process.env.PORT || 5000;

blogApp.use(cors());
blogApp.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const blogPostRouter = require('./blogRoutes/blogPostRoute');
//const usersRouter = require('./blogRoutes/userRoute');

blogApp.use('/blogPost', blogPostRouter);
//blogApp.use('/userRoute', usersRouter);


blogApp.listen(blogPort, () => {
    console.log(`Mongo's Up on: ${blogPort}`);
});