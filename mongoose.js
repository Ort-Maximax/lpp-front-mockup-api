'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = () => {

  const db = mongoose.connect('mongodb://localhost:27017/valp-users');

  const UserSchema = new Schema({
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String, required: true,
      trim: true, unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    googleProvider: {
      type: {
        id: String,
        token: String,
      },
      select: false,
    },
  });

  UserSchema.set('toJSON', {getters: true, virtuals: true});

  UserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
    const That = this;
    console.log('Mongoose');
    return this.findOne({
      'googleProvider.id': profile.id,
    }, (err, user) => {
      console.log(err);
      // no user was found, lets create a new one
      if (!user) {
        const newUser = new That({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          googleProvider: {
            id: profile.id,
            token: accessToken,
          },
        });

        newUser.save((error, savedUser) => {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } else {
        console.log(cb(err, user));
        return cb(err, user);
      }
    });
  };

  mongoose.model('User', UserSchema);
  return db;
};
