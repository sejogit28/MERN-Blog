const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2
    },
    password:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 7,
        maxlength: 20
    },
    userImageUrl:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        default: "placeHolder.jpg"
    },
    role: {type: String, required: true, trim:true},
    email:{type:String, required: true, unique:true, trim:true, minlength: 5},
    bio: String},
    {
        timestamps: true,
    })


userSchema.pre('save', function(next){
    if(! this.isModified('password'))
        return next();
    bcrypt.hash(this.password,10, (err, passwordHash) =>{
        if(err)
            return next(err);
        this.password = passwordHash;
        next();
    });
});

userSchema.methods.comparePassword = function(password,cb){
    bcrypt.compare(password, this.password, (err,isMatch)=>{
        if(err)
            return cb(err);
        else{
            if(!isMatch)
                return cb(null, isMatch);
            return cb(null,this);
        }
    })
}

/*The first parameter is going to be(or already is) the name of the table in your 
mongoDb cluster. It is not case sensitive*/
const blogUser = mongoose.model('blogUser', userSchema);

module.exports = blogUser;