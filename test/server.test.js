var assert = require('assert');
var request = require('request');
var status = require('http-status');
var server = require('../server');

describe('/getData', function() {
  var app;

  before(function() {
    app = server;
  });

  after(function() {
    app.close();
  });

  it('Should reject request without jwt', (done) => {
    request.get('http://localhost:3009/getData', function (err, res, body){
      assert.equal(res.statusCode, 400)
      done();
    });
  });
});
