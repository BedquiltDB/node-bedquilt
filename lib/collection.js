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

  this.find = function(queryDoc, callback) {
    return this.client._query(
      "select bq_find($1::text, $2::json);",
      [this.collectionName, queryDoc],
      project.column('bq_find'),
      callback
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
}

module.exports = BedquiltCollection;
