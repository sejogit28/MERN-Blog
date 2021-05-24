const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    },
    password:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 8
    },
    userImageUrl:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    },
    role: {type: String, required: true, trim:true},
    email:{type:String, required: true, unique, trim:true, minlength: 5},
    bio: String},
    {
        timestamps: true,
    })


const User = mongoose.model('User', userSchema);

module.exports = User;