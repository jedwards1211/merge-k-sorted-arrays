import TinyQueue from 'tinyqueue'

function defaultComparator(a: any, b: any) {
  return a < b ? -1 : a > b ? 1 : 0
}

type Comparator<T> = (a: T, b: T) => number

type Entry<T> = [
  indexOfSourceArray: number,
  indexInSourceArray: number,
  value: T
]

export default function merge<T>(
  arrays: T[][],
  options: { comparator?: Comparator<T>; outputMetadata: true }
): Entry<T>[]
export default function merge<T>(
  arrays: T[][],
  options?:
    | { comparator?: Comparator<T>; outputMetadata?: boolean }
    | Comparator<T>
): T[]
export default function merge<T>(
  arrays: T[][],
  options?:
    | { comparator?: Comparator<T>; outputMetadata?: boolean }
    | Comparator<T>
): T[] | Entry<T>[] {
  let comparator,
    outputMetadata: boolean | undefined = false
  if (typeof options === 'function') {
    comparator = options
  } else if (options) {
    comparator = options.comparator
    outputMetadata = options.outputMetadata
  }
  const finalComparator = comparator || defaultComparator

  function entryComparator(a: Entry<T>, b: Entry<T>) {
    return finalComparator(a[2], b[2])
  }

  const totalLength = arrays.reduce(function (length, array) {
    return length + array.length
  }, 0)
  const output = new Array(totalLength)
  let outputIndex = 0

  const initQueue = arrays.reduce(function (initQueue, array, index) {
    if (array.length) initQueue.push([index, 0, array[0]])
    return initQueue
  }, [] as Entry<T>[])

  const queue = new TinyQueue(initQueue, entryComparator)
  let entry: Entry<T> | undefined
  while ((entry = queue.pop())) {
    output[outputIndex++] = outputMetadata ? entry : entry[2]
    const array = arrays[entry[0]]
    const nextIndex = entry[1] + 1
    if (nextIndex < array.length) {
      queue.push([entry[0], nextIndex, array[nextIndex]])
    }
  }

  return output
}
