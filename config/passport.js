const passport = require('passport');
const user = require('../models/users/user.js');
LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github').Strategy;

const gitConfig = require("./database").gitConfig
const request = require('request')
const jwt = require('jsonwebtoken');

const config = require('./database.js')

passport.serializeUser(function (currentUser, done) {

  // console.log(currentUser);

  const token = jwt.sign({
    data: currentUser.userId,
    act_id: currentUser._id
  }, config.jwttoken.passkey, { expiresIn: "7d"});

  done(null, token);


});

passport.deserializeUser(async (token_data, done) => {


  //console.log("deserialzng..........");
  //console.log(id);
  try {

    // console.log("token_daata" +token_data);
    const decoded = await jwt.verify(token_data, config.jwttoken.passkey);

    const User = await user.findOne({ _id: decoded.act_id });

    done(null, User);

  }

  catch (err) {

    done(null,null);

  }


  // done(null,user);
});



passport.use(new GitHubStrategy({
  clientID: gitConfig.clientID,
  clientSecret: gitConfig.clientSecret,
  scope: ['user:email']
},
  async (accessToken, refreshToken, profile, cb) => {
    const id = profile.id;
    const username = profile.username
    const profileUrl = profile.profileUrl
    const email = profile.emails[0].value;
    const currentUser = await user.findOne({ userId: id });
    const access_token = accessToken;
    const avtarUrl = profile._json.avatar_url;
    if (!currentUser) {
      const newUser = new user({
        avtarUrl: avtarUrl,
        username: username,
        userId: id,
        email: email,
        gitUrl: profileUrl,
        access_token: access_token

      })
      const createdUser = await newUser.save();
      cb(null, createdUser);
    }

    else {

      cb(null, currentUser);
    }

  }

));


