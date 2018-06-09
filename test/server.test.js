var assert = require('assert');
var superagent = require('superagent');
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

  it('Test bidon', (done) => {
    done();
  });
});
