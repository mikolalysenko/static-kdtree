"use strict"

module.exports = createKDTree

var pack = require("ndarray-pack")
var ndselect = require("ndarray-select")
var ops = require("ndarray-ops")
var pool = require("typedarray-pool")
var scratch = require("ndarray-scratch")

function KDTree(points) {
  this.points = points
  this.dimension = points.shape[1]-1
  this.length = points.shape[0]
}

var proto = KDTree.prototype

//Range query
proto.range = function kdtRangeQuery(lo, hi, visit) {
  var d = this.dimension
  var n = this.length

  //Check degenerate case
  for(var i=0; i<d; ++i) {
    if(hi[i] < lo[i]) {
      return
    }
  }

  var points = this.points

  //Walk tree in level order, skipping subtree which do not intersect range
  var visitRange = ndscratch.malloc([n, 2, d])
  var visitIndex = pool.mallocInt32(2*n)
  var rangeData = visitRange.data
  var pointData = points.data
  var visitCount = 1
  var visitTop = 0
  var retval

  visitIndex[0] = 0
  visitIndex[1] = 0
  pack(lo, visitRange.pick(0,0))
  pack(hi, visitRange.pick(0,1))

  while(visitTop < visitCount) {
    var idx = visitIndex[2*visitTop]
    var k = visitIndex[2*visitTop+1]

    var loidx = visitRange.index(visitTop, 0)
    var hiidx = visitRange.index(visitTop, 1)
    var pidx = points.index(idx)

    var visitPoint = true
    for(var i=0; i<d; ++i) {
      var pc = pointData[pidx+i]
      if((rangeData[loidx + i] > pc) || 
         (pc < rangeData[hiidx + i])) {
        visitPoint = false
        break
      }
    }
    if(visitPoint) {
      retval = visit(pointData[pidx+d]|0)
      if(retval !== undefined) {
        break
      }
    }

    //Visit children
    var nk = (k+1) % d
    var pk = pointData[pidx+k]
    var hk = rangeData[hiidx+k]
    var lk = rangeData[loidx+k]
    if(lk <= pk) {
      var left = 2 * idx + 1
      if(left < n) {
        visitIndex[2*visitCount] = left
        visitIndex[2*visitCount+1] = nk
        var y = visitRange.index(visitCount, 0)
        for(var i=0; i<d; ++i) {
          rangeData[y+i] = rangeData[loidx+i]
        }
        var z = visitRange.index(visitCount, 1)
        for(var i=0; i<d; ++i) {
          rangeData[z+i] = rangeData[hiidx+i]
        }
        rangeData[z+k] = Math.min(hk, pk)
        visitCount += 1
      }
    }
    if(pk <= hk) {
      var right = 2 * (idx + 1)
      if(right < n) {
        visitIndex[2*visitCount] = right
        visitIndex[2*visitCount+1] = nk
        var y = visitRange.index(visitCount, 0)
        for(var i=0; i<d; ++i) {
          rangeData[y+i] = rangeData[loidx+i]
        }
        var z = visitRange.index(visitCount, 1)
        for(var i=0; i<d; ++i) {
          rangeData[z+i] = rangeData[hiidx+i]
        }
        rangeData[y+k] = Math.max(lk, pk)
        visitCount += 1
      }
    }
  }
  ndscratch.free(visitRange)
  pool.free(visitIndex)
  return retval
}


proto.rnn = function(point, radius) {
}


proto.nn = function(point) {
  var n = this.length
  if(n < 1) {
    return -1
  }
  //TODO: Special case
  var r = this.knn(point, 1)
  return r[0]
}

proto.knn = function(point, k) {
  var d = this.dimension
  var n = this.length
  var points = this.points
  if(n < k) {
    var result = new Array(n)
    for(var i=0; i<n; ++i) {
      result[i] = points.get(i, d)|0
    }
    return result
  }
  
}

proto.dispose = function kdtDispose() {
  pool.free(this.points.data)
  this.points = null
  this.length = 0
}

function createKDTree(points) {
  var n, d, indexed
  if(Array.isArray(points)) {
    indexed = ndarray(pool.mallocDouble(n*(d+1)), [n, d+1])
    pack(points, indexed.hi(n, d))
  } else {
    n = points.shape[0]
    d = points.shape[1]

    //Round up data type size
    var type = points.dtype
    if(type === "int8" ||
       type === "int16" ||
       type === "int32" ) {
      type = "int32"
    } else if(type === "uint8" ||
      type === "uint8_clamped" ||
      type === "buffer" ||
      type === "uint16" ||
      type === "uint32") {
      type = "uint32"
    } else if(type === "float32") {
      type = "float32"
    } else {
      type = "float64"
    }

    indexed = ndarray(pool.malloc(n*(d+1)), [n, d+1])
    ops.assing(indexed.hi(n,d), points)
  }
  for(var i=0; i<n; ++i) {
    indexed.set(i, d, i)
  }

  function buildTreeRec(array, k) {
    var n = array.shape[0]
    if(n <= 1) {
      return
    }

    //Find median
    var n_2 = n>>>1
    var median = ndselect(array, median, function(a,b) {
      return a.get(k) - b.get(k)
    })

    //Swap with root
    var root = array.pick(0)
    for(var i=0; i<d; ++i) {
      var tmp = median.get(i)
      median.set(i, root.get(i))
      root.set(i, tmp)
    }

    //Recurse
    k = (k+1) % d
    buildTreeRec(array.lo(1).hi(n_2), k)
    buildTreeRec(array.hi(n_2), k)
  }
  buildTreeRec(indexed, 0)

  return new KDTree(indexed)
}