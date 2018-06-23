'use strict';

require('./mongoose')();
require('dotenv').config();
const passport = require('passport');
const User = require('mongoose').model('User');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

const {GOOGLE_SECRET, GOOGLE_CLIENT } = process.env;

module.exports = () => {

  passport.use(new GoogleTokenStrategy({
    clientID: GOOGLE_CLIENT,
    clientSecret: GOOGLE_SECRET,
  },
  (accessToken, refreshToken, profile, done) => {
    User.upsertGoogleUser(accessToken, refreshToken, profile, (err, user) => {
      console.log(err);
      return done(err, user);
    });
  }));
};
