"use strict"

var dup = require("dup")
var bits = require("bit-twiddle")
var async = require("async")

var cases = [
  require("./brute-force.js"),
  require("./static-kdt.js"),
  require("./ubi-bench.js") 
  //require("./look-alike.js")  //Broken
]

if((typeof window) === "undefined") {
  var nkd = (typeof window  === "undefined") ? "./node-kdtree" : ""
  cases.push(require(nkd))
}

var columns = []

var NVALUES = [100, 1000, 10000, 100000]
var KVALUES = [1, 10, 100]
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
var BALL_QUERIES = dup(100).map(function() {
  return [ dup(2).map(Math.random), Math.random()*Math.random()*Math.random()*Math.random() ]
})
var KNN_QUERIES = dup(100).map(function() {
  return dup(2).map(Math.random)
})
var PREPROCESS_ITER_COUNT = 1000000
var RANGE_ITER_COUNT = 1000000
var RNN_ITER_COUNT = 1000000
var KNN_ITER_COUNT = 100000

var firstColumn = [
  "Data Structure",
  ":---",
  "Dynamic?",
  "Works in browser?"]

firstColumn.push.apply(firstColumn,
  NVALUES.map(function(v) {
    return "Construction: (n=" + v + ",d=2)"
  }))
firstColumn.push.apply(firstColumn, 
  NVALUES.map(function(v) {
    return "Range: (n=" + v + ",d=2)"
  }))
firstColumn.push.apply(firstColumn,
  NVALUES.map(function(v) {
    return "rNN: (n=" + v + ",d=2)"
  }))
KVALUES.forEach(function(k) {
  firstColumn.push.apply(firstColumn,
    NVALUES.map(function(v) {
      return "kNN: (n="+v+",d=2,k="+k+")"
    }))
})

columns.push(firstColumn)

var todo = []

cases.forEach(function(c) {
  var column = [
      "[" + c.name + "](" + c.url + ")",
      "---:",
      (c.dynamic ? "✓" : "✗"),
      (c.pureJS ? "✓" : "✗")
    ]
  todo.push(function(next) {
    console.log("testing: ", c.name)
    next()
  })
  NVALUES.forEach(function(n,i) {
    todo.push(function(next) {
      var nn = (PREPROCESS_ITER_COUNT / POINTS[i].length)|0
      console.log("preprocess: ", POINTS[i].length, nn)
      var result = c.preprocess(POINTS[i], nn) 
      if(typeof result === "number") {
        column.push((result/nn) + "ms")
      } else {
        column.push(result)
      }
      console.log(result)
      setTimeout(next, 10)
    })
  })
  NVALUES.forEach(function(n,i) {
    todo.push(function(next) {
      var nn = Math.ceil(RANGE_ITER_COUNT / POINTS[i].length)|0
      console.log("range: ", POINTS[i].length, nn)
      var result = c.range(POINTS[i], QUERIES, nn)
      if(typeof result[0] === "number") {
        column.push((result[0] / (nn * QUERIES.length)) + "ms")
      } else {
        column.push(result[0])
      }
      console.log(result.join())
      setTimeout(next, 10)
    })
  })
  NVALUES.forEach(function(n,i) {
    todo.push(function(next){
      var nn = Math.ceil(RNN_ITER_COUNT / POINTS[i].length)|0
      console.log("rnn:", POINTS[i].length, nn)
      var result = c.rnn(POINTS[i], BALL_QUERIES, nn)
      if(typeof result[0] === "number") {
        column.push((result[0] / (nn*BALL_QUERIES.length)) + "ms")
      } else {
        column.push(result[0])
      }
      console.log(result.join())
      setTimeout(next, 10)
    })
  })
  KVALUES.forEach(function(k) {
    NVALUES.forEach(function(n,i) {
      todo.push(function(next) {
        var nn = Math.max(Math.ceil(KNN_ITER_COUNT/(Math.sqrt(POINTS[i].length)*k)), 10)|0
        console.log("knn:", POINTS[i].length, nn, "k=", k)
        var result
        if(k === 1) {
          result = c.nn(POINTS[i], KNN_QUERIES, nn)
        } else {
          result = c.knn(POINTS[i], KNN_QUERIES.map(function(v) {
            return [v,k]
          }), nn)
        }
        if(typeof result[0] === "number") {
          column.push((result[0] / (nn*KNN_QUERIES.length)) + "ms")
        } else {
          column.push(result[0])
        }
        console.log(result.join())
        setTimeout(next, 10)
      })
    })
  })
  todo.push(function(next) {
    columns.push(column)
    setTimeout(next, 10)
  })
})

todo.push(function(next) {
  var columnStr = []
  for(var i=0; i<columns[0].length; ++i) {
    for(var j=0; j<columns.length; ++j) {
      columnStr.push(" | ")
      columnStr.push(columns[j][i])
    }
    columnStr.push(" |\n")
  }
  console.log(columnStr.join(""))
  setTimeout(next, 10)
})

async.series(todo)