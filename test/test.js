/* jslint node: true */
"use strict";

var should = require("should");
var BedquiltClient = require('../index.js').BedquiltClient;
var testutils = require('./testutils.js');

var _cs = testutils.connectionString;

describe('Basic test', function() {

  describe('#BedquiltClient.connect()', function() {

    beforeEach(function(done) {
      testutils.cleanDatabase(function(err, result) {
        if(err) {
          throw err;
        }
        done();
      });
    });

    it('should connect', function(done) {
      BedquiltClient.connect(_cs, function(err, db) {
        should.equal(err, null);
        should.notEqual(db, null);
        should.equal(db.connectionString, _cs);
        done();
      });
    });

    it('should allow us to query', function(done) {
      BedquiltClient.connect(_cs, function(err, db) {
        db._query('select 1 as num', [], function(err, result) {
          should.equal(err, null);
          should.equal(result.rows[0]['num'], 1);
          done();
        });
      });
    });

    it('should list collections', function(done) {
      // with no collections
      BedquiltClient.connect(_cs, function(err, db) {
        db.listCollections(function(err, result) {
          should.equal(err, null);
          should.equal(result.length, 0);
          done();
        });
      });
    });
  });

});
