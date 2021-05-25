const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');  

require('dotenv').config();

const blogApp = express();
const blogPort = process.env.PORT || 5000;

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

const blogPostRouter = require('./blogRoutes/blogPostRoute');
const registerRouter = require('./blogRoutes/registerRoutes');

blogApp.use('/blogPost', blogPostRouter);
blogApp.use('/entryPoint', registerRouter);


blogApp.listen(blogPort, () => {
    console.log(`Mongo's Up on: ${blogPort}`);
});

