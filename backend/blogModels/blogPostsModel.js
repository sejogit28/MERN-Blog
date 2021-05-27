const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commSchema = new Schema({
    username:{type: String, required:true, minlength: 2},
    postfinder: {type: String, required:true, trim: true},
    commBody:{type: String, required:true, trim: true},
    parentcommfinder: {type: String, trim: true},
    posterImageUrl: {type: String, trim: true}
},  {
        timestamps: true,
    })

const blogPostSchema = new Schema({
    title:{type: String, required: true, trim: true, minlength: 3},
    author:{type: String, required: true, trim: true},
    summary:{type: String, required: true, trim: true, minlength: 15},
    body:{type: String, required: true, minlength: 50},
    imageUrl:{type: String, required: true, default: "placeHolder.jpg"},
    readTime:{type:Number, required:true},
    tags: {type: Array},
        enum: ['Exercise', 'Sleep', 'Nutrition', 'Memory', 'Emotion', 
                'Neuroplasticity', 'Learning'],
    comments: [commSchema]
},
     {
        timestamps: true,
    })

const blogPosts = mongoose.model('blogPosts', blogPostSchema);
//const blogComms = mongoose.model('blogComms', commSchema);
module.exports = blogPosts;