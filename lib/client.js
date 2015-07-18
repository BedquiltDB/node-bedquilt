/*jslint node: true*/
/*global require exports module */
"use strict";

var pg = require('pg');
var BedquiltCollection = require('./collection.js');
var project = require('./utils.js').project;

var cache = {};
var MINIMUM_SERVER_VERSION = '0.3.0';

function BedquiltClient(connectionString) {
  this.connectionString = connectionString;

  this.collection = function(collectionName) {
    return new BedquiltCollection(this, collectionName);
  };

  this._query = function(queryString, params, projection, callback) {
    pg.connect(this.connectionString, function(err, client, done) {
      if(err) {
        return callback(err, null);
      }
      client.query(queryString, params, function(err, result) {
        done();
        if(err) {
          return callback(err, null);
        }
        return callback(null, projection(result));
      });
      return null;
    });
  };

  this.listCollections = function(callback) {
    return this._query(
      'select bq_list_collections();',
      [],
      project.column('bq_list_collections'),
      callback
    );
  };

  this.createCollection = function(collectionName, callback) {
    return this._query(
      'select bq_create_collection($1::text);',
      [collectionName],
      project.single('bq_create_collection'),
      callback
    );
  };

  this.deleteCollection = function(collectionName, callback) {
    return this._query(
      'select bq_delete_collection($1::text);',
      [collectionName],
      project.single('bq_delete_collection'),
      callback
    );
  };
}

BedquiltClient.connect = function(connectionString, callback) {
  var previous = cache[connectionString];
  var client = null;
  if (previous) {
    client = previous.client;
    if (previous.error) {
      throw previous.error;
    }
    return callback(null, client);
  } else {
    client = new BedquiltClient(connectionString);
    cache[connectionString] = {client: client, error: null};
    pg.connect(connectionString, function(err, db, done) {
      var q = "select bq_assert_minimum_version($1::text)";
      if (err) {
        return callback(err, null);
      }
      db.query(q, [MINIMUM_SERVER_VERSION], function(err, result) {
        done();
        if (err) {
          cache[connectionString].error = err;
          throw err;
        } else {
          client.good = true;
          return callback(null, client);
        }
      });
      return null;
    });
  }
  return null;
};

module.exports = BedquiltClient;
