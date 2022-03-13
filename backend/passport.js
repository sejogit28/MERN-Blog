const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("./blogModels/usersModel");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
    /*if the string passed in the line above doesn't match what you called the token in 
        other places. You'll be able to log in(on Postman) but not logout*/
  }
  return token;
};

// auhthorization
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: "SejoMernBlog",
    },
    (payload, done) => {
      User.findById({ _id: payload.sub }, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        else return done(null, false);
      });
    }
  )
);

// authenticated local strategy using username and password
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      //something went wrong with the database
      if (err) return done(err);
      //if no user exist
      if (!user) return done(null, false);
      //check if password is correct
      user.comparePassword(password, done);
    });
  })
);
