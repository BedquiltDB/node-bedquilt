/*jslint node: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

var should = require("should");
var BedquiltClient = require('../index.js').BedquiltClient;
var testutils = require('./testutils.js');

var _cs = testutils.connectionString;

var _cleanup = function(done) {
  testutils.cleanDatabase(function(err, result) {
    if(err) {
      throw err;
    }
    done();
  });
};

describe('BedquiltClient', function() {

  describe('BedquiltClient#connect()', function() {
    beforeEach(_cleanup);
    afterEach(_cleanup);

    it('should connect', function(done) {
      BedquiltClient.connect(_cs, function(err, db) {
        should.equal(err, null);
        should.notEqual(db, null);
        should.equal(db.connectionString, _cs);
        done();
      });
    });

  });

  describe('BedquiltClient#query', function() {
    beforeEach(_cleanup);
    afterEach(_cleanup);

    it('should allow us to query', function(done) {
      BedquiltClient.connect(_cs, function(err, db) {
        db._query('select 1 as num', [], function(err, result) {
          should.equal(err, null);
          should.equal(result.rows[0]['num'], 1);
          done();
        });
      });
    });

  });

  describe('BedquiltClient#createCollection', function() {
    beforeEach(_cleanup);
    afterEach(_cleanup);

    it('should create a collection', function(done) {
      BedquiltClient.connect(_cs, function(err, db) {
        db.createCollection('stuff', function(err, created) {
          should.equal(err, null);
          should.equal(created, true);
          done();
        });
      });
    });
  });


  describe('BedquiltClient#deleteCollection', function() {
    beforeEach(_cleanup);
    afterEach(_cleanup);

    it('should not delete a collection which does not exist', function(done) {
      BedquiltClient.connect(_cs, function(err, db) {
        db.deleteCollection('stuff', function(err, deleted) {
          should.equal(err, null);
          should.equal(deleted, false);
          done();
        });
      });
    });

    it("should delete a collection", function(done) {
      BedquiltClient.connect(_cs, function(err, db) {
        db.createCollection('stuff', function(err, created) {
          db.deleteCollection('stuff', function(err, deleted) {
            should.equal(err, null);
            should.equal(deleted, true);
            db.deleteCollection('stuff', function(err, deleted) {
              should.equal(deleted, false);
              done();
            });
          });
        });
      });
    });
  });

  describe('BedquiltClien#listCollections', function() {
    beforeEach(_cleanup);
    afterEach(_cleanup);

    it('should return 0 when there are no collections', function(done) {
      // with no collections
      BedquiltClient.connect(_cs, function(err, db) {
        db.listCollections(function(err, result) {
          should.equal(err, null);
          should.equal(result.length, 0);
          done();
        });
      });
    });

    it('should return 1 when there is one collection', function(done) {
      BedquiltClient.connect(_cs, function(err, db) {
        db.listCollections(function(err, result) {
          should.equal(err, null);
          should.equal(result.length, 0);
          db.createCollection('things', function(err, created) {
            should.equal(err, null);
            should.equal(created, true);
            db.listCollections(function(err, collections) {
              should.equal(collections.length, 1);
              should.equal(collections[0], 'things');
              done();
            });
          });
        });
      });
    });

  });
});

describe('BedquiltCollection', function() {

  describe('BedquiltCollection#count()', function() {
    beforeEach(_cleanup);
    afterEach(_cleanup);

    it('should return zero on non-existant collection', function(done) {
      BedquiltClient.connect(_cs, function(err, db) {
        var things = db.collection('things');
        things.count({}, function(err, result) {
          should.equal(result, 0);
          done();
        });
      });
    });

  });
});
