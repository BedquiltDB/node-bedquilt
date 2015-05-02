/* jslint node: true */
"use strict";

var should = require("should");
var bq = require('../index.js');
var testutils = require('./testutils.js');


describe('Basic test', function() {
  describe('#BedquiltClient()', function() {
    it('should initialise', function() {
      var client = new bq.BedquiltClient(testutils.connectionString);
      should.notEqual(client, null);
      should.equal(client.connectionString, testutils.connectionString);
    });
  });
});
