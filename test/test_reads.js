/*jslint node: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

var should = require("should");
var testutils = require('./testutils.js');
var async = require('async');


describe('BedquiltCollection find ops', function() {

  describe('BedquiltCollection#find() with skip, limit and sort', function() {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    var populate = function(callback) {
      testutils.connect(function(err, client) {
        var things = client.collection('things');
        async.series([
          function(callback) {
            things.save({_id: 'sarah', age: 22}, callback);
          },
          function(callback) {
            things.save({_id: 'mike', age: 20}, callback);
          },
          function(callback) {
            things.save({_id: 'irene', age: 40}, callback);
          },
          function(callback) {
            things.save({_id: 'mary', age: 16}, callback);
          },
          function(callback) {
            things.save({_id: 'brian', age: 31}, callback);
          },
          function(callback) {
            things.save({_id: 'dave', age: 22}, callback);
          },
          function(callback) {
            things.save({_id: 'kate', age: 25}, callback);
          },
          function(callback) {
            things.save({_id: 'alice', age: 57}, callback);
          }
        ], function(err, results) { callback(); });
      });
    };
    var names = function(docs) {
      return docs.map(function(doc) { return doc['_id']; });
    };
    var ages = function(docs) {
      return docs.map(function(doc) { return doc['age']; });
    };

    it('should skip two documents', function(done) {
      populate(function() {
        testutils.connect(function(err, client) {
          var things = client.collection('things');
          things.find({}, {skip: 2}, function(err, result) {
            should.equal(result.length, 6);
            should.deepEqual(names(result), ['irene', 'mary', 'brian',
                                             'dave', 'kate', 'alice']);
            done();
          });
        });
      });
    });

    it('should skip two documents and limit to three', function(done) {
      populate(function() {
        testutils.connect(function(err, client) {
          var things = client.collection('things');
          things.find({}, {skip: 2, limit: 3}, function(err, result) {
            should.equal(result.length, 3);
            should.deepEqual(names(result), ['irene', 'mary', 'brian']);
            done();
          });
        });
      });
    });

    it('should limit to four documents', function(done) {
      populate(function() {
        testutils.connect(function(err, client) {
          var things = client.collection('things');
          things.find({}, {limit: 4}, function(err, result) {
            should.equal(result.length, 4);
            should.deepEqual(names(result), ['sarah', 'mike', 'irene', 'mary']);
            done();
          });
        });
      });
    });

    describe('with sort', function() {

      it('should order correctly ascending', function(done) {
        populate(function() {
          testutils.connect(function(err, client) {
            var things = client.collection('things');
            things.find({}, {sort: {'age': 1}}, function(err, result) {
              should.equal(result.length, 8);
              var a = ages(result);
              var sorted = a.slice().sort();
              should.deepEqual(a, sorted);
              done();
            });
          });
        });
      });

      it('should order correctly ascending', function(done) {
        populate(function() {
          testutils.connect(function(err, client) {
            var things = client.collection('things');
            things.find({}, {sort: {'age': -1}}, function(err, result) {
              should.equal(result.length, 8);
              var a = ages(result);
              var sorted = a.slice().sort().reverse();
              should.deepEqual(a, sorted);
              done();
            });
          });
        });
      });

      it('should order correctly ascending with skip and limit', function(done) {
        populate(function() {
          testutils.connect(function(err, client) {
            var things = client.collection('things');
            var opts = {skip: 2, limit: 3, sort: {age: 1}};
            things.find({}, opts, function(err, result) {
              should.equal(result.length, 3);
              should.deepEqual(ages(result), [22, 22, 25]);
              should.deepEqual(names(result), ['sarah', 'dave', 'kate']);
              done();
            });
          });
        });
      });

      it('should order correctly descending with skip and limit', function(done) {
        populate(function() {
          testutils.connect(function(err, client) {
            var things = client.collection('things');
            var opts = {skip: 2, limit: 3, sort: {age: -1}};
            things.find({}, opts, function(err, result) {
              should.equal(result.length, 3);
              should.deepEqual(ages(result), [31, 25, 22]);
              should.deepEqual(names(result), ['brian', 'kate', 'sarah']);
              done();
            });
          });
        });
      });
    });
  });

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
