/*jslint node: true*/
/*global require, exports*/
"use strict";

var pg = require('pg');
var BedquiltCollection = require('./collection.js');
var project = require('./utils.js').project;

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
};

BedquiltClient.connect = function(connectionString, callback) {
  var client = new BedquiltClient(connectionString);
  return callback(null, client);
};

module.exports = BedquiltClient;
