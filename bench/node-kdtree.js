var kd = require("kdtree")

module.exports = {
  name:"node-kdtree",
  url:"https://github.com/justinethier/node-kdtree",
  dynamic: true,
  pureJS: false,
  preprocess: function(points, repeat) {
    var n = points.length
    var start = Date.now()
    for(var i=0; i<repeat; ++i) {
      var tree = new kd.KDTree(2)
      for(var j=0; j<n; ++j) {
        tree.insert(points[j][0], points[j][1])
      }
    }
    var end = Date.now()
    return end-start
  },
  range: function() {
    return ["N/A", 0]
  },
  rnn: function(points, queries, repeat) {
    var n = points.length
    var tree = new kd.KDTree(2)
    for(var j=0; j<n; ++j) {
      tree.insert(points[j][0], points[j][1])
    }
    var count = 0
    var m = queries.length
    var start = Date.now()
    for(var i=0; i<repeat; ++i) {
      for(var j=0; j<m; ++j) {
        var p = queries[j][0]
        var r = queries[j][1]
        count += tree.nearestRange(p[0], p[1], r).length
      }
    }
    var end = Date.now()
    return [end-start, count]
  },
  knn: function() {
    return ["N/A", 0]
  },
  nn: function(points, queries, repeat) {
    var n = points.length
    var tree = new kd.KDTree(2)
    for(var j=0; j<n; ++j) {
      tree.insert(points[j][0], points[j][1], j)
    }
    var m = queries.length
    var count = 0
    var start = Date.now()
    for(var rcount=0; rcount<repeat; ++rcount) {
      for(var j=0; j<m; ++j) {
        var q = queries[j]
        count += tree.nearestValue(q[0], q[1])
      }
    }
    var end = Date.now()
    return [end-start, count]
  }
}