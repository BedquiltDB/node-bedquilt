/*jslint node: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

var should = require("should");
var testutils = require('./testutils.js');
var async = require('async');

describe('BedquiltCollection find ops', function() {

  describe('BedquiltCollection#count()', function() {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should return zero on non-existant collection', function(done) {
      testutils.connect(function(err, client) {
        var things = client.collection('things');
        things.count({}, function(err, result) {
          should.equal(result, 0);
          done();
        });
      });
    });

    it('sould return count of documents in collection', function(done) {
      testutils.connect(function(err, client) {
        var things = client.collection('things');
        async.series(
          [
            function(callback) {
              things.insert({}, callback);
            },
            function(callback) {
              things.insert({}, callback);
            },
            function(callback) {
              things.insert({}, callback);
            }
          ],
          function(err, results) {
            things.count({}, function(err, result) {
              should.equal(3, result);
              done();
            });
          }
        );
      });
    });
  });

  describe('BedquiltCollection#find()', function() {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    describe('on non-existant collection', function() {
      it('should return empty list', function(done) {
        testutils.connect(function(err, client) {
          var things = client.collection('things');
          things.find({}, function(err, result) {
            should.equal(0, result.length);
            done();
          });
        });
      });
    });

    describe('on empty collection', function() {
      it('should return empty list', function(done) {
        testutils.connect(function(err, client) {
          var things = client.collection('things');
          things.find({}, function(err, result) {
            should.equal(0, result.length);
            done();
          });
        });
      });
    });

    describe('empty query doc', function() {
      beforeEach(function(done) {
        testutils.cleanDatabase(function(err, result) {
          if(err) {
            throw err;
          }
          testutils.connect(function(err, client) {
            var things = client.collection('things');
            async.series([
                function(callback) {
                things.save({_id: 'one', tag: 'aa'}, callback);
                },
                function(callback) {
                things.save({_id: 'two', tag: 'bb'}, callback);
                },
                function(callback) {
                things.save({_id: 'three', tag: 'cc'}, callback);
                },
                function(callback) {
                things.save({_id: 'four', tag: 'dd'}, callback);
                },
                function(callback) {
                things.save({_id: 'five', tag: 'aa'}, callback);
                }
            ], function(err, results) { done(); });
          });
        });
      });

      it('should return entire collection', function(done) {
        testutils.connect(function(err, client) {
          var things = client.collection('things');
          things.find({}, function(err, result) {
            should.equal(5, result.length);
            should.deepEqual({_id: 'one', tag: 'aa'}, result[0]);
            done();
          });
        });
      });

      it('should return one document when matching _id', function(done) {
        testutils.connect(function(err, client) {
          var things =client.collection('things');
          things.find({_id: 'two'}, function(err, result) {
            should.equal(result.length, 1);
            should.deepEqual(result[0], {_id: 'two', tag: 'bb'});
            done();
          });
        });
      });

      it('should return two documents when they match', function(done) {
        testutils.connect(function(err, client) {
          var things = client.collection('things');
          things.find({tag: 'aa'}, function(err, result) {
            should.equal(result.length, 2);
            should.deepEqual([
              {_id: 'one', tag: 'aa'},
              {_id: 'five', tag: 'aa'}
            ], result);
            done();
          });
        });
      });

      describe('with skip and limit', function() {
        it('should return the right docs', function(done) {
          testutils.connect(function(err, client) {
            var things = client.collection('things');
            things.find({}, {skip: 1, limit: 2}, function(err, result) {
              should.equal(result.length, 2);
              should.deepEqual(
                result,
                [{_id: 'two', tag: 'bb'},
                 {_id: 'three', tag: 'cc'}]
              );
              done();
            });
          });
        });
      });

    });
  });

});
