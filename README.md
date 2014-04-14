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

It is also worth mentioning that for approximate nearest neighbor queries or queries with a fixed size radius, grids and locality sensitive hashing are strictly better options.

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

### `var kdt = createKDTree.deserialze(data)`
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

#### `kdt.knn(point, k[, maxDistance])`
Returns a list of the k closest points to point in the tree.

* `point` is the point which is being queried
* `k` is the number of points to query
* `maxDistance` is an optional parameter which bounds the distance of the returned points. Default is `Infinity`

**Returns** An array of indices of the exact `k` closest points in the tree to the query point.

**Time Complexity** `O((n + k) log(k))`, but may be faster if the points in the tree are uniformly distributed

#### `kdt.serialize()`
Returns a serializable JSON object encoding the state of the kdtree

#### `kdt.dispose()`
Release all resources associated with the kdtree

**Time Complexity** `O(1)`

# Comparisons

Here are some preliminary benchmarks:

| Data Structure | [Linear scan](http://en.wikipedia.org/wiki/Brute-force_search) | [static-kdtree](https://github.com/mikolalysenko/static-kdtree) | [Ubilabs kdtree](https://github.com/ubilabs/kd-tree-javascript) | [node-kdtree](https://github.com/justinethier/node-kdtree) | [look-alike](https://github.com/axiomzen/Look-Alike) |
|:---|---:|---:|---:|---:|---:|
| Dynamic? | ✓ | ✗ | ✓ | ✓ | ✗ |
| Works in browser? | ✓ | ✓ | ✓ | ✗ | ✓ |
| Construction: (n=100,d=2) | 0ms | 0.1652ms | 0.0993ms | 0.0358ms | 0.7314ms |
| Construction: (n=1000,d=2) | 0ms | 1.887ms | 1.689ms | 0.419ms | 9.728ms |
| Construction: (n=10000,d=2) | 0ms | 22.79ms | 38.38ms | 6.42ms | 157.42ms |
| Construction: (n=100000,d=2) | 0ms | 283ms | 959.1ms | 124.3ms | 2379.9ms |
| Range: (n=100,d=2) | 0.001231ms | 0.003839ms | N/A | N/A | N/A |
| Range: (n=1000,d=2) | 0.01321ms | 0.01217ms | N/A | N/A | N/A |
| Range: (n=10000,d=2) | 0.1291ms | 0.0771ms | N/A | N/A | N/A |
| Range: (n=100000,d=2) | 1.633ms | 0.672ms | N/A | N/A | N/A |
| rNN: (n=100,d=2) | 0.001397ms | 0.005994ms | 0.024014ms | 0.00231ms | N/A |
| rNN: (n=1000,d=2) | 0.01452ms | 0.01645ms | 0.22984ms | 0.01893ms | N/A |
| rNN: (n=10000,d=2) | 0.1437ms | 0.0919ms | 2.673ms | 0.1838ms | N/A |
| rNN: (n=100000,d=2) | 2.193ms | 0.909ms | 61.131ms | 2.527ms | N/A |

**THESE NUMBERS ARE NOT YET FINAL**

### Some thoughts:

To me at least, these results are pretty shocking. None of the kdtree data structures on npm outperform a simple linear scan, which makes them worse than useless (even node-kdtree, which uses native C++ bindings). Even for this module - which is currently the only one to beat the simple brute force algorithm -  a linear scan will be faster up to around 1000 points or so.  However, for sufficiently *large* data sets using a kdtree can make sense especially for interactive applications.

# Credits
(c) 2014 Mikola Lysenko. MIT License