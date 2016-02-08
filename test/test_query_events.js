/*jshint node: true*/
/*jshint esnext: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

let should = require("should");
let testutils = require('./testutils.js');
let Async = require('async');

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
