import { describe, it } from 'mocha'
import { expect } from 'chai'
import merge from '../src'

function randInt(n: number) {
  return Math.floor(Math.random() * n)
}

describe('merge', function () {
  it('returns empty array if there are no input arrays', function () {
    expect(merge([])).to.deep.equal([])
  })
  it('returns single array intact', function () {
    expect(merge([[1, 3, 5, 7]])).to.deep.equal([1, 3, 5, 7])
  })
  it('merges array into itself', function () {
    expect(
      merge([
        [1, 3, 5, 7],
        [1, 3, 5, 7],
      ])
    ).to.deep.equal([1, 1, 3, 3, 5, 5, 7, 7])
  })
  it('works', function () {
    expect(
      merge([
        [1, 3, 5, 7],
        [2, 4, 6, 8],
        [0, 9, 10, 11],
      ])
    ).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
  it('works with extra empty arrays', function () {
    expect(
      merge([[1, 3, 5, 7], [], [2, 4, 6, 8], [0, 9, 10, 11], [], [], []])
    ).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
  it('unique works', function () {
    expect(
      merge(
        [
          [1, 3, 3, 6, 6],
          [2, 2, 3, 5],
        ],
        { unique: true }
      )
    ).to.deep.equal([1, 2, 3, 5, 6])
  })
  it('outputMetadata option works', function () {
    expect(
      merge([[1, 3, 5, 7], [], [2, 4, 6, 8], [0, 9, 10, 11], [], [], []], {
        outputMetadata: true,
      })
    ).to.deep.equal([
      [3, 0, 0],
      [0, 0, 1],
      [2, 0, 2],
      [0, 1, 3],
      [2, 1, 4],
      [0, 2, 5],
      [2, 2, 6],
      [0, 3, 7],
      [2, 3, 8],
      [3, 1, 9],
      [3, 2, 10],
      [3, 3, 11],
    ])
  })
  it('outputMetadata + unique', function () {
    expect(
      merge(
        [
          [1, 3, 3, 6, 6],
          [2, 2, 3, 5],
        ],
        { unique: true, outputMetadata: true }
      )
    ).to.deep.equal([
      [0, 0, 1],
      [1, 1, 2],
      [1, 2, 3],
      [1, 3, 5],
      [0, 4, 6],
    ])
    expect(
      merge(
        [
          [1, 3, 5, 5, 7, 7],
          [],
          [2, 3, 4, 5, 6, 8],
          [0, 5, 7, 7, 9, 10, 11],
          [],
          [],
          [],
        ],
        {
          outputMetadata: true,
          unique: true,
        }
      )
    ).to.deep.equal([
      [3, 0, 0],
      [0, 0, 1],
      [2, 0, 2],
      [2, 1, 3],
      [2, 2, 4],
      [3, 1, 5],
      [2, 4, 6],
      [3, 3, 7],
      [2, 5, 8],
      [3, 4, 9],
      [3, 5, 10],
      [3, 6, 11],
    ])

    expect(
      merge(
        [
          [1, 3, 5, 7],
          [],
          [0, 5, 7, 9, 10, 11],
          [2, 3, 4, 5, 6, 8],
          [],
          [],
          [],
        ],
        {
          outputMetadata: true,
          unique: true,
        }
      )
    ).to.deep.equal([
      [2, 0, 0],
      [0, 0, 1],
      [3, 0, 2],
      [3, 1, 3],
      [3, 2, 4],
      [3, 3, 5],
      [3, 4, 6],
      [2, 2, 7],
      [3, 5, 8],
      [2, 3, 9],
      [2, 4, 10],
      [2, 5, 11],
    ])

    expect(
      merge(
        [
          [],
          [0, 5, 7, 9, 10, 11],
          [2, 3, 4, 5, 6, 8],
          [],
          [1, 3, 5, 7],
          [],
          [],
        ],
        {
          outputMetadata: true,
          unique: true,
        }
      )
    ).to.deep.equal([
      [1, 0, 0],
      [4, 0, 1],
      [2, 0, 2],
      [4, 1, 3],
      [2, 2, 4],
      [4, 2, 5],
      [2, 4, 6],
      [4, 3, 7],
      [2, 5, 8],
      [1, 3, 9],
      [1, 4, 10],
      [1, 5, 11],
    ])
  })
  it('works with custom comparator', function () {
    expect(
      merge(
        [
          [1, 3, 5, 7].reverse(),
          [2, 4, 6, 8].reverse(),
          [0, 9, 10, 11].reverse(),
        ],
        (a, b) => b - a
      )
    ).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].reverse())
  })
  it('allows passing comparator via options', function () {
    expect(
      merge(
        [
          [1, 3, 5, 7].reverse(),
          [2, 4, 6, 8].reverse(),
          [0, 9, 10, 11].reverse(),
        ],
        (a, b) => b - a
      )
    ).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].reverse())
  })
  it('outputMetadata option works with custom comparator', function () {
    expect(
      merge(
        [
          [1, 3, 5, 7].reverse(),
          [],
          [2, 4, 6, 8].reverse(),
          [0, 9, 10, 11].reverse(),
          [],
          [],
          [],
        ],
        {
          outputMetadata: true,
          comparator: (a, b) => b - a,
        }
      )
    ).to.deep.equal(
      [
        [3, 3, 0],
        [0, 3, 1],
        [2, 3, 2],
        [0, 2, 3],
        [2, 2, 4],
        [0, 1, 5],
        [2, 1, 6],
        [0, 0, 7],
        [2, 0, 8],
        [3, 2, 9],
        [3, 1, 10],
        [3, 0, 11],
      ].reverse()
    )
  })
  it('works on strings', function () {
    expect(
      merge([
        ['a', 'c', 'e', 'g'],
        ['b', 'd', 'f', 'h'],
        ['0', 'i', 'j', 'k'],
      ])
    ).to.deep.equal([
      '0',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
    ])
  })
  it('random test', function () {
    for (let i = 0; i < 50; i++) {
      const arrays: number[][] = []
      for (let i = 2; i < 2 + randInt(10); i++) {
        const nextArray = new Array(randInt(50))
        nextArray[0] = randInt(20)
        for (let k = 1; k < nextArray.length; k++) {
          nextArray[k] = nextArray[k - 1] + randInt(5)
        }
        arrays.push(nextArray)
      }

      const actual = merge(arrays)
      const expected = ([] as number[]).concat(...arrays).sort((a, b) => a - b)
      expect(actual).to.deep.equal(expected)
    }
  })
})
