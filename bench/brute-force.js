var ndarray = require("ndarray")
var ndselect = require("ndarray-select")
var pack = require("ndarray-pack")
var unpack = require("ndarray-unpack")
var ndscratch = require("ndarray-scratch")

module.exports = {
  name: "Linear scan",
  url: "http://en.wikipedia.org/wiki/Brute-force_search",
  dynamic: true,
  pureJS: true,
  preprocess: function(points, repeat) {
    return 0
  },
  range: function(points, queries, repeat) {
    var m = points.length
    var d = points[0].length
    var count = 0
    var start = +Date.now()
    for(var ll=0; ll<repeat; ++ll)
    for(var i=0, n=queries.length; i<n; ++i) {
      var lo = queries[i][0]
      var hi = queries[i][1]
      _outer_loop:
      for(var j=0; j<m; ++j) {
        var p = points[j]
        for(var k=0; k<d; ++k) {
          if((p[k] < lo[k]) || (p[k] > hi[k])) {
            continue _outer_loop
          }
        }
        ++count
      }
    }
    var end = +Date.now()
    return [end - start, count]
  },
  rnn: function(points, queries, repeat) {
    var m = points.length
    var d = points[0].length
    var n = queries.length
    var count = 0
    var start = +Date.now()
    for(var ll=0; ll<repeat; ++ll) {
      //For comparing to other libraries, build a list here instead of just counting
      var list = []
      for(var i=0; i<n; ++i) {
        var q = queries[i]
        var p = q[0]
        var r2 = q[1] * q[1]
        for(var j=0; j<m; ++j) {
          var x = points[j]
          var d2 = 0.0
          for(var k=0; k<d; ++k) {
            var dd = p[k] - x[k]
            d2 += dd*dd
          }
          if(d2 <= r2) {
            list.push(j)
          }
        }
      }
      count += list.length
    }
    var end = +Date.now()
    return [end - start, count]
  },
  knn: function(points, queries, repeat) {
    //Use ndarray-select to partially sort elements
    var m = queries.length
    var d = points[0].length
    var n = points.length
    var sel = ndselect.compile([1,0], false, "float64")
    var pointArray = ndscratch.malloc([n, 2])
    var weight = 0
    var start = Date.now()
    for(var i=0; i<repeat; ++i) {
      for(var j=0; j<m; ++j) {
        var q = queries[j]
        var p = q[0]
        var k = q[1]
        for(var l=0; l<n; ++l) {
          var d2 = 0.0
          for(var a=0; a<d; ++a) {
            d2 += Math.pow(p[a] - points[l][a], 2)
          }
          pointArray.set(l, 0, d2)
          pointArray.set(l, 1, l)
        }
        sel(pointArray, k)
        for(var l=0; l<k; ++l) {
          weight += pointArray.get(l, 1)
        }
      }
    }
    var end = Date.now()
    ndscratch.free(pointArray)
    return [end-start, weight]
  },
  nn: function(points, queries, repeat) {
    var m = queries.length
    var d = points[0].length
    var n = points.length
    var count = 0
    var start = Date.now()
    for(var rcount=0; rcount<repeat; ++rcount) {
      for(var i=0; i<m; ++i) {
        var q = queries[i]
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
        count += closestId
      }
    }
    var end = Date.now()
    return [end-start, count]
  }
}