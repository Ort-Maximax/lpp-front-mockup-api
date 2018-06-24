require('dotenv').config();
const assert = require('assert');
const request = require('request');
const server = require('../server');
const btoa = require('btoa');
const {
  ISSUER,
  TEST_CLIENT_ID,
  TEST_CLIENT_SECRET,
  DEFAULT_SCOPE } = process.env;

describe('/getData', function() {
  var app;

  before(function() {
    app = server;
  });

  after(function() {
    app.close();
  });

  it('Should reject request without jwt', (done) => {
    request.get('http://localhost:3009/getData', function(err, res, body){
      assert.equal(res.statusCode, 401);
      done();
    });
  });

  /*
  it('Should return data when passed a valid jwt', (done) => {
    done();
  });
  */

  // Should register new user in database
});
