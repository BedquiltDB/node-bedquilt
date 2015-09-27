# API Documentation

This document describes the `node-bedquilt` api.

----

## `BedquiltClient`

A client class which communicates with the PostgreSQL/Bedquilt server.

### `#connect`

Params: `connectionString::String`, `callback::Function`

A static method used to connect to the Bedquilt server.
The callback takes two parameters `err` and `client`, the latter of which
is an instance of BedquiltCollection.

Example:
```javascript
var BedquiltClient = require('bedquilt').BedquiltClient;

BedquiltClient.connect('postgres://localhost/test', function(err, client) {
  var people = client.collection('people');
  people.insert({name: "Sarah", age: 45}, function(err, result) {
    console.log('Added Sarah to the people collection with _id: ' + result);
  });
});
```

----

### `#collection`

Params: `collectionName::String`

Returns: instance of `BedquiltCollection`

Use to get an instance of `BedquiltCollection`, which can be used to read and write to a collection.

----


### `#listCollections`

Params: `callback::Function`

Gets a list of the names of all collections on the database. The callback function should take two parameters,
`err` and `result` where result is an Array of strings.

---


### `#createCollection`

Params: `collectionName::String`, `callback::Function`

Creates a collection on the database.
The callback function should take two parameters, `err` and `result` where result is a boolean indicating whether
the collection was created. This value will be false if the named collection already existed on the server.

----


### `#deleteCollection`

Params: `collectionName::String`, `callback::Function`

Deletes a collection on the database.
The callback function should take two parameters, `err` and `result` where result is a boolean indicating whether
the collection was deleted. This value will be false if the named collection did not exist on the server.

----


## `BedquiltCollection`

A class representing a connection to a collection on the database server.

----


### `#count`

Params: `queryDoc::Object`, `callback::Function`

Get a count of documents in the collection.
The callback function should take two parameters, `err` and `result`, where result is a Number.

----


### `#insert`

Params: `doc::Object`, `callback::Function`

Insert a document into the collection. If the document has an `_id` field, then that will be used as the primary key for the document in the collection. If not, then a random string will be generated on the server and set as the `_id` field. The callback function should take two parameters, `err` and `result`, where result is the `_id` value of the inserted document.

----


### `#save`

Params: `doc::Object`, `callback::Function`

Save a document to the collection. If the document has an `_id` field, and it matches an existing document
in the collection then the supplied document will replace (overwrite) the existing one.
Othewise, this method behaves like the `insert` method.
The callback function should take two parameters, `err` and `result`, where result is the `_id` field of the saved document.

----


### `#find`

Params: `queryDoc::Object`, `options::Object (optional)`, `callback::Function`

Find documents in the collection, matching the supplied query document.
The callback function should take two parameters, `err` and `result`, where result is an Array of Objects.
The options object may contain the following fields:

- `sort`: Array of sort specs, example: `{sort: [{lastUpdate: 1, name: -1}]`
- `skip`: Number of documents to skip, default 0
- `limit`: Number of documents to limit result set to, default `null`

----


### `#findOne`

Params: `queryDoc::Object`, `callback::Function`

Find a single document in the collection, matching the supplied query document.
The callback function should take two parameters, `err` and `result`, where result is an Object.

----



### `#findOneById`

Params: `id::String`, `callback::Function`

Find a single document in the collection, which has an `_id` field matching the supplied id string.
The callback function should take two parameters, `err` and `result`, where result is an Object.

----


### `#remove`

Params: `queryDoc::Object`, `callback::Function`

Remove documents from the collection, matching the supplied query document.
The callback function should take two parameters, `err` and `result`, where result is a Number indicating
the number of documents removed.

----


### `#removeOne`

Params: `queryDoc::Object`, `callback::Function`

Remove a single document from the collection, matching the supplied query document.
The callback function should take two parameters, `err` and `result`, where result is a Number indicating
the number of documents removed.

----


### `#removeOneById`

Params: `id::String`, `callback::Function`

Remove a single document from the collection, which has an `_id` field matching the supplied id string.
The callback function should take two parameters, `err` and `result`, where result is a Number indicating
the number of documents removed.

----
