/*jshint node: true*/
/*jshint esnext: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

let should = require("should");
let testutils = require('./testutils.js');
let Async = require('async');


describe('BedquiltCollection find ops', () => {

  describe('BedquiltCollection#findOne() with skip and sort', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    let populate = (callback) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        Async.series(
          [{name: 'sarah', age: 22},
           {name: 'mike', age: 20},
           {name: 'irene', age: 40},
           {name: 'mary', age: 16},
           {name: 'brian', age: 31},
           {name: 'dave', age: 22},
           {name: 'kate', age: 25},
           {name: 'alice', age: 57}].map(
             (doc) =>
               (next) => things.save(doc, next)
           ),
          (err, results) =>
            callback()
        );
      });
    };
    let names = function(docs) {
      return docs.map((doc) => { return doc.name; });
    };
    let ages = function(docs) {
      return docs.map((doc) => { return doc.age; });
    };

    it('should skip no documents', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.findOne({}, {sort: [{age: 1}]}, (err, result) => {
            should.equal(err, null);
            should.deepEqual(result.name, 'mary');
            done();
          });
        });
      });
    });

    it('should skip one document', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.findOne({}, {skip: 1, sort: [{age: 1}]}, (err, result) => {
            should.equal(err, null);
            should.deepEqual(result.name, 'mike');
            done();
          });
        });
      });
    });

    it('should skip one document, age descending', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.findOne({}, {skip: 1, sort: [{age: -1}]}, (err, result) => {
            should.equal(err, null);
            should.deepEqual(result.name, 'irene');
            done();
          });
        });
      });
    });

    it('should skip four documents', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.findOne({}, {skip: 4, sort: [{age: 1}]}, (err, result) => {
            should.equal(err, null);
            should.deepEqual(result.name, 'kate');
            done();
          });
        });
      });
    });

  });

  describe('BedquiltCollection#find() with skip, limit and sort', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    let populate = (callback) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        Async.series(
          [{name: 'sarah', age: 22},
           {name: 'mike', age: 20},
           {name: 'irene', age: 40},
           {name: 'mary', age: 16},
           {name: 'brian', age: 31},
           {name: 'dave', age: 22},
           {name: 'kate', age: 25},
           {name: 'alice', age: 57}].map(
             (doc) =>
               (next) => things.save(doc, next)
           ),
          (err, results) =>
            callback()
        );
      });
    };
    let names = function(docs) {
      return docs.map((doc) => { return doc.name; });
    };
    let ages = function(docs) {
      return docs.map((doc) => { return doc.age; });
    };

    it('should skip two documents', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.find({}, {skip: 2}, (err, result) => {
            should.equal(err, null);
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
          let things = client.collection('things');
          things.find({}, {skip: 2, limit: 3}, (err, result) => {
            should.equal(err, null);
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
          let things = client.collection('things');
          things.find({}, {limit: 4}, (err, result) => {
            should.equal(err, null);
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
            let things = client.collection('things');
            things.find({}, {sort: [{'age': 1}]}, (err, result) => {
              should.equal(err, null);
              should.equal(result.length, 8);
              let a = ages(result);
              let sorted = a.slice().sort();
              should.deepEqual(a, sorted);
              done();
            });
          });
        });
      });

      it('should order correctly ascending', (done) => {
        populate(() => {
          testutils.connect((err, client) => {
            let things = client.collection('things');
            things.find({}, {sort: [{'age': -1}]}, (err, result) => {
              should.equal(err, null);
              should.equal(result.length, 8);
              let a = ages(result);
              let sorted = a.slice().sort().reverse();
              should.deepEqual(a, sorted);
              done();
            });
          });
        });
      });

      it('should order correctly ascending with skip and limit', (done) => {
        populate(() => {
          testutils.connect((err, client) => {
            let things = client.collection('things');
            let opts = {skip: 2, limit: 3, sort: [{age: 1}]};
            things.find({}, opts, (err, result) => {
              should.equal(err, null);
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
            let things = client.collection('things');
            let opts = {skip: 2, limit: 3, sort: [{age: -1}]};
            things.find({}, opts, (err, result) => {
              should.equal(err, null);
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
            let things = client.collection('things');
            let opts = {limit: 5, sort: [{age: 1}, {name: 1}]};
            things.find({}, opts, (err, result) => {
              should.equal(err, null);
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
            let things = client.collection('things');
            let opts = {limit: 5, sort: [{age: 1}, {name: -1}]};
            things.find({}, opts, (err, result) => {
              should.equal(err, null);
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

  describe('BedquiltCollection#findOneById()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);
    let populate = (callback) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        Async.series(
          [{_id: 'sarah', age: 22},
           {_id: 'mike', age: 20},
           {_id: 'irene', age: 40}].map(
             (doc) =>
               (next) => things.save(doc, next)
           ),
          (err, results) => callback()
        );
      });
    };

    it('should return null when no match', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.findOneById('nope', (err, doc) => {
            should.equal(err, null);
            should.equal(doc, null);
            done();
          });
        });
      });
    });

    it('should return the right doc', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.findOneById('mike', (err, doc) => {
            should.equal(err, null);
            should.deepEqual(doc, {_id: 'mike', age: 20});
            done();
          });
        });
      });
    });
  });

  describe('BedquiltCollection#findOne()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);
    let populate = (callback) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        Async.series(
          [{_id: 'sarah', age: 22},
           {_id: "mike o'reilly", age: 20},
           {_id: 'irene', age: 40}].map(
             (doc) =>
               (next) => things.save(doc, next)
           ),
          (err, results) => callback()
        );
      });
    };

    it('should return null when no match', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.findOne({age: 99}, (err, doc) => {
            should.equal(err, null);
            should.equal(doc, null);
            done();
          });
        });
      });
    });

    it('should return the right doc', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.findOne({age: 20}, (err, doc) => {
            should.equal(err, null);
            should.deepEqual(doc, {_id: "mike o'reilly", age: 20});
            done();
          });
        });
      });
    });

    it('should be ok with quotes', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.findOne({_id: "mike o'reilly"}, (err, doc) => {
            should.equal(err, null);
            should.deepEqual(doc, {_id: "mike o'reilly", age: 20});
            done();
          });
        });
      });
    });
  });

  describe('BedquiltCollection#findManyByIds()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);
    let populate = (callback) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        Async.series(
          [{_id: 'sarah', age: 22},
           {_id: 'mike', age: 20},
           {_id: 'irene', age: 40},
           {_id: 'mary', age: 16},
           {_id: 'brian', age: 31},
           {_id: 'dave', age: 22},
           {_id: 'kate', age: 25},
           {_id: 'alice', age: 57}].map(
             (doc) =>
               (next) => things.save(doc, next)
           ),
          (err, results) =>
            callback()
        );
      });
    };

    it('should return empty results when no match', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.findManyByIds(['bad-one', 'bad-two'], (err, docs) => {
            should.equal(err, null);
            should.deepEqual(docs, []);
            done();
          });
        });
      });
    });

    it('should return the right docs', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          let ids = ['bad-one', 'kate', 'mary', 'alice'];
          things.findManyByIds(ids, (err, docs) => {
            should.equal(err, null);
            should.deepEqual(
              docs.map((doc) => doc._id),
              ['mary', 'kate', 'alice']
            );
            done();
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
        let things = client.collection('things');
        things.count({}, (err, result) => {
          should.equal(err, null);
          should.equal(result, 0);
          done();
        });
      });
    });

    it('sould return count of documents in collection', (done) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        Async.series(
          [{},
           {},
           {}
          ].map((doc) => (next) => things.save(doc, next)),
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
        let things = client.collection('things');
        things.distinct('name', (err, result) => {
          should.equal(err, null);
          should.deepEqual(result, []);
          done();
        });
      });
    });

    it('sould return distinct values', (done) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        Async.series(
          [
            {name: 'aa'},
            {name: 'bb'},
            {name: 'aa'}
          ].map((doc) => (next) => things.save(doc, next)),
          function(err, results) {
            things.distinct('name', (err, result) => {
              should.equal(err, null);
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
          let things = client.collection('things');
          things.find({}, (err, result) => {
            should.equal(err, null);
            should.equal(0, result.length);
            done();
          });
        });
      });
    });

    describe('on empty collection', () => {
      it('should return empty list', (done) => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.find({}, (err, result) => {
            should.equal(err, null);
            should.equal(0, result.length);
            done();
          });
        });
      });
    });

    describe('with docs', () => {
      beforeEach((done) => {
        testutils.cleanDatabase((err, result) => {
          if(err) {
            throw err;
          }
          testutils.connect((err, client) => {
            let things = client.collection('things');
            Async.series(
              [{_id: 'one', tag: 'aa'},
               {_id: 'two', tag: 'bb'},
               {_id: 'three', tag: 'cc'},
               {_id: 'four', tag: 'dd'},
               {_id: 'five', tag: 'aa'}].map(
                 (doc) =>
                   (next) => things.save(doc, next)
               ),
              (err, results) =>
                done()
            );
          });
        });
      });

      it('should return a query object', (done) => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          let query = things.find({});
          let counter = 0;
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
          let things = client.collection('things');
          things.find({}, (err, result) => {
            should.equal(err, null);
            should.equal(5, result.length);
            should.deepEqual({_id: 'one', tag: 'aa'}, result[0]);
            done();
          });
        });
      });

      it('should return one document when matching _id', (done) => {
        testutils.connect((err, client) => {
          let things =client.collection('things');
          things.find({_id: 'two'}, (err, result) => {
            should.equal(err, null);
            should.equal(result.length, 1);
            should.deepEqual(result[0], {_id: 'two', tag: 'bb'});
            done();
          });
        });
      });

      it('should return two documents when they match', (done) => {
        testutils.connect((err, client) => {
          let things = client.collection('things');
          things.find({tag: 'aa'}, (err, result) => {
            should.equal(err, null);
            should.equal(result.length, 2);
            should.deepEqual([
              {_id: 'one', tag: 'aa'},
              {_id: 'five', tag: 'aa'}
            ], result);
            done();
          });
        });
      });

      describe('with advanced queries', () => {
        it('should get the right docs', (done) => {
          testutils.connect((err, client) => {
            let things = client.collection('things');
            things.find({tag: {$eq: 'aa'}}, (err, result) => {
              should.equal(err, null);
              should.equal(result.length, 2);
              should.deepEqual([
                {_id: 'one', tag: 'aa'},
                {_id: 'five', tag: 'aa'}
              ], result);
              done();
            });
          });
        });
      });

      describe('with skip and limit', () => {
        it('should return the right docs', (done) => {
          testutils.connect((err, client) => {
            let things = client.collection('things');
            things.find({}, {skip: 1, limit: 2}, (err, result) => {
              should.equal(err, null);
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
