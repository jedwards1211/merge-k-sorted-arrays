var TinyQueue = require('tinyqueue')

function defaultComparator(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}

function merge(arrays, options) {
  var comparator, outputMetadata
  if (typeof options === 'function') {
    comparator = options
  } else if (options) {
    comparator = options.comparator
    outputMetadata = options.outputMetadata
  }
  var finalComparator = comparator || defaultComparator

  function entryComparator(a, b) {
    return finalComparator(a[2], b[2])
  }

  var totalLength = arrays.reduce(function (length, array) { return length + array.length }, 0)
  var output = new Array(totalLength)
  var outputIndex = 0

  var initQueue = arrays.reduce(function (initQueue, array, index) {
    if (array.length) initQueue.push([index, 0, array[0]])
    return initQueue
  }, [])

  var queue = new TinyQueue(initQueue, entryComparator)
  while (queue.length) {
    var entry = queue.pop()
    output[outputIndex++] = outputMetadata ? entry : entry[2]
    var array = arrays[entry[0]]
    var nextIndex = entry[1] + 1
    if (nextIndex < array.length) {
      queue.push([entry[0], nextIndex, array[nextIndex]])
    }
  }

  return output
}

module.exports = merge

