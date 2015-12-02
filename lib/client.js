/*jshint node: true*/
/*jshint esnext: true*/
/*global require exports module */
"use strict";

const pg = require('pg');
const BedquiltCollection = require('./collection.js');
const project = require('./utils.js').project;
const util = require('util');
const EventEmitter = require('events');

const cache = {};
const MINIMUM_SERVER_VERSION = '0.5.0';

function BedquiltClient(connectionString) {
  this.connectionString = connectionString;

  this.collection = (collectionName) => {
    return new BedquiltCollection(this, collectionName);
  };

  this._query = (queryString, params, projection, callback) => {
    var bqQuery = new BedquiltQuery();
    pg.connect(this.connectionString, (err, client, done) => {
      if(err) {
        return callback(err, null);
      }
      bqQuery.init(
        client.query(queryString, params, (err, result) => {
          done();
          if(err) {
            return callback(err, null);
          }
          if (callback) {
            return callback(null, projection(result));
          } else {
            return null;
          }
        }
      ));
      return null;
    });
    return bqQuery;
  };

  this.listCollections = (callback) => {
    return this._query(
      'select bq_list_collections();',
      [],
      project.column('bq_list_collections'),
      callback
    );
  };

  this.createCollection = (collectionName, callback) => {
    return this._query(
      'select bq_create_collection($1::text);',
      [collectionName],
      project.single('bq_create_collection'),
      callback
    );
  };

  this.deleteCollection = (collectionName, callback) => {
    return this._query(
      'select bq_delete_collection($1::text);',
      [collectionName],
      project.single('bq_delete_collection'),
      callback
    );
  };

  this.collectionExists = (collectionName, callback) => {
    return this._query(
      'select bq_collection_exists($1::text);',
      [collectionName],
      project.single('bq_collection_exists'),
      callback
    );
  };
}

BedquiltClient.connect = (connectionString, callback) => {
  let previous = cache[connectionString];
  let client = null;
  if (previous) {
    client = previous.client;
    if (previous.error) {
      throw previous.error;
    }
    return callback(null, client);
  } else {
    // build a new client and cache it
    client = new BedquiltClient(connectionString);
    cache[connectionString] = {client: client, error: null};

    // check bedquilt version on db server
    pg.connect(connectionString, (err, db, done) => {
      let q = "select bq_assert_minimum_version($1::text)";
      if (err) {
        return callback(err, null);
      }
      db.query(q, [MINIMUM_SERVER_VERSION], (err, result) => {
        done();
        if (err) {
          // update cached value with the error and throw
          cache[connectionString].error = err;
          throw err;
        } else {
          // finally invoke the callback with client instance
          return callback(null, client);
        }
      });
      return null;
    });
  }
  return null;
};

function BedquiltQuery() {

  this.init = (baseQuery) => {
    baseQuery.on('row', (row) => {
      this.emit('row', project.single(row));
    });

    baseQuery.on('error', (error) => {
      this.emit('error', error);
    });

    baseQuery.on('end', (result) => {
      this.emit('end', result);
    });
  };

  EventEmitter.call(this);
}
util.inherits(BedquiltQuery, EventEmitter);


module.exports = BedquiltClient;
