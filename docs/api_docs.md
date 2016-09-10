# API Documentation

This document describes the `node-bedquilt` api.
See the [BedquiltDB Guide](https://bedquiltdb.readthedocs.org/en/latest/guide) for more comprehensive documentation of the BedquiltDB system.

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

The `find` method returns a `BedquiltQuery` object, which is an event emitter, emitting
the following events:

- `row`: fired when a row is retrieved from the database
- `error`: fired when an error is encountered
- `end`: fired when the query has finished

This means you can omit the `callback` parameter to find, and subscribe to `row` events
from the returned query object in order to access rows as they are returned from
the database. Example:

```javascript
query = things.find({'type': 'tool'})
query.on('row', (row) => {
    console.log('>> got a row');
    console.log(row); // -> {_id: 'abcd', ...'};
});
query.on('end', (result) => {
    console.log('>> done');
});
```

See `BedquiltQuery` below for more details.


----


### `#findOne`

Params: `queryDoc::Object`, `options::Object (optional)` `callback::Function`

Find a single document in the collection, matching the supplied query document.
The callback function should take two parameters, `err` and `result`, where result is an Object.

The options object may contain the following fields:

- `sort`: Array of sort specs, example: `{sort: [{lastUpdate: 1, name: -1}]`
- `skip`: Number of documents to skip, default 0

----



### `#findOneById`

Params: `id::String`, `callback::Function`

Find a single document in the collection, which has an `_id` field matching the supplied id string.
The callback function should take two parameters, `err` and `result`, where result is an Object.


### `#findManyByIds`

Params: `ids::Array[String]`, `callback::Function`

Find many documents, by their `_id` fields.
The callback function should take two parameters, `err` and `result`, where result is an Array of Objects.

----

### `#distinct`

Params: `keyPath::String`, `callback::Function`

Get a list of the distinct values present in a collection for the specified key.
The keyPath string may be either the name of a top-level key in the collection,
or a dotted path to a nested key.

Example:
```
coll.distinct('address.city', (err, result) => {
    console.log(result); // ['Edinburgh', 'London', ...]
})
```



### `#remove`

Params: `queryDoc::Object`, `callback::Function`

Remove documents from the collection, matching the supplied query document.
The callback function should take two parameters, `err` and `result`, where result is a Number indicating
the number of documents removed.

----


### `#removeOne`

Params: `queryDoc::Object`, `callback::Function`

Remove a single document from the collection, matching the supplied query document.
The callback function should take two parameters, `err` and `result`, where result is a Number indicating the number of documents removed.

----


### `#removeOneById`

Params: `id::String`, `callback::Function`

Remove a single document from the collection, which has an `_id` field matching the supplied id string.
The callback function should take two parameters, `err` and `result`, where result is a Number indicating the number of documents removed, either `0` or `1`.

----


### `#removeManyByIds`

Params: `ids::Array[String]`, `callback::Function`

Remove many documents from a collection, by their `_id` fields.
The callback function should take two parameters, `err` and `result`, where result is a Number indicating the number of documents removed, either `0` or `1`.



## `BedquiltQuery`

An event-emitter representing a query in progress. Returned from all query operations,
but only useful when returned from the `BedquiltCollection#find` method.

### Events

#### 'row': (row)

Emitted when a row is retrieved from the database. Each row is a single json document.

#### 'error': (error)

Emitted when an error is encountered

#### 'end': (result)

Emitted when all rows have been retrieved. The result is an array of values, equivalent
to the result that would be passed to a query callback.

----
