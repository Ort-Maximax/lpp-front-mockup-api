'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {DB_USER, DB_PASSWORD } = process.env;

module.exports = () => {

  const db = mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@ds261540.mlab.com:61540/valparaiso`);
  // const db = mongoose.connect('mongodb://localhost:27017/valp-users');

  const UserSchema = new Schema({
    firstName: {
      type: String, required: true,
      trim: true,
    },
    lastName: {
      type: String, required: true,
      trim: true,
    },
    email: {
      type: String, required: true,
      trim: true, unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    pricingPlan: {
      type: Number, required: true,
      trim: true,
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
    return this.findOne({
      'googleProvider.id': profile.id,
    }, (err, user) => {
      // no user was found, lets create a new one
      if (!user) {
        const newUser = new That({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          pricingPlan: 0,
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
        return cb(err, user);
      }
    });
  };

  mongoose.model('User', UserSchema);
  return db;
};
