# merge-k-sorted-arrays

[![Build Status](https://travis-ci.org/jedwards1211/merge-k-sorted-arrays.svg?branch=master)](https://travis-ci.org/jedwards1211/merge-k-sorted-arrays)
[![Coverage Status](https://codecov.io/gh/jedwards1211/merge-k-sorted-arrays/branch/master/graph/badge.svg)](https://codecov.io/gh/jedwards1211/merge-k-sorted-arrays)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Merges 2 or more arrays efficiently using a priority queue.

See https://algorithms.tutorialhorizon.com/merge-k-sorted-arrays/ for an
explanation of the algorithm.

## Usage

```sh
npm install --save merge-k-sorted-arrays
```

Pass an array of the arrays to merge as the first argument:

```js
var merge = require('merge-k-sorted-arrays')

merge([
  [1, 3, 5, 7],
  [2, 4, 6, 8],
  [0, 9, 10, 11],
])
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```

### With custom comparator

You may pass an optional custom comparator as the second argument:

```js
merge(
  [
    [7, 5, 3, 1],
    [8, 6, 4, 2],
    [11, 10, 9, 0],
  ],
  function (a, b) {
    return b - a
  }
)
// [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```
