static-kdtree
=============
[kd-trees](http://en.wikipedia.org/wiki/K-d_tree) are a [compact](http://en.wikipedia.org/wiki/Succinct_data_structure) data structure for answering orthogonal range and nearest neighbor queries on higher dimensional point data in linear time.  While they are not as efficient at answering orthogonal range queries as [range trees](http://en.wikipedia.org/wiki/Range_tree) - especially in low dimensions - kdtrees consume exponentially less space, support k-nearest neighbor queries and are relatively cheap to construct. This makes them useful in small to medium dimensions for achieving a modest speed up over a linear scan.

Note that kd-trees are not the best data structure in all circumstances. If you want to do range searching, here is a chart to help you select one which is appropriate for a given dimension:

| Dimension | Preferred Data Structure | Complexity | Size |
|-----------|--------------------------|------------|------|
|     1     | [Binary search tree](http://en.wikipedia.org/wiki/Binary_search_tree)       |  O(log(n)) | O(n) |
|    2-3    | [Range tree](http://en.wikipedia.org/wiki/Range_tree)               | O(log^(d-1)(n)) | O(n log^d (n)) |
|   Medium  | [kd-tree](http://en.wikipedia.org/wiki/K-d_tree)                  | O(n^(1-1/d)) | O(n) |
|   Big     | [Array](http://en.wikipedia.org/wiki/Array_data_structure)                    | O(n)       | O(n) |

And for nearest neighbor searching, here is a survey of some different options:

| Dimension | Preferred Data Structure | Complexity | Size |
|-----------|--------------------------|------------|------|
|     1     | [Binary search tree](http://en.wikipedia.org/wiki/Binary_search_tree)       |  O(log(n)) | O(n) |
|    2    | [Voronoi diagram](http://en.wikipedia.org/wiki/Voronoi_diagram) | O(log(n)) | O(n) |
|   Medium  | [kd-tree](http://en.wikipedia.org/wiki/K-d_tree)                  | O(n^(1-1/d)) | O(n) |
|   Big     | [Array](http://en.wikipedia.org/wiki/Array_data_structure)                    | O(n)       | O(n) |

It is also worth mentioning that for approximate nearest neighbor queries or queries with a fixed size radius, [grids](http://en.wikipedia.org/wiki/Regular_grid) and [locality sensitive hashing](http://en.wikipedia.org/wiki/Locality_sensitive_hashing) are strictly better options.  In these charts the transition between "Medium" and "Big" depends on how many points there are in the data structure.  As the number of points grows larger, the dimension at which kdtrees become practical goes up.

This module works both in node.js and with [browserify](http://browserify.org/).

**THIS MODULE IS A WORK IN PROGRESS**

# Example

```javascript
var createKDTree = require("static-kdtree")


```

# Install

```sh
npm install static-kdtree
```

# API

```javascript
var createKDTree = require("static-kdtree")
```

By convention, let `n` denote the number of points and `d` denote the dimension of the kdtree.

## Constructor

#### `var kdt = createKDTree(points)`
Creates a kdtree from the given collection of points.

* `points` is either an array of arrays of length `d`, or else an [`ndarray`](https://github.com/mikolalysenko/ndarray) with shape `[n,d]`

**Returns** A kdtree data structure

**Time Complexity** This operation takes O(n log(n))

#### `var kdt = createKDTree.deserialze(data)`
Restores a serialized kdtree.

* `data` is a JavaScript object as produced by calling `kdt.serialize`

**Returns** A kdtree data structure equivalent to the one which was serialized.

**Time Complexity** `O(n)`

## Properties

#### `kdt.dimension`
The dimension of the tree

#### `kdt.length`
The number of points in the tree

## Methods

#### `kdt.range(lo, hi, visit)`
Executes an orthogonal range query on the kdtree

* `lo` is a lower bound on the range
* `hi` is an upper bound
* `visit(idx)` is a visitor function which is called once for every point contained in the range `[lo,hi]`. If `visit(idx)` returns any value `!== undefined`, then termination is halted.

**Returns** The last returned value of `visit`

**Time Complexity** `O(n^(1-1/d) + k)`, where `k` is the number of points in the range.

#### `kdt.rnn(point, radius, visit)`
Visit all points contained in the sphere of radius `r` centered at `point`

* `point` is the center point for the query, represented by a length `d` array
* `radius` is the radius of the query sphere
* `visit(idx)` is a function which is called once for every point contained in the ball.  As in the case of `kdt.range`, if `visit(idx)` returns a not undefined value, then iteration is terminated.

**Returns** The last returned value of `visit`

**Time Complexity** `O(n^(1-1/d) + k)`, where `k` is the number of points in the sphere

#### `kdt.nn(point[, maxDistance])`
Returns the index of the closest point to `point`

* `point` is a query point
* `maxDistance` is an upper bound on the distance to search for nearest points

**Returns** The index of the closest point in the tree to `point`, or `-1` if the tree is empty.

**Time Complexity** `O(n log(n))` in the worst case, but in practice much faster if the points are uniformly distributed.

#### `kdt.knn(point, k[, maxDistance])`
Returns a list of the k closest points to point in the tree.

* `point` is the point which is being queried
* `k` is the number of points to query
* `maxDistance` bounds the distance of the returned points. Default is `Infinity`

**Returns** A list of indices for the `k` closest points to `point` in the `tree` which are within distance `< maxDistance`.

**Time Complexity** `O((n + k) log(n + k))`, but may be faster if the points in the tree are uniformly distributed

#### `kdt.serialize()`
Returns a serializable JSON object encoding the state of the kdtree

#### `kdt.dispose()`
Release all resources associated with the kdtree

**Time Complexity** `O(1)`

# Comparisons

**WORK IN PROGRESS**

# Credits
(c) 2014 Mikola Lysenko. MIT License