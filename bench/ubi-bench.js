var kdTree = require("./ubilabs.js").kdTree

module.exports = {
  name:"Ubilabs kdtree",
  url:"https://github.com/ubilabs/kd-tree-javascript",
  dynamic: true,
  pureJS: true,
  preprocess: function(points, repeat) {
    var distance = function(a, b){
      return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2);
    }
    var start = Date.now()
    for(var i=0; i<repeat; ++i) {
      var tree = new kdTree(points, distance, [0,1])
    }
    var end = Date.now()
    return end-start
  },
  range: function() {
    return ["N/A", 0]
  },
  rnn: function(points, queries, repeat) {
    return ["ERROR", 0]
    /*

    //These results are not correct.  Also it runs really slow
    var distance = function(a, b){
      return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2);
    }
    var tree = new kdTree(points, distance, [0,1])
    var n = points.length
    var m = queries.length
    var count = 0
    var start = Date.now()
    for(var i=0; i<repeat; ++i) {
      for(var j=0; j<m; ++j) {
        count += tree.nearest(queries[j][0], n, queries[j][1]).length
      }
    }
    var end = Date.now()
    return [end-start, count]
    */
  },
  knn: function(points, queries, repeat) {
    var distance = function(a, b){
      return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2);
    }
    var tree = new kdTree(points.map(function(a,idx) {
      return [a[0], a[1], idx]
    }), distance, [0,1])
    var m = queries.length
    var count = 0
    var start = Date.now()
    for(var i=0; i<repeat; ++i) {
      for(var j=0; j<m; ++j) {
        var q = queries[j]
        var p = q[0]
        var k = q[1]
        var pts = tree.nearest(p, k)
        for(var l=0; l<k; ++l) {
          count += pts[l][0][2]
        }
      }
    }
    var end = Date.now()
    return [end-start, count]
  },
  nn: function(points, queries, repeat) {
    var distance = function(a, b){
      return Math.pow(a[0] - b[0], 2) +  Math.pow(a[1] - b[1], 2);
    }
    var tree = new kdTree(points.map(function(a,idx) {
      return [a[0], a[1], idx]
    }), distance, [0,1])
    var m = queries.length
    var count = 0
    var start = Date.now()
    for(var i=0; i<repeat; ++i) {
      for(var j=0; j<m; ++j) {
        var pts = tree.nearest(queries[j], 1)
        count += pts[0][0][2]
      }
    }
    var end = Date.now()
    return [end-start, count]
  }
}