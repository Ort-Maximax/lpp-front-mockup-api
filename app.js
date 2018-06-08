'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');
const bearerToken = require('express-bearer-token');
const app = express();
app.use(cors());
app.use(bearerToken());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


routes(app);

const server = app.listen(process.env.PORT || 3009, function() {
  console.log('app running on port.', server.address().port);
});
