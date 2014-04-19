"use strict"

var createTree = require("../kdtree")
var tape = require("tape")
var dup = require("dup")
var iota = require("iota-array")
var unpack = require("ndarray-unpack")

function checkTreeInvariants(t, tree, points) {
  t.equals(tree.length, points.length, "checking point count")
  t.equals(tree.dimension, points[0].length, "checking dimension")
  t.equals(tree.points.shape[0], points.length)
  t.equals(tree.points.shape[1], points[0].length)

  var ids = [].slice.call(tree.ids, 0, tree.length)
  ids.sort(function(a,b) { return a-b })
  t.same(ids, iota(tree.length), "checking ids consistent")

  var d = tree.dimension

  //Check tree satisifies kdtree invariants
  function checkNode(idx, k, lo, hi) {
    if(idx >= tree.length) {
      return
    }
    t.same(unpack(tree.points.pick(idx)), points[tree.ids[idx]], "check ids consistent: " + points[tree.ids[idx]])
    for(var i=0; i<tree.dimension; ++i) {
      t.ok(lo[i] <= tree.points.get(idx, i), "check lower bound " + i + " on pt " + idx + "/" + tree.ids[idx] + " - " + lo[i])
      t.ok(tree.points.get(idx, i) <= hi[i], "check upper bound " + i + " on pt " + idx + "/" + tree.ids[idx] + " - " + hi[i])
    }

    var left = 2 * idx + 1
    var hi2 = hi.slice()
    hi2[k] = Math.min(hi2[k], tree.points.get(idx, k))
    checkNode(left, (k+1)%d, lo, hi2)

    var right = 2 * (idx + 1)
    var lo2 = lo.slice()
    lo2[k] = Math.max(lo2[k], tree.points.get(idx, k))
    checkNode(right, (k+1)%d, lo2, hi)
  }
  checkNode(0, 0, 
    dup([tree.dimension], -Infinity), 
    dup([tree.dimension], Infinity))
}
/*

tape("kdtree-constructor", function(t) {

  var emptyTree = createTree([])
  t.equals(emptyTree.length, 0, "check empty tree length")
  t.equals(emptyTree.dimension, 0, "checking empty tree dimension")

  t.end()
})

tape("kdtree-range", function(t) {

  function verifyKDT(points, queries) {
    var tree = createTree(points)
    checkTreeInvariants(t, tree, points)
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
      [[0], [10]],
      [[3], [5]]
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
  var rndpoints = iota(20).map(function() {
    return [ Math.random() ]
  })
  var rndquery = new Array(20)
  for(var i=0; i<200; ++i) {
    rndquery[i] = [ 
      [Math.random()],
      [Math.random()]
    ]
  }
  verifyKDT(rndpoints, rndquery)

  t.end()
})

tape("kdtree-rnn", function(t) {
  function verifyKDT(points, queries) {
    var tree = createTree(points)
    checkTreeInvariants(t, tree, points)

    for(var i=0; i<queries.length; ++i) {
      var p = queries[i][0]
      var r = queries[i][1]

      var result = []
      tree.rnn(p, r, function(idx) {
        result.push(idx)
      })
      result.sort(function(a,b) {
        return a-b
      })

      //Run brute force query
      var bruteResult = []
      _outer_loop:
      for(var j=0; j<points.length; ++j) {
        var d2 = 0.0
        for(var k=0; k<tree.dimension; ++k) {
          var dd = points[j][k] - p[k]
          d2 += dd*dd
        }
        if(d2 <= r*r) {
          bruteResult.push(j)
        }
      }

      //Check consistent
      t.same(result, bruteResult, "checking query: [" + p.join() + "] - r=" + r)
    }
  }

  verifyKDT([
    [0],
    [1],
    [2],
    [3],
    [4],
    [5],
    [6]
    ], [
      [[-1], 2],
      [[0], 3],
      [[3], 1]
    ])


  //Fuzz test
  for(var d=1; d<=3; ++d) {
    verifyKDT(dup([100]).map(function() {
      return dup(3).map(Math.random)
    }), dup([100]).map(function() {
      return [ dup(3).map(Math.random), Math.random() ]
    }))
  }

  t.end()
})
*/

/*
tape("kdtree-nn", function(t) {

  function verifyKDT(points, queries) {
    var tree = createTree(points)
    checkTreeInvariants(t, tree, points)
    var n = points.length
    var d = tree.dimension

    for(var i=0; i<queries.length; ++i) {
      var q = queries[i]
      var result = tree.nn(q)

      var closest = Infinity
      var closestId = -1
      for(var j=0; j<n; ++j) {
        var d2 = 0.0
        var p = points[j]
        for(var k=0; k<d; ++k) {
          d2 += Math.pow(p[k] - q[k], 2)
        }
        if(d2 < closest) {
          closest = d2
          closestId = j
        }
      }

      //Check consistent
      t.same(result, closestId, "checking query: [" + q.join() + "]")
    }
  }

  verifyKDT([
    [0],
    [1],
    [2],
    [3],
    [4],
    [5],
    [6],
    [7],
    [8]
  ], [
    [-1],
    [0],
    [100],
    [1.2],
    [5]
  ])

  verifyKDT([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1]
    ], [
      [0.6, 1.1]
    ])

  verifyKDT(
  [ [ 0.5265642239246517, 0.6504898599814624, 0.9076471894513816 ],
  [ 0.5711805920582265, 0.6875700594391674, 0.5559023409150541 ],
  [ 0.035533570451661944, 0.1872501156758517, 0.9695042904932052 ],
  [ 0.16655360907316208, 0.4235553340986371, 0.11011496861465275 ],
  [ 0.11104298033751547, 0.5439382966142148, 0.8345404758583754 ],
  [ 0.6267438798677176, 0.9586594388820231, 0.8362555310595781 ],
  [ 0.3432757714763284, 0.49840168631635606, 0.3721386867109686 ],
  [ 0.7753844952676445, 0.5090622468851507, 0.5131825210992247 ],
  [ 0.20929246372543275, 0.7940021466929466, 0.6287347744219005 ],
  [ 0.5429658864159137, 0.4370973852928728, 0.6015548731666058 ],
  [ 0.06730182864703238, 0.9444667370989919, 0.9317043661139905 ],
  [ 0.07957132114097476, 0.28060819767415524, 0.7851832874584943 ],
  [ 0.7672675235662609, 0.5231135785579681, 0.3532694913446903 ],
  [ 0.3195426561869681, 0.21085683535784483, 0.7376968506723642 ],
  [ 0.9494495869148523, 0.8060768477153033, 0.7332828294020146 ],
  [ 0.32620522007346153, 0.7446149704046547, 0.4282113059889525 ],
  [ 0.8943506490904838, 0.2354269647039473, 0.1770020192489028 ],
  [ 0.14350488525815308, 0.10890368302352726, 0.16937963385134935 ],
  [ 0.9751434307545424, 0.5355300710070878, 0.09499730751849711 ],
  [ 0.7581261771265417, 0.8728804176207632, 0.5343005512841046 ] ], [ [ 0.2029628586024046, 0.8788582773413509, 0.5149176649283618 ] ])

  //Fuzz
  var pts = dup(100).map(function() {
    return dup(3).map(Math.random)
  })
  var queries =dup(100).map(function() {
    return dup(3).map(Math.random)
  })
  verifyKDT(pts, queries)

  t.end()
})
*/

tape("kdtree-knn", function(t) {

  function verifyKDT(points, queries) {
    var tree = createTree(points)
    checkTreeInvariants(t, tree, points)
    var n = points.length
    var d = tree.dimension

    for(var i=0; i<queries.length; ++i) {
      var q = queries[i]
      var result = tree.knn(q[0], q[1], q[2])

      //Sort points by distance
      var closestPoints = points.map(function(p, idx) {
        var d2 = 0.0
        for(var k=0; k<d; ++k) {
          d2 += Math.pow(p[k] - q[0][k], 2)
        }
        return [d2, idx]
      }).filter(function(p) {
        return p[0] < q[2]
      })
      closestPoints.sort(function(a,b) {
        return a[0] - b[0]
      })
      if(closestPoints.length > q[1]) {
        closestPoints = closestPoints.slice(0, q[1])
      }
      var closestIds = closestPoints.map(function(a) {
        return a[1]
      })

      t.same(result, closestIds, "checking knn: [" + q[0].join() + "] k=" + q[1] + " r=" + q[2])
    }
  }

  verifyKDT([
    [0],
    [1],
    [2],
    [3],
    [4],
    [5],
    [6],
    [7],
    [8]
  ], [
    [[-1], 3, Infinity],
    [[-1], 3, 2],
  ])

  //Fuzz
  var pts = dup(100).map(function() {
    return dup(3).map(Math.random)
  })
  var queries =dup(100).map(function() {
    return [dup(3).map(Math.random), 5 + Math.random()|10, Math.random()]
  })
  verifyKDT(pts, queries)

  t.end()
})

tape("kdtree-serialize", function(t) {

  //Fuzz
  var pts = dup(100).map(function() {
    return dup(4).map(Math.random)
  })

  var tree = createTree(pts)
  checkTreeInvariants(tree)

  var data = tree.serialize()
  var ntree = createTree.deserialize(data)
  checkTreeInvariants(ntree)
  t.same(ntree, data)
  
  t.end()
})