/* jslint node: true */
"use strict";

var pg = require('pg');

function BedquiltClient() {};

BedquiltClient.connect = function(connectionString, callback) {
  var db = {
    connectionString: connectionString,
    collection: function(collectionName) {
      return new BedquiltCollection(this, collectionName);
    },
    _query: function(collectionName, queryDoc, callback) {
      return callback(null, true);
    }
  };
  callback(null, db);
};

function BedquiltCollection(db, collectionName) {
  this.db = db;
  this.collectionName = collectionName;
  this._query = function(queryDoc, callback) {
    return db._query(this.collectionName, queryDoc, callback);
  };
};


exports.BedquiltClient = BedquiltClient;
exports.BedquiltCollection = BedquiltCollection;
