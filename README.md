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

# Example

```javascript
//Import library
var createKDTree = require("static-kdtree")

//Create a bunch of points
var points = [
  [0, 1, 100],
  [-5, 0.11, Math.PI],
  [0, 10, -13],

  // ...

  [4, 3, 1]
]

//Create the tree
var tree = createKDTree(points)

//Iterate over all points in the bounding box
tree.range([-1, -1, -1], [10, 1, 2], function(idx) {
  console.log("visit:", idx)  //idx = index of point in points array
})

//Can also search in spheres
tree.rnn([0,0,0], 10, function(idx) {
  console.log("point " + idx + " is in sphere at origin with radius=10")
})

//Nearest neighbor queries
console.log("index of closest point to [0,1,2] is ", tree.nn([0,1,2]))

//And k-nearest neighbor queries
console.log("index of 10 closest points to [0,1,2] are ", tree.knn([0,1,2], 10))

//For performance, be sure to delete tree when you are done with it
tree.dispose()
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

**Time Complexity** `O(n + k)`, where `k` is the number of points in the sphere, though perhaps much less than `n` depending on the distribution of the points.

#### `kdt.nn(point[, maxDistance])`
Returns the index of the closest point to `point`

* `point` is a query point
* `maxDistance` is an upper bound on the distance to search for nearest points. Default `Infinity`

**Returns** The index of the closest point in the tree to `point`, or `-1` if the tree is empty.

**Time Complexity** `O(n log(n))` in the worst case, but in practice much faster if the points are uniformly distributed.

#### `kdt.knn(point, k[, maxDistance])`
Returns a list of the k closest points to point in the tree.

* `point` is the point which is being queried
* `k` is the number of points to query
* `maxDistance` bounds the distance of the returned points. Default is `Infinity`

**Returns** A list of indices for the `k` closest points to `point` in the `tree` which are within distance `< maxDistance`.  The indices are ordered by distance to `point`.

**Time Complexity** `O((n + k) log(n + k))`, but may be faster if the points in the tree are uniformly distributed

#### `kdt.serialize()`
Returns a serializable JSON object encoding the state of the kdtree.  This can be passed to `deserialize()` to restore the kdtree.

#### `kdt.dispose()`
Release all resources associated with the kdtree.  This is not necessary, but can reduce garbage collector pressure over time.

**Time Complexity** `O(1)`

# Comparisons

To test the performance of this module, experiments were performed against two other kdtree libraries ([Ubilabs kdtree](https://github.com/ubilabs/kd-tree-javascript) and [node-kdtree](https://github.com/justinethier/node-kdtree)), as well as a naive brute force algorithm.  Ubilabs kdtree is pure JavaScript, and supports only kNN queries and does not correctly implement rNN queries.  node-kdtree is a wrapper over the native C++ library, [libkdtree](https://code.google.com/p/kdtree/), and only supports rNN and NN queries.  Neither library implements range queries.  These libraries were tested in node.js 0.10.26 and Chrome 34 on a MacBook Pro, Core i7 2.3GHz with 8GB of RAM.  The results from these experiments can be found here:

* [node 0.10.26](https://github.com/mikolalysenko/static-kdtree/blob/master/bench/node-0.10-results.md#results-for-node-01026)
* [Chrome 34](https://github.com/mikolalysenko/static-kdtree/blob/master/bench/chrome-34-results.md#chrome-34)

And the code for these experiments can be found in the bench/ subdirectory of this repository.

## Observations

Up to 1000 points or so brute force searching is the fastest method for answering any query, so for small data sets it is probably better to not use a kdtree or any data structure in the first place.

The latest version of v8 in Chrome is strictly faster than node.js for all test cases and modules.  Because of native C++ dependencies, node-kdtree cannot run in a browser, but even so the Chrome version of static-kdtree is 2-3x faster.  static-kdtree is also up to an order of magnitude faster than Ubilabs kdtree at all operations, making it by far the best choice in the browser.

In node.js, the situation is slightly more ambiguous.  node-kdtree has the fastest construction time, and also answers 1-nearest neighbor queries faster.  Both Ubilabs kdtree and static-kdtree take about the same amount of time on nearest neighbors queries.  On all other queries static-kdtree is again strictly faster.  It is unclear why the performance of nearest neighbor queries is slightly slower in node.js, but perhaps it may be related to node.js' v8 engine being several versions behind Chrome.  In future updates this situation may start to look more like Chrome, making static-kdtree likely to be the better option for long term.

# Credits
(c) 2014 Mikola Lysenko. MIT License