/* jslint node: true */
"use strict";

var should = require("should");
var bq = require('../index.js');

describe('Basic test', function() {
  describe('#BedquiltClient()', function() {
    it('should initialise', function() {
      var client = new bq.BedquiltClient("a");
      should.notEqual(client, null);
      should.notEqual(client.connection, undefined);
    });
  });
});
