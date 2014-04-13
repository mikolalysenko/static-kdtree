"use strict"

var createTree = require("../kdtree")
var tape = require("tape")

tape("basic constructor", function(t) {

  var emptyTree = createTree([])
  t.equals(emptyTree.length, 0, "check empty tree length")
  t.equals(emptyTree.dimension, 0, "checking empty tree dimension")

  t.end()
})

tape("kdtree-range", function(t) {

  function verifyKDT(points, queries) {
    var tree = createTree(points)
    t.equals(tree.length, points.length, "checking point count")
    t.equals(tree.dimension, points[0].length, "checking dimension")
    for(var i=0; i<queries.length; ++i) {
      var result = []
      tree.range(queries[i][0], queries[i][1], function(idx) {
        result.push(idx)
      })

      //Run brute force query
      var bruteResult = []
      _outer_loop:
      for(var j=0; j<points.length; ++j) {
        for(var k=0; k<tree.dimension; ++k) {
          if(points[j][k] < queries[i][0][k] || points[j][k] > queries[i][1][k]) {
            continue _outer_loop
          }
        }
        bruteResult.push(j)
      }

      //Sort result
      result.sort(function(a,b) {
        return a-b
      })

      //Check consistent
      t.same(result, bruteResult, "checking query: [" + queries[i].join("] to [") + "]")
    }
  }

  verifyKDT([
      [5],
      [4],
      [3],
      [2],
      [1],
      [0]
    ], [
      [[-100], [0]],
      [[0], [2.5]],
      [[0], [10]]
    ])

  verifyKDT([
    [0,0],
    [1,0],
    [0,1],
    [1,1]],
    [
      [[0,0], [1,1]]
    ])

  //Random blob of points in 3D
  var rndpoints = new Array(100)
  for(var i=0; i<100; ++i) {
    rndpoints[i] = [ Math.random(), Math.random(), Math.random() ]
  }
  var rndquery = new Array(20)
  for(var i=0; i<200; ++i) {
    rndquery[i] = [ 
      [Math.random(), Math.random(), Math.random()],
      [Math.random(), Math.random(), Math.random()]
    ]
  }
  verifyKDT(rndpoints, rndquery)

  t.end()
})
