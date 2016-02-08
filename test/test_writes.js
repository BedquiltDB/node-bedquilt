/*jshint node: true*/
/*jshint esnext: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

let should = require("should");
let testutils = require('./testutils.js');
let Async = require('async');

describe('BedquiltCollection write ops', () => {

  describe('BedquiltCollection#remove()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should do nothing on empty collection', (done) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        things.remove({tag: 'aa'}, (err, result) => {
          should.equal(result, 0);
          done();
        });
      });
    });

    it('should remove documents from collection', (done) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        Async.series(
          [{tag: 'aa'},
           {tag: 'bb'},
           {tag: 'aa'}].map(
             (doc) =>
               (next) => things.insert(doc, next)
           ),
          (err, results) => {
            things.remove({tag: 'aa'}, (err, result) => {
              should.equal(result, 2);
              things.count({}, (err, result) => {
                should.equal(1, result);
                done();
              });
            });
          }
        );
      });
    });
  });

  describe('BedquiltCollection#removeOne()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should do nothing on empty collection', (done) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        things.removeOne({tag: 'aa'}, (err, result) => {
          should.equal(result, 0);
          done();
        });
      });
    });

    it('should remove documents from collection', (done) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        Async.series(
          [{tag: 'aa'},
           {tag: 'bb'},
           {tag: 'aa'}].map(
             (doc) =>
               (next) => things.insert(doc, next)
           ),
          (err, results) => {
            things.removeOne({tag: 'aa'}, (err, result) => {
              should.equal(result, 1);
              things.count({}, (err, result) => {
                should.equal(2, result);
                things.count({tag: 'aa'}, (err, result) => {
                  should.equal(1, result);
                  done();
                });
              });
            });
          }
        );
      });
    });
  });


  describe('BedquiltCollection#removeOneById()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should do nothing on empty collection', (done) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        things.removeOneById('one', (err, result) => {
          should.equal(result, 0);
          done();
        });
      });
    });

    it('should remove documents from collection', (done) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');

        Async.series(
          [{_id: 'one', tag: 'aa'},
           {_id: 'two', tag: 'bb'},
           {_id: 'three', tag: 'aa'}].map(
             (doc) =>
               (next) => things.insert(doc, next)
           ),
          (err, results) => {
            things.removeOneById('one', (err, result) => {
              should.equal(result, 1);
              things.count({}, (err, result) => {
                should.equal(2, result);
                things.count({tag: 'aa'}, (err, result) => {
                  should.equal(1, result);
                  done();
                });
              });
            });
          }
        );
      });
    });
  });

  describe('BedquiltCollection#insert()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should return _id of document', (done) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        let doc = {
          _id: 'spanner',
          description: 'A small spanner'
        };
        things.insert(doc, (err, result) => {
          should.equal(null, err);
          should.equal('spanner', result);
          things.count({}, (err, result) => {
            should.equal(null, err);
            should.equal(1, result);
            done();
          });
        });
      });
    });
  });

  describe('BedquiltCollection#save()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should return _id of document', (done) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        let doc = {
          _id: 'spanner',
          description: 'A small spanner'
        };
        things.save(doc, (err, result) => {
          should.equal(null, err);
          should.equal('spanner', result);
          things.count({}, (err, result) => {
            should.equal(null, err);
            should.equal(1, result);
            done();
          });
        });
      });
    });

    it('should update document in place', (done) => {
      testutils.connect((err, client) => {
        let things = client.collection('things');
        let doc = {
          _id: 'spanner',
          description: 'A small spanner'
        };
        things.save(doc, (err, result) => {
          let _id = result;
          things.findOneById(_id, (err, result) => {
            should.notEqual(result.tag, 'aaa');
            result.tag = 'aaa';
            things.save(result, (err, result) => {
              should.equal(err, null);
              should.equal('spanner', result);
              things.findOneById(result, function(err, spanner) {
                should.equal(spanner.tag, 'aaa');
                done();
              });
            });
          });
        });
      });
    });
  });

});
