/* jslint node: true */
"use strict";

var should = require("should");
var BedquiltClient = require('../index.js').BedquiltClient;
var testutils = require('./testutils.js');

var _cs = testutils.connectionString;

describe('Basic test', function() {

  describe('#BedquiltClient.connect()', function() {

    it('should connect', function() {
      BedquiltClient.connect(_cs, function(err, db) {
        should.equal(err, null);
        should.notEqual(db, null);
        should.equal(db.connectionString, _cs);
      });
    });

    it('should allow us to query', function() {
      BedquiltClient.connect(_cs, function(err, db) {
        db._query('select 1', [], function(err, result) {
          should.equal(err, null);
          should.equal(result, 1);
        });
      });
    });

    it('should list collections', function() {
      // with no collections
      BedquiltClient.connect(_cs, function(err, db) {
        db.listCollections(function(err, result) {
          should.equal(err, null);
          should.equal(result, 0);
        });
      });
    });
  });

});
