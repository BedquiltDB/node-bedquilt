/*jslint node: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

var should = require("should");
var testutils = require('./testutils.js');
var async = require('async');

describe('BedquiltCollection constraint ops', function() {

  describe('BedquiltCollection#addConstraints()', function() {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should add a simple constraint', function(done) {
      testutils.connect(function(err, client) {
        var things = client.collection('things');
        var constraints = {
          name: {$required: 1,
                 $notnull: 1}
        };
        things.addConstraints(constraints, function(err, result) {
          should.equal(result, true);
          things.save({wat: 1}, function(err, result) {
            should.notEqual(err, null);
            should.equal(result, null);
            done();
          });
        });
      });
    });
  });

  describe('BedquiltCollection#listConstraints()', function() {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should list all constraints', function(done) {
      testutils.connect(function(err, client) {
        var things = client.collection('things');
        var constraints = {
          name: {$required: 1,
                 $notnull: 1}
        };
        things.listConstraints(function(err, result) {
          should.deepEqual(result, []);
          things.addConstraints(constraints, function(err, result) {
            should.equal(result, true);
            things.listConstraints(function(err, result) {
              should.deepEqual(result, ['name:required', 'name:notnull']);
              done();
            });
          });
        });
      });
    });
  });

  describe('BedquiltCollection#removeConstraints()', function() {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should remove constraints', function(done) {
      testutils.connect(function(err, client) {
        var things = client.collection('things');
        var constraints = {
          name: {$required: 1,
                 $notnull: 1}
        };
        things.addConstraints(constraints, function(err, result) {
          should.equal(result, true);
          things.save({wat: 1}, function(err, result) {
            should.notEqual(err, null);
            should.equal(result, null);
            things.removeConstraints(constraints, function(err, result) {
              should.equal(result, true);
              things.insert({wat: 1}, function(err, result) {
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
