/* jslint node: true */
"use strict";

var should = require("should");
var bq = require('../index.js');

var connectionString = 'postgres://localhost/bedquilt_test';

describe('Basic test', function() {
  describe('#BedquiltClient()', function() {
    it('should initialise', function() {
      var client = new bq.BedquiltClient(connectionString);
      should.notEqual(client, null);
      should.equal(client.connectionString, connectionString);
    });
  });
});
