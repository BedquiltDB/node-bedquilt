/*jslint node: true*/
/*jshint esnext: true*/
/*global require exports*/
"use strict";

const project = require('./utils.js').project;

/**
 * Create a BedquiltCollection instance
 * @constructor
 * @param {BedquiltClient} client The BedquiltClient instance to use
 * @param {string} collectionName Name of collection
 */
function BedquiltCollection(client, collectionName) {
  this.client = client;
  this.collectionName = collectionName;

  this.distinct = function(keyPath, callback) {
    return this.client._query(
      "select bq_distinct($1::text, $2::text) as bq_result;",
      [this.collectionName, keyPath],
      project.column(),
      callback
    );
  };

  this.count = function(queryDoc, callback) {
    return this.client._query(
      "select bq_count($1::text, $2::jsonb) as bq_result;",
      [this.collectionName, queryDoc],
      project.single(),
      callback
    );
  };

  this.insert = function(doc, callback) {
    return this.client._query(
      "select bq_insert($1::text, $2::jsonb) as bq_result;",
      [this.collectionName, doc],
      project.single(),
      callback
    );
  };

  this.save = function(doc, callback) {
    return this.client._query(
      "select bq_save($1::text, $2::jsonb) as bq_result;",
      [this.collectionName, doc],
      project.single(),
      callback
    );
  };

  this.find = function(queryDoc, options, callback) {
    var _query, _opts, _cb;
    var skip = 0;
    var limit = null;
    var sort = null;
    if (arguments.length === 1) {
      _query = arguments[0];
      _opts = {};
    } else if (arguments.length === 2) {
      if (typeof arguments[1] === 'function') {
        _query = arguments[0];
        _opts = {};
        _cb = arguments[1];
      } else {
        _query = arguments[0];
        _opts = arguments[1];
      }
    } else if (arguments.length === 3) {
      _query = arguments[0];
      _opts = arguments[1];
      _cb = arguments[2];
    } else {
      throw new Error("Wrong number of arguments passed to collection.find");
    }
    if (_opts.skip) {
      skip = _opts.skip;
    }
    if (_opts.limit) {
      limit = _opts.limit;
    }
    if (_opts.sort) {
      sort = JSON.stringify(_opts.sort);
    }
    return this.client._query(
      "select bq_find($1::text, $2::jsonb, $3::integer, $4::integer, $5::jsonb) as bq_result;",
      [this.collectionName, _query, skip, limit, sort],
      project.column(),
      _cb
    );
  };

  this.findOne = function(queryDoc, options, callback) {
    var _query, _opts, _cb;
    var skip = 0;
    var sort = null;
    if (arguments.length === 1) {
      _query = arguments[0];
      _opts = {};
    } else if (arguments.length === 2) {
      if (typeof arguments[1] === 'function') {
        _query = arguments[0];
        _opts = {};
        _cb = arguments[1];
      } else {
        _query = arguments[0];
        _opts = arguments[1];
      }
    } else if (arguments.length === 3) {
      _query = arguments[0];
      _opts = arguments[1];
      _cb = arguments[2];
    } else {
      throw new Error("Wrong number of arguments passed to collection.find");
    }
    if (_opts.skip) {
      skip = _opts.skip;
    }
    if (_opts.sort) {
      sort = JSON.stringify(_opts.sort);
    }
    return this.client._query(
      "select bq_find_one($1::text, $2::jsonb, $3::integer, $4::jsonb) as bq_result;",
      [this.collectionName, _query, skip, sort],
      project.single(),
      _cb
    );
  };

  this.findOneById = function(_id, callback) {
    return this.client._query(
      "select bq_find_one_by_id($1::text, $2::text) as bq_result;",
      [this.collectionName, _id],
      project.single(),
      callback
    );
  };

  this.findManyByIds = function(ids, callback) {
    return this.client._query(
      "select bq_find_many_by_ids($1::text, $2::jsonb) as bq_result;",
      [this.collectionName, JSON.stringify(ids)],
      project.column(),
      callback
    );
  };

  this.remove = function(queryDoc, callback) {
    return this.client._query(
      "select bq_remove($1::text, $2::jsonb) as bq_result;",
      [this.collectionName, queryDoc],
      project.single(),
      callback
    );
  };

  this.removeOne = function(queryDoc, callback) {
    return this.client._query(
      "select bq_remove_one($1::text, $2::jsonb) as bq_result;",
      [this.collectionName, queryDoc],
      project.single(),
      callback
    );
  };

  this.removeOneById = function(_id, callback) {
    return this.client._query(
      "select bq_remove_one_by_id($1::text, $2::text) as bq_result;",
      [this.collectionName, _id],
      project.single(),
      callback
    );
  };

  this.removeManyByIds = function(ids, callback) {
    return this.client._query(
      "select bq_remove_many_by_ids($1::text, $2::jsonb) as bq_result;",
      [this.collectionName, JSON.stringify(ids)],
      project.single(),
      callback
    );
  };

  this.addConstraints = function(specDoc, callback) {
    return this.client._query(
      "select bq_add_constraints($1::text, $2::jsonb) as bq_result;",
      [this.collectionName, specDoc],
      project.single(),
      callback
    );
  };

  this.removeConstraints = function(specDoc, callback) {
    return this.client._query(
      "select bq_remove_constraints($1::text, $2::jsonb) as bq_result;",
      [this.collectionName, specDoc],
      project.single(),
      callback
    );
  };

  this.listConstraints = function(callback) {
    return this.client._query(
      "select bq_list_constraints($1::text) as bq_result;",
      [this.collectionName],
      project.column(),
      callback
    );
  };
}

module.exports = BedquiltCollection;
