/*jslint node: true*/
/*global require exports*/
"use strict";

var project = require('./utils.js').project;

/**
 * Create a BedquiltCollection instance
 * @constructor
 * @param {BedquiltClient} client The BedquiltClient instance to use
 * @param {string} collectionName Name of collection
 */
function BedquiltCollection(client, collectionName) {
  this.client = client;
  this.collectionName = collectionName;

  this.count = function(queryDoc, callback) {
    return this.client._query(
      "select bq_count($1::text, $2::json);",
      [this.collectionName, queryDoc],
      project.single('bq_count'),
      callback
    );
  };

  this.insert = function(doc, callback) {
    return this.client._query(
      "select bq_insert($1::text, $2::json);",
      [this.collectionName, doc],
      project.single('bq_insert'),
      callback
    );
  };

  this.save = function(doc, callback) {
    return this.client._query(
      "select bq_save($1::text, $2::json);",
      [this.collectionName, doc],
      project.single('bq_save'),
      callback
    );
  };

  this.find = function(queryDoc, options, callback) {
    var _query, _opts, _cb;
    var skip = 0;
    var limit = null;
    var sort = null;
    if (arguments.length === 2) {
      _query = arguments[0];
      _opts = {};
      _cb = arguments[1];
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
      sort = _opts.sort;
    }
    return this.client._query(
      "select bq_find($1::text, $2::json, $3::integer, $4::integer, $5::jsonb);",
      [this.collectionName, _query, skip, limit, sort],
      project.column('bq_find'),
      _cb
    );
  };

  this.findOne = function(queryDoc, callback) {
    return this.client._query(
      "select bq_find_one($1::text, $2::json);",
      [this.collectionName, queryDoc],
      project.single('bq_find_one'),
      callback
    );
  };

  this.findOneById = function(_id, callback) {
    return this.client._query(
      "select bq_find_one_by_id($1::text, $2::text);",
      [this.collectionName, _id],
      project.single('bq_find_one_by_id'),
      callback
    );
  };

  this.remove = function(queryDoc, callback) {
    return this.client._query(
      "select bq_remove($1::text, $2::json)",
      [this.collectionName, queryDoc],
      project.single('bq_remove'),
      callback
    );
  };

  this.removeOne = function(queryDoc, callback) {
    return this.client._query(
      "select bq_remove_one($1::text, $2::json)",
      [this.collectionName, queryDoc],
      project.single('bq_remove_one'),
      callback
    );
  };

  this.removeOneById = function(_id, callback) {
    return this.client._query(
      "select bq_remove_one_by_id($1::text, $2::text)",
      [this.collectionName, _id],
      project.single('bq_remove_one_by_id'),
      callback
    );
  };

  this.addConstraints = function(specDoc, callback) {
    return this.client._query(
      "select bq_add_constraints($1::text, $2::json)",
      [this.collectionName, specDoc],
      project.single('bq_add_constraints'),
      callback
    );
  };

  this.removeConstraints = function(specDoc, callback) {
    return this.client._query(
      "select bq_remove_constraints($1::text, $2::json)",
      [this.collectionName, specDoc],
      project.single('bq_remove_constraints'),
      callback
    );
  };

  this.listConstraints = function(callback) {
    return this.client._query(
      "select bq_list_constraints($1::text)",
      [this.collectionName],
      project.column('bq_list_constraints'),
      callback
    );
  };
}

module.exports = BedquiltCollection;
