/*jslint node: true*/
/*global require, exports*/
"use strict";

var pg = require('pg');

var project = {
  column: function(columnName) {
    return function(result) {
      return result.rows.map(function(row) {
        return row[columnName];
      });
    };
  },
  single: function(columnName) {
    return function(result) {
      return result.rows[0][columnName];
    };
  }
};

function BedquiltClient() {};

BedquiltClient.connect = function(connectionString, callback) {
  var _pass = function() {
    return function(result) {
      return result;
    };
  };
  var db = {
    connectionString: connectionString,

    collection: function(collectionName) {
      return new BedquiltCollection(this, collectionName);
    },

    _query: function(queryString, params, projection, callback) {
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
    },

    listCollections: function(callback) {
      return this._query(
        'select bq_list_collections();',
        [],
        project.column('bq_list_collections'),
        callback
      );
    },

    createCollection: function(collectionName, callback) {
      return this._query(
        'select bq_create_collection($1::text);',
        [collectionName],
        project.single('bq_create_collection'),
        callback
      );
    },

    deleteCollection: function(collectionName, callback) {
      return this._query(
        'select bq_delete_collection($1::text);',
        [collectionName],
        project.single('bq_delete_collection'),
        callback
      );
    }

  };

  return callback(null, db);
};

function BedquiltCollection(db, collectionName) {
  this.db = db;
  this.collectionName = collectionName;

  this.count = function(queryDoc, callback) {
    return this.db._query(
      "select bq_count($1::text, $2::json);",
      [this.collectionName, queryDoc],
      project.single('bq_count'),
      callback
    );
  };

  this.insert = function(doc, callback) {
    return this.db._query(
      "select bq_insert($1::text, $2::json);",
      [this.collectionName, doc],
      project.single('bq_insert'),
      callback
    );
  };

  this.save = function(doc, callback) {
    return this.db._query(
      "select bq_save($1::text, $2::json);",
      [this.collectionName, doc],
      project.single('bq_save'),
      callback
    );
  };
};


exports.BedquiltClient = BedquiltClient;
exports.BedquiltCollection = BedquiltCollection;
