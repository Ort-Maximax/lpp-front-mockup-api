'use strict';

const jwt = require('jsonwebtoken');
const { VALP_SECRET } = process.env;

module.exports = {
  authRequired: (req, res, next) => {
    if (req.token) {
      jwt.verify(req.token, VALP_SECRET, (err, decoded) => {
        if (err) {
          console.log(err);
          return res.status(401).send('None shall pass');
        }
        req.clientId = decoded.id;
      });
      next();
    } else {
      return res.status(401).send('None shall pass');
    }
  },
};
