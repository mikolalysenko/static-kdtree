var LA = require("look-alike")

module.exports = {
  name:"look-alike",
  url:"https://github.com/axiomzen/Look-Alike",
  dynamic: false,
  pureJS: true,
  preprocess: function(points, repeat) {
    //Convert points -> objects for look-alike
    var objectPoints = points.map(function(p) {
      return {
        0: p[0],
        1: p[1]
      }
    })
    var start = Date.now()
    for(var i=0; i<repeat; ++i) {
      var tree = new LA(objectPoints)
    }
    var end = Date.now()
    return end-start
  },
  range: function() {
    return ["N/A", 0]
  },
  rnn: function(points, queries, repeat) {
    return ["N/A", 0]
  },
  knn: function() {
    return ["N/A", 0]
  },
  nn: function() {
    return ["N/A", 0]
  }

}