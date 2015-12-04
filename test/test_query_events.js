/*jshint node: true*/
/*jshint esnext: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

var should = require("should");
var testutils = require('./testutils.js');
var Async = require('async');

let populate = (callback) => {
  testutils.connect((err, client) => {
  var things = client.collection('things');
  Async.series([
    (cb) => {
      things.save({name: 'sarah', age: 22}, cb);
    },
    (cb) => {
      things.save({name: 'mike', age: 20}, cb);
    },
    (cb) => {
      things.save({name: 'irene', age: 40}, cb);
    },
    (cb) => {
      things.save({name: 'mary', age: 16}, cb);
    },
    (cb) => {
      things.save({name: 'brian', age: 31}, cb);
    },
    (cb) => {
      things.save({name: 'dave', age: 22}, cb);
    },
    (cb) => {
      things.save({name: 'kate', age: 25}, cb);
    },
    (cb) => {
      things.save({name: 'alice', age: 57}, cb);
    }
    ], (err, results) => { callback(); });
  });
};

describe('BedquiltQuery events', () => {

  describe('#find() without callback', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should skip two documents', (done) => {
      populate(() => {
        testutils.connect((err, client) => {
          let names = [];
          let things = client.collection('things');
          let query = things.find({}, (err, result) => {});

          query.on('row', (row) => {
            names.push(row.name);
          });

          query.on('end', (result) => {
            should.deepEqual(names, [
              'sarah',
              'mike',
              'irene',
              'mary',
              'brian',
              'dave',
              'kate',
              'alice'
            ]);
            done();
          });
        });
      });
    });
  });
});
