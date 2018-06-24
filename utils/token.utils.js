'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');

const { VALP_SECRET } = process.env;

const createToken = function(auth) {
  return jwt.sign({
    id: auth.id,
  }, VALP_SECRET,
  {
    expiresIn: 60 * 120,
  });
};

module.exports = {
  generateToken: function(req, res, next) {
    req.token = createToken(req.auth);
    return next();
  },
  sendToken: (req, res) => {
    return res.status(200).send(JSON.stringify({user: req.user, token: req.token}));
  },
};
