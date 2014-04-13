"use strict"

module.exports = createKDTree

var unpack = require("ndarray-unpack")

var ndarray = require("ndarray")
var pack = require("ndarray-pack")
var ndselect = require("ndarray-select")
var ops = require("ndarray-ops")
var pool = require("typedarray-pool")
var ndscratch = require("ndarray-scratch")

function KDTree(points, ids, n, d) {
  this.points = points
  this.ids = ids
  this.dimension = d
  this.length = n
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
  var ids = this.ids

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

    /*
    console.log("visitQ=", unpack(visitRange.hi(visitCount)))
    console.log("range, idx=", idx, "k=", k, 
      "lo=", unpack(visitRange.pick(visitTop, 0)), 
      "hi=", unpack(visitRange.pick(visitTop, 1)), 
      "point=", unpack(points.pick(idx)))
    */

    var loidx = visitRange.index(visitTop, 0, 0)
    var hiidx = visitRange.index(visitTop, 1, 0)
    var pidx = points.index(idx, 0)

    var visitPoint = true
    for(var i=0; i<d; ++i) {
      var pc = pointData[pidx+i]
      if((pc < rangeData[loidx + i]) || 
         (rangeData[hiidx + i] < pc)) {
        visitPoint = false
        break
      }
    }
    if(visitPoint) {
      retval = visit(ids[idx])
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
        var y = visitRange.index(visitCount, 0, 0)
        for(var i=0; i<d; ++i) {
          rangeData[y+i] = rangeData[loidx+i]
        }
        var z = visitRange.index(visitCount, 1, 0)
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
        var y = visitRange.index(visitCount, 0, 0)
        for(var i=0; i<d; ++i) {
          rangeData[y+i] = rangeData[loidx+i]
        }
        var z = visitRange.index(visitCount, 1, 0)
        for(var i=0; i<d; ++i) {
          rangeData[z+i] = rangeData[hiidx+i]
        }
        rangeData[y+k] = Math.max(lk, pk)
        visitCount += 1
      }
    }

    //Increment pointer
    visitTop += 1
  }
  ndscratch.free(visitRange)
  pool.free(visitIndex)
  return retval
}

proto.rnn = function(point, radius) {
  //TODO: Implement this
}

proto.nn = function(point) {
  var n = this.length
  if(n < 1) {
    return -1
  }
  //TODO: Special case, optimize this
  var r = this.knn(point, 1)
  return r[0]
}

proto.knn = function(point, k) {
  var d = this.dimension
  var n = this.length
  var points = this.points
  var ids = this.ids
  if(n < k) {
    return Array.prototype.slice.call(this.ids)
  }
  //TODO: Implement this
}

proto.dispose = function kdtDispose() {
  pool.free(this.points.data)
  pool.freeInt32(this.ids)
  this.points = null
  this.length = 0
}

function createKDTree(points) {
  var n, d, indexed
  if(Array.isArray(points)) {
    n = points.length
    if(n === 0) {
      return new KDTree(null, null, 0, 0)
    }
    d = points[0].length
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
    ops.assign(indexed.hi(n,d), points)
  }
  for(var i=0; i<n; ++i) {
    indexed.set(i, d, i)
  }

  var pointArray = ndscratch.malloc([n, d], points.dtype)
  var indexArray = pool.mallocInt32(n)
  var pointer = 0

  //Walk tree in level order
  var toVisit = new Array(n)
  var eoq = 1
  toVisit[0] = [indexed, 0]
  while(pointer < n) {
    var head = toVisit[pointer]
    var array = head[0]
    var k = head[1]
    var nn = array.shape[0]
    
    //Find median
    var median, n_2
    if(nn > 1) {
      n_2 = nn>>>1
      median = ndselect(array, n_2, function(a,b) {
        return a.get(k) - b.get(k)
      })
    } else {
      median = array.pick(0)
    }

    //Copy into new array
    ops.assign(pointArray.pick(pointer), median.hi(d))
    indexArray[pointer] = median.get(d)
    pointer += 1

    //Queue new items
    if(nn > 1) {
      k = (k+1) % d
      toVisit[eoq++] = [array.hi(n_2), k]
      if(nn > 2) {
        toVisit[eoq++] = [array.lo(n_2+1), k]
      }
    }
  }

  //Release indexed
  pool.free(indexed.data)

  return new KDTree(pointArray, indexArray, n, d)
}