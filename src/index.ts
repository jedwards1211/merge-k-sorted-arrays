import TinyQueue from 'tinyqueue'

function defaultComparator(a: any, b: any) {
  return a < b ? -1 : a > b ? 1 : 0
}

type Comparator<T> = (a: T, b: T) => number

/**
 * Entry returned by {@link merge} when `outputMetadata: true` is given
 */
type Entry<T> = [
  indexOfSourceArray: number,
  indexInSourceArray: number,
  value: T
]

/**
 * Options for {@link merge}
 */
export type MergeOptions<T> = {
  /**
   * The function to compare array elements
   */
  comparator?: Comparator<T>
  /**
   * If true, outputs {@link Entry} tuples instead of just values:
   * [indexOfSourceArray: number, indexInSourceArray: number, value: T]
   */
  outputMetadata?: boolean
  /**
   * If true, filters out duplicate values (for which comparator(prev, next) === 0).
   * When using with `outputMetadata: true`, the last occurrence of a value in the last array
   * containing that value wins.
   */
  unique?: boolean
}

export default function merge<T>(
  /**
   * The arrays to merge, which must each be sorted
   */
  arrays: T[][],
  options: MergeOptions<T> & { outputMetadata: true }
): Entry<T>[]
export default function merge<T>(
  /**
   * The arrays to merge, which must each be sorted
   */
  arrays: T[][],
  options?: MergeOptions<T> | Comparator<T>
): T[]
export default function merge<T>(
  /**
   * The arrays to merge, which must each be sorted
   */
  arrays: T[][],
  options?: MergeOptions<T> | Comparator<T>
): T[] | Entry<T>[] {
  let comparator,
    outputMetadata: boolean | undefined = false,
    unique: boolean | undefined = false
  if (typeof options === 'function') {
    comparator = options
  } else if (options) {
    comparator = options.comparator
    outputMetadata = options.outputMetadata
    unique = options.unique
  }
  const finalComparator = comparator || defaultComparator

  const entryComparator = unique
    ? (a: Entry<T>, b: Entry<T>) => finalComparator(a[2], b[2]) || b[0] - a[0]
    : (a: Entry<T>, b: Entry<T>) => finalComparator(a[2], b[2])

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
  let prev: Entry<T> | undefined
  let entry: Entry<T> | undefined
  while ((entry = queue.pop())) {
    if (
      !unique ||
      !prev ||
      (finalComparator(entry[2], prev[2]) !== 0 &&
        (entry[1] === arrays[entry[0]].length - 1 ||
          finalComparator(entry[2], arrays[entry[0]][entry[1] + 1]) < 0))
    ) {
      prev = entry
      output[outputIndex++] = outputMetadata ? entry : entry[2]
    }
    const array = arrays[entry[0]]
    const nextIndex = entry[1] + 1
    if (nextIndex < array.length) {
      queue.push([entry[0], nextIndex, array[nextIndex]])
    }
  }
  if (unique) output.length = outputIndex

  return output
}
