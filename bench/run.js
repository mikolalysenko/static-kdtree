"use strict"

var cases = [
  //require("./brute-force.js"),
  require("./static-kdt.js"),
  require("./ubi-bench.js")
]

var columns = []

var NVALUES = [100, 1000, 100000]
var POINTS = NVALUES.map(function(n) {
  var points = new Array(n)
  for(var i=0; i<n; ++i) {
    points[i] = [ Math.random(), Math.random() ]
  }
  return points
})
var QUERIES = []
for(var i=0; i<100; ++i) {
  QUERIES.push([ 
    [Math.random(), Math.random()], [Math.random(), Math.random()] ])
}
var RANGE_ITER_COUNT = 100000
var PREPROCESS_ITER_COUNT = 400

var firstColumn = [
  "Data Structure",
  "Dynamic?",
  "Construction: (n=" + NVALUES[0] + ",k=2)",
  "Construction: (n=" + NVALUES[1] + ",k=2)",
  "Construction: (n=" + NVALUES[2] + ",k=2)",
  "Range: (n=" + NVALUES[0] + ",k=2)",
  "Range: (n=" + NVALUES[1] + ",k=2)",
  "Range: (n=" + NVALUES[2] + ",k=2)"
]

columns.push(firstColumn)

for(var k=0; k<cases.length; ++k) {
  var c = cases[k]
  console.log("testing: ", c.name)
  var column = [
    "[" + c.name + "](" + c.url + ")",
    (c.dynamic ? "✓" : "✗")
  ]
  for(var i=0; i<3; ++i) {
    console.log("preprocess: ", POINTS[i].length)
    var result = c.preprocess(POINTS[i], PREPROCESS_ITER_COUNT) 
    if(typeof result === "number") {
      column.push((result/PREPROCESS_ITER_COUNT) + "ms")
    } else {
      column.push(result)
    }
    console.log("t=", result/PREPROCESS_ITER_COUNT)
  }
  for(var i=0; i<3; ++i) {
    var nn = Math.ceil(RANGE_ITER_COUNT / POINTS[i].length)|0
    console.log("range: ", POINTS[i].length, nn * QUERIES.length)
    var result = c.range(POINTS[i], QUERIES, nn)
    if(typeof result[0] === "number") {
      column.push((result[0] / (nn * QUERIES.length)) + "ms")
    } else {
      column.push(result[0])
    }
    console.log("t=", result)
  }
  columns.push(column)
}

var columnStr = []
for(var i=0; i<columns[0].length; ++i) {
  for(var j=0; j<columns.length; ++j) {
    columnStr.push(" | ")
    columnStr.push(columns[j][i])
  }
  columnStr.push(" |\n")
}

console.log(columnStr.join(""))