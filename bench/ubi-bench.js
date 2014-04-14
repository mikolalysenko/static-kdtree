var kdTree = require("./ubilabs.js").kdTree

module.exports = {
  name:"Ubilabs kdtree",
  url:"https://github.com/ubilabs/kd-tree-javascript",
  dynamic: true,
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
  }
}