module.exports = {
  name: "Linear scan",
  url: "http://en.wikipedia.org/wiki/Brute-force_search",
  dynamic: true,
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
  } 
}