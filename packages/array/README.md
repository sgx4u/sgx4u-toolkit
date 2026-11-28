<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/array 🌟</h1>

<h3 align="center">Immutable array helpers for everyday data work.</h3>

<p align="center">
    <a href="../../.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=22.12" /></a>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">Part of <a href="../../README.md">@sgx4u/toolkit</a>.</p>
</div>

<br />

<h2 id="about">💫 About</h2>

`@sgx4u/array` copies, groups, sorts, diffs, and samples arrays without mutating the input. A result that is an array is always a new array. Holes are read as `undefined`.

A function that takes one value takes that value directly: `compact(array)`. A function that takes several takes one flat object: `chunk({ array, size })`. There is no nested options bag. Some functions also accept the bare array when the other fields have defaults, such as `getUniqueItems(array)` and `getUniqueItems({ array, keep: "last" })`.

Standard abbreviations stay in ALL CAPS in identifiers. A value that is not an array, where an array is required, returns `undefined`. `is*` and `has*` return `false` and do not throw. The [throw list](#throws) names every function that throws, and why.

`by` is a single property key (`"id"` or `0`) or a function `(item, index, array) => ...`. Dotted paths such as `"address.city"` are not paths. They are one property name.

Equality defaults to SameValueZero: `NaN` equals `NaN`, and `-0` equals `0`. Objects compare by reference until you pass `equals`.

The full signature table is in [FUNCTIONS.md](./FUNCTIONS.md). Each function also has a usage guide next to its source.

Experimental (`0.x`). Breaking changes may land in minor versions until 1.0.0.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="installation">📥 Installation</h2>

```sh
pnpm add @sgx4u/array       # pnpm
npm install @sgx4u/array    # npm
yarn add @sgx4u/array       # yarn
```

Requires Node `>=22.12`. The package publishes ESM (`import`) and CommonJS (`require`). It has no runtime dependencies.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="usage">💡 Usage</h2>

```ts
import { chunk, getUniqueItems, sortBy } from "@sgx4u/array";

chunk({ array: [1, 2, 3, 4, 5], size: 2 });
// [[1, 2], [3, 4], [5]]

getUniqueItems([1, NaN, 1, NaN]);
// [1, NaN]

sortBy({
    array: ["item10", "item2"],
    keys: [(item) => item],
    numeric: true,
    locale: "en-US",
});
// ["item2", "item10"]
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="create-array">🔧 createArray</h2>

`createArray(config)` returns a frozen object of every root function, with defaults bound in. Per-call values replace those defaults. There is no module-level default, so two instances can coexist.

| Option        | Default            | Used by                                                                                         |
| ------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| `equals`      | SameValueZero      | unique, set, search, diff, and toggle helpers                                                   |
| `locale`      | the runtime locale | `sortBy`, `sortNatural`, `createComparator`, and sorted search                                  |
| `numeric`     | `false`            | the same sort helpers. `true` orders `"item2"` before `"item10"`                                |
| `sensitivity` | `"variant"`        | collator sensitivity for those sorts                                                            |
| `nulls`       | `"last"`           | where `null`, `undefined`, and `NaN` sort keys go. Direction does not flip this                 |
| `random`      | `Math.random`      | `shuffleItems`, `sampleItem`, `sampleItems`, `sampleWeighted`. Must return a number in `[0, 1)` |
| `concurrency` | `Infinity`         | validated here. Read by `createAsyncArray`                                                      |

A per-call `seed` wins over `random`, including a bound `random`. The same seed always yields the same sequence, and different seeds do not share state.

```ts
import { createArray } from "@sgx4u/array";

const arrays = createArray({
    equals: (left, right) => left.id === right.id,
    locale: "en-IN",
    numeric: true,
});
```

`createAsyncArray` from `@sgx4u/array/async` binds `concurrency`. `createCombinatorics` from `@sgx4u/array/combinatorics` validates the same config and does not read it. Invalid config throws at creation: a `concurrency` of `0` is a `RangeError`, and a `random` that is not a function is a `TypeError`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="subpaths">📦 Subpaths</h2>

| Import                       | What it contains                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@sgx4u/array`               | Guards, slicing, grouping, sets, sorting, updates, reshape, generation, sampling, aggregation, pagination, diff, and `createArray`                      |
| `@sgx4u/array/async`         | Concurrent `map`, `filter`, `flatMap`, `forEach`, `find`, `some`, and `every`, plus sequential `reduceAsync`, `mapAsyncSettled`, and `createAsyncArray` |
| `@sgx4u/array/combinatorics` | Cartesian product, combinations, permutations, the power set, pairs, and `createCombinatorics`                                                          |

The root entry does not import the subpaths. Import `@sgx4u/array/async` or `@sgx4u/array/combinatorics` only when you use them.

Async helpers preserve output order and limit in-flight work with `concurrency` (minimum 1, default `Infinity`). They reject, instead of resolving `undefined`, when `array` is not an array. `stopOnError` defaults to `true`: the first rejection rejects the promise. Already started work is not cancelled unless `signal` aborts. With `stopOnError: false`, failures are collected and the promise rejects with `AggregateError`. `mapAsyncSettled` returns settled results and does not reject for a mapper failure. `reduceAsync` is sequential and does not take `concurrency`.

Combinators return a new array. They do not generate lazily. Permutations of `n` items are `n!`. A large `n` does not throw. The caller chooses the input size.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="functions">📘 Functions</h2>

[FUNCTIONS.md](./FUNCTIONS.md) lists every export, its subpath, parameters, return type, and a one-line description. The guides below are grouped by job.

### Guards, conversion, and access

[`isArrayLike`](./src/is-array-like/is-array-like.md), [`isEmptyArray`](./src/is-empty-array/is-empty-array.md), [`isNonEmptyArray`](./src/is-non-empty-array/is-non-empty-array.md), [`isTypedArray`](./src/is-typed-array/is-typed-array.md), [`hasAtLeast`](./src/has-at-least/has-at-least.md), [`ensureArray`](./src/ensure-array/ensure-array.md), [`toArray`](./src/to-array/to-array.md), [`getLength`](./src/get-length/get-length.md), [`getFirst`](./src/get-first/get-first.md), [`getLast`](./src/get-last/get-last.md), [`getAt`](./src/get-at/get-at.md), [`getInitial`](./src/get-initial/get-initial.md), [`getTail`](./src/get-tail/get-tail.md), [`getIndexOf`](./src/get-index-of/get-index-of.md), [`getLastIndexOf`](./src/get-last-index-of/get-last-index-of.md), [`findIndexes`](./src/find-indexes/find-indexes.md)

### Take, drop, split, and compact

[`take`](./src/take/take.md), [`takeLast`](./src/take-last/take-last.md), [`takeWhile`](./src/take-while/take-while.md), [`takeLastWhile`](./src/take-last-while/take-last-while.md), [`drop`](./src/drop/drop.md), [`dropLast`](./src/drop-last/drop-last.md), [`dropWhile`](./src/drop-while/drop-while.md), [`dropLastWhile`](./src/drop-last-while/drop-last-while.md), [`sliceArray`](./src/slice-array/slice-array.md), [`splitAt`](./src/split-at/split-at.md), [`splitWhen`](./src/split-when/split-when.md), [`compact`](./src/compact/compact.md), [`compactNullish`](./src/compact-nullish/compact-nullish.md), [`rejectItems`](./src/reject-items/reject-items.md), [`getItemsAt`](./src/get-items-at/get-items-at.md)

### Chunk, group, and partition

[`chunk`](./src/chunk/chunk.md), [`chunkBy`](./src/chunk-by/chunk-by.md), [`createWindows`](./src/create-windows/create-windows.md), [`groupBy`](./src/group-by/group-by.md), [`groupByKeys`](./src/group-by-keys/group-by-keys.md), [`countBy`](./src/count-by/count-by.md), [`indexBy`](./src/index-by/index-by.md), [`partition`](./src/partition/partition.md), [`partitionBy`](./src/partition-by/partition-by.md), [`countOccurrences`](./src/count-occurrences/count-occurrences.md)

`groupBy` with `asMap: false` stringifies keys with `String(key)`. Different objects can collide as `"[object Object]"`. `asMap: true` keeps the original key.

### Unique and sets

[`getUniqueItems`](./src/get-unique-items/get-unique-items.md), [`getUniqueItemsBy`](./src/get-unique-items-by/get-unique-items-by.md), [`getUnion`](./src/get-union/get-union.md), [`getIntersection`](./src/get-intersection/get-intersection.md), [`getDifference`](./src/get-difference/get-difference.md), [`getSymmetricDifference`](./src/get-symmetric-difference/get-symmetric-difference.md), [`withoutValues`](./src/without-values/without-values.md), [`isSubset`](./src/is-subset/is-subset.md), [`isSuperset`](./src/is-superset/is-superset.md), [`isDisjoint`](./src/is-disjoint/is-disjoint.md), [`isEqualArray`](./src/is-equal-array/is-equal-array.md), [`isPermutationOf`](./src/is-permutation-of/is-permutation-of.md), [`isUnique`](./src/is-unique/is-unique.md), [`findDuplicateItems`](./src/find-duplicate-items/find-duplicate-items.md), [`findDuplicateIndexes`](./src/find-duplicate-indexes/find-duplicate-indexes.md)

Set results keep the first-seen order, left to right. When both `by` and `equals` are passed, `by` wins and the extracted keys use SameValueZero.

### Sort and search

[`sortBy`](./src/sort-by/sort-by.md), [`sortNatural`](./src/sort-natural/sort-natural.md), [`createComparator`](./src/create-comparator/create-comparator.md), [`isSorted`](./src/is-sorted/is-sorted.md), [`getSortedInsertIndex`](./src/get-sorted-insert-index/get-sorted-insert-index.md), [`getSortedLastInsertIndex`](./src/get-sorted-last-insert-index/get-sorted-last-insert-index.md), [`binarySearch`](./src/binary-search/binary-search.md), [`insertSorted`](./src/insert-sorted/insert-sorted.md), [`mergeSorted`](./src/merge-sorted/merge-sorted.md), [`getUniqueSorted`](./src/get-unique-sorted/get-unique-sorted.md)

`sortBy` is stable. Later keys break ties. `createComparator` calls a function key with index `0` and a one-element array, because a comparator does not know the source array. `sortBy` passes the real index and the source array.

### Immutable updates

[`insertItem`](./src/insert-item/insert-item.md), [`insertItems`](./src/insert-items/insert-items.md), [`removeAt`](./src/remove-at/remove-at.md), [`removeAtIndexes`](./src/remove-at-indexes/remove-at-indexes.md), [`removeItems`](./src/remove-items/remove-items.md), [`updateAt`](./src/update-at/update-at.md), [`updateWhere`](./src/update-where/update-where.md), [`setAt`](./src/set-at/set-at.md), [`moveItem`](./src/move-item/move-item.md), [`swapItems`](./src/swap-items/swap-items.md), [`rotateItems`](./src/rotate-items/rotate-items.md), [`fillRange`](./src/fill-range/fill-range.md), [`replaceItem`](./src/replace-item/replace-item.md), [`toggleItem`](./src/toggle-item/toggle-item.md), [`intersperse`](./src/intersperse/intersperse.md), [`padArrayStart`](./src/pad-array-start/pad-array-start.md), [`padArrayEnd`](./src/pad-array-end/pad-array-end.md)

Out-of-range indexes return `undefined`. `insertItem` allows `index === array.length`. A function passed as `updateAt`'s `updater` is called. Pass `() => fn` when the stored value itself should be a function.

### Zip, flatten, and reshape

[`zip`](./src/zip/zip.md), [`zipWith`](./src/zip-with/zip-with.md), [`unzip`](./src/unzip/unzip.md), [`unzipWith`](./src/unzip-with/unzip-with.md), [`zipToObject`](./src/zip-to-object/zip-to-object.md), [`flatten`](./src/flatten/flatten.md), [`flattenDeep`](./src/flatten-deep/flatten-deep.md), [`flattenTree`](./src/flatten-tree/flatten-tree.md), [`transpose`](./src/transpose/transpose.md), [`interleave`](./src/interleave/interleave.md), [`concatArrays`](./src/concat-arrays/concat-arrays.md), [`joinItems`](./src/join-items/join-items.md)

`flatten` walks arrays only. A cycle in `flattenTree` skips a node already on the current path.

### Generate, sample, and aggregate

[`createRange`](./src/create-range/create-range.md), [`createTimes`](./src/create-times/create-times.md), [`repeatItem`](./src/repeat-item/repeat-item.md), [`repeatArray`](./src/repeat-array/repeat-array.md), [`cycleItems`](./src/cycle-items/cycle-items.md), [`shuffleItems`](./src/shuffle-items/shuffle-items.md), [`sampleItem`](./src/sample-item/sample-item.md), [`sampleItems`](./src/sample-items/sample-items.md), [`sampleWeighted`](./src/sample-weighted/sample-weighted.md), [`getSum`](./src/get-sum/get-sum.md), [`getProduct`](./src/get-product/get-product.md), [`getMin`](./src/get-min/get-min.md), [`getMax`](./src/get-max/get-max.md), [`getBestItem`](./src/get-best-item/get-best-item.md), [`getExtent`](./src/get-extent/get-extent.md), [`getMean`](./src/get-mean/get-mean.md), [`getMedian`](./src/get-median/get-median.md), [`getMode`](./src/get-mode/get-mode.md), [`getPercentile`](./src/get-percentile/get-percentile.md), [`getVariance`](./src/get-variance/get-variance.md), [`getStandardDeviation`](./src/get-standard-deviation/get-standard-deviation.md), [`getFrequencies`](./src/get-frequencies/get-frequencies.md), [`binItems`](./src/bin-items/bin-items.md), [`getRunningTotals`](./src/get-running-totals/get-running-totals.md), [`getWindowAggregates`](./src/get-window-aggregates/get-window-aggregates.md)

An empty array makes `getSum` return `0` and `getProduct` return `1`. The other aggregators return `undefined` when there is nothing to compute. `getSum`, `getMean`, and the other numeric reducers throw `TypeError` when an item is not a finite number and `by` is omitted.

### Pagination and diff

[`paginate`](./src/paginate/paginate.md), [`getPageItems`](./src/get-page-items/get-page-items.md), [`getOffsetItems`](./src/get-offset-items/get-offset-items.md), [`diffArrays`](./src/diff-arrays/diff-arrays.md), [`diffArraysByKey`](./src/diff-arrays-by-key/diff-arrays-by-key.md), [`diffArraySequence`](./src/diff-array-sequence/diff-array-sequence.md), [`applyArrayPatch`](./src/apply-array-patch/apply-array-patch.md), [`getLongestCommonSubsequence`](./src/get-longest-common-subsequence/get-longest-common-subsequence.md), [`getLongestCommonPrefix`](./src/get-longest-common-prefix/get-longest-common-prefix.md), [`getLongestCommonSuffix`](./src/get-longest-common-suffix/get-longest-common-suffix.md)

`page` is 1-based. A page past the end of a real array returns an empty `items` list and accurate metadata.

### Async and combinatorics

[`mapAsync`](./src/map-async/map-async.md), [`filterAsync`](./src/filter-async/filter-async.md), [`flatMapAsync`](./src/flat-map-async/flat-map-async.md), [`reduceAsync`](./src/reduce-async/reduce-async.md), [`forEachAsync`](./src/for-each-async/for-each-async.md), [`findAsync`](./src/find-async/find-async.md), [`someAsync`](./src/some-async/some-async.md), [`everyAsync`](./src/every-async/every-async.md), [`mapAsyncSettled`](./src/map-async-settled/map-async-settled.md), [`createAsyncArray`](./src/create-async-array/create-async-array.md), [`getCartesianProduct`](./src/get-cartesian-product/get-cartesian-product.md), [`getCombinations`](./src/get-combinations/get-combinations.md), [`getPermutations`](./src/get-permutations/get-permutations.md), [`getPowerSet`](./src/get-power-set/get-power-set.md), [`getPairs`](./src/get-pairs/get-pairs.md), [`createCombinatorics`](./src/create-combinatorics/create-combinatorics.md)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="throws">⚠️ Functions that throw</h2>

`is*` and `has*` do not throw. A bad array returns `undefined` for synchronous functions and rejects the promise for async functions.

| Function                                                                                                                               | Error                       | Why                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `findIndexes`, `takeWhile`, `takeLastWhile`, `dropWhile`, `dropLastWhile`, `splitWhen`, `rejectItems`, `partition`, `updateWhere`      | `TypeError`                 | `predicate` is not a function                                                                                                                                                |
| `chunkBy`, `groupBy`, `countBy`, `indexBy`, `getUniqueItemsBy`, and other `by` parameters                                              | `TypeError`                 | `by` is not a property key or a function                                                                                                                                     |
| `groupByKeys`                                                                                                                          | `TypeError`                 | `keys` is not an array, or a key is not an iteratee                                                                                                                          |
| `partitionBy`                                                                                                                          | `TypeError`                 | `predicates` is not an array of functions                                                                                                                                    |
| `sortBy`, `createComparator`                                                                                                           | `TypeError`                 | `keys` is not an array, a key is not an iteratee, or `numeric` / `locale` has the wrong type                                                                                 |
| `sortBy`, `sortNatural`, `createComparator`, `isSorted` is exempt                                                                      | `RangeError`                | `direction`, `sensitivity`, `nulls`, or `locale` is not a usable value. `isSorted` returns `false` instead of throwing                                                       |
| `indexBy`                                                                                                                              | `RangeError`                | `onConflict` is unknown, or it is `"throw"` and a key repeats                                                                                                                |
| `getUniqueItems` and other `keep` parameters                                                                                           | `RangeError`                | `keep` is not `"first"` or `"last"`                                                                                                                                          |
| `take`, `takeLast`, `drop`, `dropLast`, `removeAt`                                                                                     | `TypeError` or `RangeError` | `count` is not a finite integer greater than or equal to 0                                                                                                                   |
| `chunk`, `createWindows`, `getWindowAggregates`                                                                                        | `TypeError` or `RangeError` | `size` or `step` is not a positive finite integer                                                                                                                            |
| `sliceArray`, `fillRange`, `splitAt`                                                                                                   | `RangeError`                | `start`, `end`, or `index` is not finite when a number is required                                                                                                           |
| `insertItems`                                                                                                                          | `TypeError`                 | `items` is not an array                                                                                                                                                      |
| `getItemsAt`, `removeAtIndexes`                                                                                                        | `TypeError`                 | `indexes` is not an array                                                                                                                                                    |
| `removeItems`                                                                                                                          | `TypeError`                 | neither `predicate` nor `values` is provided, or either has the wrong type                                                                                                   |
| `toggleItem`                                                                                                                           | `RangeError`                | `placement` is not `"start"` or `"end"`                                                                                                                                      |
| `rotateItems`, `padArrayStart`, `padArrayEnd`                                                                                          | `TypeError` or `RangeError` | `count` or `length` is not a usable integer                                                                                                                                  |
| `zip`, `zipWith`                                                                                                                       | `RangeError`                | `mode` is unknown, or `mode` is `"strict"` and the arrays differ in length                                                                                                   |
| `zipWith`, `unzipWith`, `joinItems`, `createTimes`                                                                                     | `TypeError`                 | `combine`, `format`, or `mapper` is not a function                                                                                                                           |
| `zipToObject`                                                                                                                          | `TypeError`                 | `keys` is not an array, or `values` is neither an array nor a function                                                                                                       |
| `flatten`                                                                                                                              | `TypeError` or `RangeError` | `depth` is not a finite integer greater than or equal to 0                                                                                                                   |
| `createRange`                                                                                                                          | `TypeError` or `RangeError` | a bound is not a finite number, `step` is `0`, or the range would not be finite                                                                                              |
| `repeatItem`, `repeatArray`, `cycleItems`, `createTimes`                                                                               | `TypeError` or `RangeError` | `count` is not a finite integer greater than or equal to 0                                                                                                                   |
| `shuffleItems`, `sampleItem`, `sampleItems`, `sampleWeighted`                                                                          | `TypeError` or `RangeError` | `random` is not a function, `random` returns a number outside `[0, 1)`, or `seed` is not finite                                                                              |
| `sampleItems`, `sampleWeighted`                                                                                                        | `RangeError`                | `count` is unusable, larger than the array, or larger than the number of positive weights. A negative or non-finite weight also throws. Every weight `0` returns `undefined` |
| `getSum`, `getProduct`, `getMean`, `getMedian`, `getPercentile`, `getVariance`, `getStandardDeviation`, `getRunningTotals`, `binItems` | `TypeError`                 | an item is not a finite number and `by` does not return one. `getMin` and `getMax` compare with `<` when `by` is omitted and do not throw for that                           |
| `getPercentile`                                                                                                                        | `RangeError`                | `percentile` is outside 0–100, or `method` is unknown                                                                                                                        |
| `getVariance`, `getStandardDeviation`, `getWindowAggregates`                                                                           | `TypeError`                 | `sample` or `partial` is not a boolean, when that check applies                                                                                                              |
| `binItems`                                                                                                                             | `RangeError`                | both or neither of `binCount` and `binWidth` are set, or a bound is not positive and finite                                                                                  |
| `getWindowAggregates`                                                                                                                  | `RangeError`                | `aggregate` is not `"sum"`, `"mean"`, `"min"`, `"max"`, or a function                                                                                                        |
| `paginate`, `getPageItems`                                                                                                             | `RangeError`                | `page` is not an integer greater than or equal to 1, or `pageSize` is not a positive integer                                                                                 |
| `getOffsetItems`                                                                                                                       | `RangeError`                | `offset` or `limit` is not a finite integer greater than or equal to 0                                                                                                       |
| `getBestItem`                                                                                                                          | `TypeError`                 | `isBetter` is not a function                                                                                                                                                 |
| `applyArrayPatch`                                                                                                                      | `TypeError`                 | `patch` is not an array, a run `type` is unknown, or a run's `items` is not an array. A patch that does not match the array returns `undefined`                              |
| `equals` on non-`is*` helpers                                                                                                          | `TypeError`                 | `equals` is present and is not a function. `is*` returns `false` instead                                                                                                     |
| `getCombinations`, `getPermutations`                                                                                                   | `RangeError`                | `size` is not a finite integer greater than or equal to 0                                                                                                                    |
| `mapAsync`, `filterAsync`, `flatMapAsync`, `forEachAsync`, `findAsync`, `someAsync`, `everyAsync`, `mapAsyncSettled`, `reduceAsync`    | `TypeError` or `RangeError` | `array` is not an array, the worker is not a function, or `concurrency` is not a positive integer or `Infinity`. An aborted `signal` rejects with `signal.reason`            |
| `createArray`, `createAsyncArray`, `createCombinatorics`                                                                               | `TypeError` or `RangeError` | `config` is not an object, or a field has the wrong type or an unusable value                                                                                                |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="runtime-support">🌐 Runtime support</h2>

Runtime: `universal`. The same source runs in current browsers, workers, and Node. It uses `Intl.Collator` for locale-aware and natural sort, and the platform's copy methods (`toSorted`, `toSpliced`, `toReversed`, `with`). There are no runtime dependencies and no polyfills.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="contributing">🤝 Contributing</h2>

Repository rules are in [CONTRIBUTING.md](../../CONTRIBUTING.md).

Owner: `@sgx4u`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="license">📄 License</h2>

[MIT](../../LICENSE) © 2026 Subhajit Ghosh

<p align="right">(<a href="#readme-top">back to top</a>)</p>
