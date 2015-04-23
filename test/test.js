/* jslint node: true */
var assert = require("assert");
var bq = require('../index.js');

describe('Basic test', function() {
  describe('#BedquiltClient()', function() {
    it('should return 1', function() {
      var client = new bq.BedquiltClient("a");
      assert.notEqual(client, null);
    });
  });
});
