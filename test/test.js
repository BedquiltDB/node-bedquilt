/* jslint node: true */
"use strict";

var should = require("should");
var bq = require('../index.js');
var testutils = require('./testutils.js');


describe('Basic test', function() {

  describe('#BedquiltClient.connect()', function() {

    it('should connect', function() {
      bq.BedquiltClient.connect(testutils.connectionString, function(err, db) {
        should.equal(err, null);
        should.notEqual(db, null);
        should.equal(db.connectionString, testutils.connectionString);
      });
    });

    it('should allow us to query', function() {
      bq.BedquiltClient.connect(testutils.connectionString, function(err, db) {
        db._query('things', {}, function(err, result) {
          should.notEqual(result, null);
        });
      });
    });
  });

});
