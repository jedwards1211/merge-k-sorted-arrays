const {describe, it} = require('mocha')
const {expect} = require('chai')
const merge = require('..')

function randInt(n) {
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
    expect(merge([[1, 3, 5, 7], [1, 3, 5, 7]])).to.deep.equal([1, 1, 3, 3, 5, 5, 7, 7])
  })
  it('works', function () {
    expect(merge([
      [1, 3, 5, 7],
      [2, 4, 6, 8],
      [0, 9, 10, 11],
    ])).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
  it('works with extra empty arrays', function () {
    expect(merge([
      [1, 3, 5, 7],
      [],
      [2, 4, 6, 8],
      [0, 9, 10, 11],
      [],
      [],
      [],
    ])).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
  it('works with custom comparator', function () {
    expect(merge([
      [1, 3, 5, 7].reverse(),
      [2, 4, 6, 8].reverse(),
      [0, 9, 10, 11].reverse(),
    ], (a, b) => b - a)).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].reverse())
  })
  it('works on strings', function () {
    expect(merge([
      ['a', 'c', 'e', 'g'],
      ['b', 'd', 'f', 'h'],
      ['0', 'i', 'j', 'k'],
    ])).to.deep.equal(['0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'])
  })
  it('random test', function () {
    for (let i = 0; i < 50; i++) {
      var arrays = []
      for (let i = 2; i < 2 + randInt(10); i++) {
        var nextArray = new Array(randInt(50))
        nextArray[0] = randInt(20)
        for (let k = 1; k < nextArray.length; k++) {
          nextArray[k] = nextArray[k - 1] + randInt(5)
        }
        arrays.push(nextArray)
      }

      var actual = merge(arrays)
      var expected = [].concat(...arrays).sort((a, b) => a - b)
      expect(actual).to.deep.equal(expected)
    }
  })
})


