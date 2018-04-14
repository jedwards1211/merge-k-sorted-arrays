var TinyQueue = require('tinyqueue')

function defaultComparator(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}

function merge(arrays, comparator) {
  var finalComparator = comparator || defaultComparator

  function entryComparator(a, b) {
    return finalComparator(a.value, b.value)
  }

  var totalLength = arrays.reduce(function (length, array) { return length + array.length }, 0)
  var output = new Array(totalLength)
  var outputIndex = 0

  var initQueue = arrays.reduce(function (initQueue, array, index) {
    if (array.length) initQueue.push({value: array[0], a: index, i: 0})
    return initQueue
  }, [])

  var queue = new TinyQueue(initQueue, entryComparator)
  while (queue.length) {
    var entry = queue.pop()
    output[outputIndex++] = entry.value
    var array = arrays[entry.a]
    var nextIndex = entry.i + 1
    if (nextIndex < array.length) {
      queue.push({value: array[nextIndex], a: entry.a, i: nextIndex})
    }
  }

  return output
}

module.exports = merge

