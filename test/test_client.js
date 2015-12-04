/*jshint node: true*/
/*jshint esnext: true*/
/*global require, describe, it, before, beforeEach, after, afterEach */
"use strict";

var should = require("should");
var BedquiltClient = require('../index.js').BedquiltClient;
var testutils = require('./testutils.js');
var Async = require('async');

describe('BedquiltClient', () => {

  describe('BedquiltClient#connect()', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should connect', (done) => {
      BedquiltClient.connect(
        testutils.connectionString,
        (err, client) => {
          should.equal(err, null);
          should.notEqual(client, null);
          should.equal(client.connectionString, testutils.connectionString);
          done();
        });
    });

  });

  describe('BedquiltClient#query', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should allow us to query', (done) => {
      testutils.connect((err, client) => {
        client._query('select 1 as num', [],
                  (r) => { return r; },
                  (err, result) => {
          should.equal(err, null);
          should.equal(result.rows[0]['num'], 1);
          done();
        });
      });
    });

  });

  describe('BedquiltClient#createCollection', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should create a collection', (done) => {
      testutils.connect((err, client) => {
        client.createCollection('stuff', (err, created) => {
          should.equal(err, null);
          should.equal(created, true);
          done();
        });
      });
    });
  });


  describe('BedquiltClient#deleteCollection', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should not delete a collection which does not exist', (done) => {
      testutils.connect((err, client) => {
        client.deleteCollection('stuff', (err, deleted) => {
          should.equal(err, null);
          should.equal(deleted, false);
          done();
        });
      });
    });

    it("should delete a collection", (done) => {
      testutils.connect((err, client) => {
        client.createCollection('stuff', (err, created) => {
          client.deleteCollection('stuff', (err, deleted) => {
            should.equal(err, null);
            should.equal(deleted, true);
            client.deleteCollection('stuff', (err, deleted) => {
              should.equal(deleted, false);
              done();
            });
          });
        });
      });
    });
  });

  describe('BedquiltClient#collectionExists', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should return false when the collection does not exist', (done) => {
      testutils.connect((err, client) => {
        client.collectionExists('stuff', (err, result) => {
          should.equal(err, null);
          should.equal(result, false);
          done();
        });
      });
    });

    it('should return true when the collection exists', (done) => {
      testutils.connect((err, client) => {
        client.createCollection('stuff', (err, result) => {
          client.collectionExists('stuff', (err, result) => {
            should.equal(err, null);
            should.equal(result, true);
            done();
          });
        });
      });
    });
  });

  describe('BedquiltClien#listCollections', () => {
    beforeEach(testutils.cleanDatabase);
    afterEach(testutils.cleanDatabase);

    it('should return 0 when there are no collections', (done) => {
      // with no collections
      testutils.connect((err, client) => {
        client.listCollections((err, result) => {
          should.equal(err, null);
          should.equal(result.length, 0);
          done();
        });
      });
    });

    it('should return 1 when there is one collection', (done) => {
      testutils.connect((err, client) => {
        client.listCollections((err, result) => {
          should.equal(err, null);
          should.equal(result.length, 0);
          client.createCollection('things', (err, created) => {
            should.equal(err, null);
            should.equal(created, true);
            client.listCollections((err, collections) => {
              should.equal(collections.length, 1);
              should.equal(collections[0], 'things');
              done();
            });
          });
        });
      });
    });

  });
});
