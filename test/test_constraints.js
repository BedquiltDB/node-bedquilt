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
          done();
        });
      });
    });
  });

});
