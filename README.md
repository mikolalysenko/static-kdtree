static-kdtree
=============
[kd-trees](http://en.wikipedia.org/wiki/K-d_tree) are a [compact](http://en.wikipedia.org/wiki/Succinct_data_structure) data structure for answering orthogonal range and nearest neighbor queries on higher dimensional point data in linear time.  While they are not as efficient at answering orthogonal range queries as [range trees](http://en.wikipedia.org/wiki/Range_tree), especially in low dimensions, kdtrees consume exponentially less space and support approximate nearest neighbor queries.


**THIS MODULE IS A WORK IN PROGRESS**

# Example

```javascript
```

# Install

```sh
npm install static-kdtree
```

# API

```javascript
var createKDTree = require("static-kdtree")
```

## Constructor

#### `var kdt = createKDTree(points)`

## Properties

#### `kdt.dimension`
The dimension of the tree

#### `kdt.length`
The number of points in the tree

## Methods

#### `kdt.range(lo, hi, visit)`
Executes an orthogonal range query on the kdtree

#### `kdt.nn(point)`
Returns the index of the closest point in the tree to the given query query point.

#### `kdt.ann(point, epsilon)`
Return the index of the approximately closest point in the tree to the query point.

#### `kdt.knn(point, k)`
Returns a list of the k closest points to point in the tree.

#### `kdt.aknn(point, k, epsilon)`
Returns a list of the k approximately closest points in the tree to the query point.

#### `kdt.rnn(point, radius)`
Returns a list of all points in the tree within distance radius of the query point.

#### `kdt.dispose()`
Release all resources associated with the kdtree

# Credits
(c) 2014 Mikola Lysenko. MIT License