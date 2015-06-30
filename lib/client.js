/*jslint node: true*/
/*global require exports*/
"use strict";

var pg = require('pg');
var BedquiltCollection = require('./collection.js');
var project = require('./utils.js').project;

var MIN_SERVER_VERSION = '0.3.0';
var HAS_BOOTSTRAPPED = false;


function BedquiltClient(connectionString) {
  this.connectionString = connectionString;

  this.collection = function(collectionName) {
    return new BedquiltCollection(this, collectionName);
  };

  this._bootstrap = function(callback) {
    pg.connect(this.connectionString, function(err, client, _done) {
      if(err) {
        return callback(err, null);
      }
      var query = "select * from pg_catalog.pg_extension " +
                  "where extname='bedquilt';";
      client.query(query, [], function(err, result) {
        HAS_BOOTSTRAPPED = true;
        _done();
        if(err) {
          return callback(err, null);
        }
        if(result.rows.length !== 1) {
          return callback(new Error('Bedquilt extension missing'), null);
        }
        var version = result.rows[0].extversion;
        if(version !== 'HEAD' && version < MIN_SERVER_VERSION) {
          return callback(
            new Error('Bedquilt extension out of date (' + version + ')'),
            null
          );
        }
        return callback(null, true);
      });
      return null;
    });
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
  var client = new BedquiltClient(connectionString);
  if(!HAS_BOOTSTRAPPED) {
    client._bootstrap(function(err, result) {
      return callback(err, client);
    });
  } else {
    return callback(null, client);
  }
};

module.exports = BedquiltClient;
