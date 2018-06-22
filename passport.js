'use strict';

require('./mongoose')();
var passport = require('passport');
var User = require('mongoose').model('User');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
require('dotenv').config();

const {GOOGLE_SECRET, GOOGLE_CLIENT } = process.env;

module.exports = function() {

  passport.use(new GoogleTokenStrategy({
    clientID: GOOGLE_CLIENT,
    clientSecret: GOOGLE_SECRET,
  },
  function(accessToken, refreshToken, profile, done) {
    User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
      return done(err, user);
    });
  }));
};
