/*jslint node: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

var should = require("should");
var testutils = require('./testutils.js');
var async = require('async');

describe('BedquiltCollection write ops', function() {

  describe('BedquiltCollection#remove()', function() {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should do nothing on empty collection', function(done) {
      testutils.connect(function(err, db) {
        var things = db.collection('things');
        things.remove({tag: 'aa'}, function(err, result) {
          should.equal(result, 0);
          done();
        });
      });
    });

    it('should remove documents from collection', function(done) {
      testutils.connect(function(err, db) {
        var things = db.collection('things');

        async.series([
          function(callback) {
            things.insert({tag: 'aa'}, callback);
          },
          function(callback) {
            things.insert({tag: 'bb'}, callback);
          },
          function(callback) {
            things.insert({tag: 'aa'}, callback);
          },
        ], function(err, results) {
          things.remove({tag: 'aa'}, function(err, result) {
            should.equal(result, 2);
            things.count({}, function(err, result) {
              should.equal(1, result);
              done();
            });
          });
        });
      });
    });


  });

  describe('BedquiltCollection#insert()', function() {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should return _id of document', function(done) {
      testutils.connect(function(err, db) {
        var things = db.collection('things');
        var doc = {
          _id: 'spanner',
          description: 'A small spanner'
        };
        things.insert(doc, function(err, result) {
          should.equal(null, err);
          should.equal('spanner', result);
          things.count({}, function(err, result) {
            should.equal(null, err);
            should.equal(1, result);
            done();
          });
        });
      });
    });
  });

  describe('BedquiltCollection#save()', function() {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should return _id of document', function(done) {
      testutils.connect(function(err, db) {
        var things = db.collection('things');
        var doc = {
          _id: 'spanner',
          description: 'A small spanner'
        };
        things.save(doc, function(err, result) {
          should.equal(null, err);
          should.equal('spanner', result);
          things.count({}, function(err, result) {
            should.equal(null, err);
            should.equal(1, result);
            done();
          });
        });
      });
    });

    it('should update document in place', function(done) {
      testutils.connect(function(err, db) {
        var things = db.collection('things');
        var doc = {
          _id: 'spanner',
          description: 'A small spanner'
        };
        things.save(doc, function(err, result) {
          var _id = result;
          things.findOneById(_id, function(err, result) {
            should.notEqual(result['tag'], 'aaa');
            result['tag'] = 'aaa';
            things.save(result, function(err, result) {
              should.equal(err, null);
              should.equal('spanner', result);
              things.findOneById(result, function(err, spanner) {
                should.equal(spanner['tag'], 'aaa');
                done();
              });
            });
          });
        });
      });
    });
  });

});
