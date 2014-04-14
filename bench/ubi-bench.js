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
  }
}