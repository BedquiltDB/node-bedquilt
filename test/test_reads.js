/*jshint node: true*/
/*jshint esnext: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

var should = require("should");
var testutils = require('./testutils.js');
var Async = require('async');


describe('BedquiltCollection find ops', () => {

  describe('BedquiltCollection#find() with skip, limit and sort', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    var populate = (callback) => {
      testutils.connect((err, client) => {
        var things = client.collection('things');
        Async.series([
          (callback) => {
            things.save({name: 'sarah', age: 22}, callback);
          },
          (callback) => {
            things.save({name: 'mike', age: 20}, callback);
          },
          (callback) => {
            things.save({name: 'irene', age: 40}, callback);
          },
          (callback) => {
            things.save({name: 'mary', age: 16}, callback);
          },
          (callback) => {
            things.save({name: 'brian', age: 31}, callback);
          },
          (callback) => {
            things.save({name: 'dave', age: 22}, callback);
          },
          (callback) => {
            things.save({name: 'kate', age: 25}, callback);
          },
          (callback) => {
            things.save({name: 'alice', age: 57}, callback);
          }
        ], (err, results) => { callback(); });
      });
    };
    var names = function(docs) {
      return docs.map((doc) => { return doc.name; });
    };
    var ages = function(docs) {
      return docs.map((doc) => { return doc.age; });
    };

    it('should skip two documents', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          var things = client.collection('things');
          things.find({}, {skip: 2}, (err, result) => {
            should.equal(result.length, 6);
            should.deepEqual(names(result), ['irene', 'mary', 'brian',
                                             'dave', 'kate', 'alice']);
            done();
          });
        });
      });
    });

    it('should skip two documents and limit to three', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          var things = client.collection('things');
          things.find({}, {skip: 2, limit: 3}, (err, result) => {
            should.equal(result.length, 3);
            should.deepEqual(names(result), ['irene', 'mary', 'brian']);
            done();
          });
        });
      });
    });

    it('should limit to four documents', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          var things = client.collection('things');
          things.find({}, {limit: 4}, (err, result) => {
            should.equal(result.length, 4);
            should.deepEqual(names(result), ['sarah', 'mike', 'irene', 'mary']);
            done();
          });
        });
      });
    });

    describe('with sort', () => {

      it('should order correctly ascending', (done) => {
        populate(() => {
          testutils.connect((err, client) => {
            var things = client.collection('things');
            things.find({}, {sort: [{'age': 1}]}, (err, result) => {
              should.equal(result.length, 8);
              var a = ages(result);
              var sorted = a.slice().sort();
              should.deepEqual(a, sorted);
              done();
            });
          });
        });
      });

      it('should order correctly ascending', (done) => {
        populate(() => {
          testutils.connect((err, client) => {
            var things = client.collection('things');
            things.find({}, {sort: [{'age': -1}]}, (err, result) => {
              should.equal(result.length, 8);
              var a = ages(result);
              var sorted = a.slice().sort().reverse();
              should.deepEqual(a, sorted);
              done();
            });
          });
        });
      });

      it('should order correctly ascending with skip and limit', (done) => {
        populate(() => {
          testutils.connect((err, client) => {
            var things = client.collection('things');
            var opts = {skip: 2, limit: 3, sort: [{age: 1}]};
            things.find({}, opts, (err, result) => {
              should.equal(result.length, 3);
              should.deepEqual(ages(result), [22, 22, 25]);
              should.deepEqual(names(result), ['sarah', 'dave', 'kate']);
              done();
            });
          });
        });
      });

      it('should order correctly descending with skip and limit', (done) => {
        populate(() => {
          testutils.connect((err, client) => {
            var things = client.collection('things');
            var opts = {skip: 2, limit: 3, sort: [{age: -1}]};
            things.find({}, opts, (err, result) => {
              should.equal(result.length, 3);
              should.deepEqual(ages(result), [31, 25, 22]);
              should.deepEqual(names(result), ['brian', 'kate', 'sarah']);
              done();
            });
          });
        });
      });

      // TODO: multisort
      it('should order by age and then by name', (done) => {
        populate(() => {
          testutils.connect((err, client) => {
            var things = client.collection('things');
            var opts = {limit: 5, sort: [{age: 1}, {name: 1}]};
            things.find({}, opts, (err, result) => {
              should.equal(result.length, 5);
              should.deepEqual(ages(result), [16, 20, 22, 22, 25]);
              should.deepEqual(
                names(result),
                ['mary',
                 'mike',
                 'dave',
                 'sarah',
                 'kate']);
              done();
            });
          });
        });
      });

      it('should order by age and then by name descending', (done) => {
        populate(() => {
          testutils.connect((err, client) => {
            var things = client.collection('things');
            var opts = {limit: 5, sort: [{age: 1}, {name: -1}]};
            things.find({}, opts, (err, result) => {
              should.equal(result.length, 5);
              should.deepEqual(ages(result), [16, 20, 22, 22, 25]);
              should.deepEqual(
                names(result),
                ['mary',
                 'mike',
                 'sarah',
                 'dave',
                 'kate']
              );
              done();
            });
          });
        });
      });

    });
  });

  describe('BedquiltCollection#count()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should return zero on non-existant collection', (done) => {
      testutils.connect((err, client) => {
        var things = client.collection('things');
        things.count({}, (err, result) => {
          should.equal(result, 0);
          done();
        });
      });
    });

    it('sould return count of documents in collection', (done) => {
      testutils.connect((err, client) => {
        var things = client.collection('things');
        Async.series(
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
            things.count({}, (err, result) => {
              should.equal(3, result);
              done();
            });
          }
        );
      });
    });
  });

  describe('BedquiltCollection#distinct()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should return empty list for non-existant collection', (done) => {
      testutils.connect((err, client) => {
        var things = client.collection('things');
        things.distinct('name', (err, result) => {
          should.deepEqual(result, []);
          done();
        });
      });
    });

    it('sould return distinct values', (done) => {
      testutils.connect((err, client) => {
        var things = client.collection('things');
        Async.series(
          [
            function(callback) {
              things.insert({name: 'aa'}, callback);
            },
            function(callback) {
              things.insert({name: 'bb'}, callback);
            },
            function(callback) {
              things.insert({name: 'aa'}, callback);
            }
          ],
          function(err, results) {
            things.distinct('name', (err, result) => {
              should.deepEqual(['aa', 'bb'], result.sort());
              done();
            });
          }
        );
      });
    });
  });

  describe('BedquiltCollection#find()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    describe('on non-existant collection', () => {
      it('should return empty list', (done) => {
        testutils.connect((err, client) => {
          var things = client.collection('things');
          things.find({}, (err, result) => {
            should.equal(0, result.length);
            done();
          });
        });
      });
    });

    describe('on empty collection', () => {
      it('should return empty list', (done) => {
        testutils.connect((err, client) => {
          var things = client.collection('things');
          things.find({}, (err, result) => {
            should.equal(0, result.length);
            done();
          });
        });
      });
    });

    describe('empty query doc', () => {
      beforeEach((done) => {
        testutils.cleanDatabase((err, result) => {
          if(err) {
            throw err;
          }
          testutils.connect((err, client) => {
            var things = client.collection('things');
            Async.series([
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

      it('should return a query object', (done) => {
        testutils.connect((err, client) => {
          var things = client.collection('things');
          var query = things.find({});
          var counter = 0;
          query.on('row', (row) => {
            counter++;
          });
          query.on('end', (result) => {
            should.equal(counter, 5);
            should.equal(result.length, 5);
            done();
          });
        });
      });

      it('should return entire collection', (done) => {
        testutils.connect((err, client) => {
          var things = client.collection('things');
          things.find({}, (err, result) => {
            should.equal(5, result.length);
            should.deepEqual({_id: 'one', tag: 'aa'}, result[0]);
            done();
          });
        });
      });

      it('should return one document when matching _id', (done) => {
        testutils.connect((err, client) => {
          var things =client.collection('things');
          things.find({_id: 'two'}, (err, result) => {
            should.equal(result.length, 1);
            should.deepEqual(result[0], {_id: 'two', tag: 'bb'});
            done();
          });
        });
      });

      it('should return two documents when they match', (done) => {
        testutils.connect((err, client) => {
          var things = client.collection('things');
          things.find({tag: 'aa'}, (err, result) => {
            should.equal(result.length, 2);
            should.deepEqual([
              {_id: 'one', tag: 'aa'},
              {_id: 'five', tag: 'aa'}
            ], result);
            done();
          });
        });
      });

      describe('with skip and limit', () => {
        it('should return the right docs', (done) => {
          testutils.connect((err, client) => {
            var things = client.collection('things');
            things.find({}, {skip: 1, limit: 2}, (err, result) => {
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
