/*jshint node: true*/
/*jshint esnext: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

var should = require("should");
var testutils = require('./testutils.js');
var async = require('async');

describe('BedquiltCollection constraint ops', () => {

  describe('BedquiltCollection#addConstraints()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should add a simple constraint', (done) => {
      testutils.connect((err, client) => {
        var things = client.collection('things');
        var constraints = {
          name: {$required: 1,
                 $notnull: 1}
        };
        things.addConstraints(constraints, (err, result) => {
          should.equal(result, true);
          things.save({wat: 1}, (err, result) => {
            should.notEqual(err, null);
            should.equal(result, null);
            done();
          });
        });
      });
    });

    it('should work with a more complex constraint', (done) => {
      testutils.connect((err, client) => {
        var people = client.collection('people');
        var spec = {
          name: {
            $required: 1,
            $notnull: 1,
            $type: 'string'
          },
          age: {
            $required: 1,
            $type: 'number'
          },
          addresses: {
            $required: 1,
            $type: 'array'
          },
          'address.0.city': {
            $required: 1,
            $notnull: 1,
            $type: 'string'
          }
        };
        people.addConstraints(spec, (err, result) => {
          should.equal(result, true);
          done();
        });
      });
    });

  });

  describe('BedquiltCollection#listConstraints()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should list all constraints', (done) => {
      testutils.connect((err, client) => {
        var things = client.collection('things');
        var constraints = {
          name: {$required: 1,
                 $notnull: 1}
        };
        things.listConstraints((err, result) => {
          should.deepEqual(result, []);
          things.addConstraints(constraints, (err, result) => {
            should.equal(result, true);
            things.listConstraints((err, result) => {
              should.deepEqual(result, ['name:notnull', 'name:required']);
              done();
            });
          });
        });
      });
    });
  });

  describe('BedquiltCollection#removeConstraints()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should remove constraints', (done) => {
      testutils.connect((err, client) => {
        var things = client.collection('things');
        var constraints = {
          name: {$required: 1,
                 $notnull: 1}
        };
        things.addConstraints(constraints, (err, result) => {
          should.equal(result, true);
          things.save({wat: 1}, (err, result) => {
            should.notEqual(err, null);
            should.equal(result, null);
            things.removeConstraints(constraints, (err, result) => {
              should.equal(result, true);
              things.insert({wat: 1}, (err, result) => {
                should.equal(err, null);
                done();
              });
            });
          });
        });
      });
    });
  });

});
