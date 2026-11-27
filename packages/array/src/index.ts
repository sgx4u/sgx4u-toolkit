/**
 * Public entry for `@sgx4u/array`. Re-exports only.
 */
export type { Iteratee, Predicate } from "./types/iteratee.types.js";
export type { Equals } from "./types/equals.types.js";
export type { NonEmptyArray } from "./types/non-empty-array.types.js";
export type { Direction, SortKey } from "./types/sort.types.js";
export type { PageResult } from "./types/page.types.js";
export type { ArrayPatch, KeyedArrayDiff } from "./types/patch.types.js";
export type { HistogramBin, WindowAggregate } from "./types/aggregate.types.js";
export type { ArrayConfig } from "./types/config.types.js";

export { binarySearch } from "./binary-search/binary-search.js";
export type { BinarySearchParams } from "./binary-search/binary-search.types.js";
export { chunk } from "./chunk/chunk.js";
export type { ChunkParams } from "./chunk/chunk.types.js";
export { chunkBy } from "./chunk-by/chunk-by.js";
export type { ChunkByParams } from "./chunk-by/chunk-by.types.js";
export { compact } from "./compact/compact.js";
export type { Falsy } from "./compact/compact.types.js";
export { compactNullish } from "./compact-nullish/compact-nullish.js";
export { countBy } from "./count-by/count-by.js";
export type { CountByParams } from "./count-by/count-by.types.js";
export { countOccurrences } from "./count-occurrences/count-occurrences.js";
export type { CountOccurrencesParams } from "./count-occurrences/count-occurrences.types.js";
export { createComparator } from "./create-comparator/create-comparator.js";
export type { CreateComparatorParams } from "./create-comparator/create-comparator.types.js";
export { createWindows } from "./create-windows/create-windows.js";
export type { CreateWindowsParams } from "./create-windows/create-windows.types.js";
export type {
    ArrayMultisetDiff,
    DiffArraysParams,
export { drop } from "./drop/drop.js";
export type { DropParams } from "./drop/drop.types.js";
export { dropLast } from "./drop-last/drop-last.js";
export type { DropLastParams } from "./drop-last/drop-last.types.js";
export { dropLastWhile } from "./drop-last-while/drop-last-while.js";
export type { DropLastWhileParams } from "./drop-last-while/drop-last-while.types.js";
export { dropWhile } from "./drop-while/drop-while.js";
export type { DropWhileParams } from "./drop-while/drop-while.types.js";
export { ensureArray } from "./ensure-array/ensure-array.js";
export { fillRange } from "./fill-range/fill-range.js";
export type { FillRangeParams } from "./fill-range/fill-range.types.js";
export { findDuplicateIndexes } from "./find-duplicate-indexes/find-duplicate-indexes.js";
export type { FindDuplicateIndexesParams } from "./find-duplicate-indexes/find-duplicate-indexes.types.js";
export { findDuplicateItems } from "./find-duplicate-items/find-duplicate-items.js";
export type { FindDuplicateItemsParams } from "./find-duplicate-items/find-duplicate-items.types.js";
export { findIndexes } from "./find-indexes/find-indexes.js";
export type { FindIndexesParams } from "./find-indexes/find-indexes.types.js";
export { getAt } from "./get-at/get-at.js";
export type { GetAtParams } from "./get-at/get-at.types.js";
export { getDifference } from "./get-difference/get-difference.js";
export type { GetDifferenceParams } from "./get-difference/get-difference.types.js";
export { getFirst } from "./get-first/get-first.js";
export type { GetFirstParams } from "./get-first/get-first.types.js";
export type {
    FrequencyEntry,
    GetFrequenciesParams,
export { getIndexOf } from "./get-index-of/get-index-of.js";
export type { GetIndexOfParams } from "./get-index-of/get-index-of.types.js";
export { getInitial } from "./get-initial/get-initial.js";
export { getIntersection } from "./get-intersection/get-intersection.js";
export type { GetIntersectionParams } from "./get-intersection/get-intersection.types.js";
export { getItemsAt } from "./get-items-at/get-items-at.js";
export type { GetItemsAtParams } from "./get-items-at/get-items-at.types.js";
export { getLast } from "./get-last/get-last.js";
export type { GetLastParams } from "./get-last/get-last.types.js";
export { getLastIndexOf } from "./get-last-index-of/get-last-index-of.js";
export type { GetLastIndexOfParams } from "./get-last-index-of/get-last-index-of.types.js";
export { getLength } from "./get-length/get-length.js";
export type {
    PercentileMethod,
    GetPercentileParams,
export { getSortedInsertIndex } from "./get-sorted-insert-index/get-sorted-insert-index.js";
export type { GetSortedInsertIndexParams } from "./get-sorted-insert-index/get-sorted-insert-index.types.js";
export { getSortedLastInsertIndex } from "./get-sorted-last-insert-index/get-sorted-last-insert-index.js";
export type { GetSortedLastInsertIndexParams } from "./get-sorted-last-insert-index/get-sorted-last-insert-index.types.js";
export { getSymmetricDifference } from "./get-symmetric-difference/get-symmetric-difference.js";
export type { GetSymmetricDifferenceParams } from "./get-symmetric-difference/get-symmetric-difference.types.js";
export { getTail } from "./get-tail/get-tail.js";
export { getUnion } from "./get-union/get-union.js";
export type { GetUnionParams } from "./get-union/get-union.types.js";
export { getUniqueItems } from "./get-unique-items/get-unique-items.js";
export type {
    UniqueKeep,
    GetUniqueItemsParams,
} from "./get-unique-items/get-unique-items.types.js";
export { getUniqueItemsBy } from "./get-unique-items-by/get-unique-items-by.js";
export type { GetUniqueItemsByParams } from "./get-unique-items-by/get-unique-items-by.types.js";
export { getUniqueSorted } from "./get-unique-sorted/get-unique-sorted.js";
export type { GetUniqueSortedParams } from "./get-unique-sorted/get-unique-sorted.types.js";
export type {
    WindowAggregateName,
    GetWindowAggregatesParams,
export { groupBy } from "./group-by/group-by.js";
export type { GroupByParams } from "./group-by/group-by.types.js";
export { groupByKeys } from "./group-by-keys/group-by-keys.js";
export type { GroupByKeysParams } from "./group-by-keys/group-by-keys.types.js";
export { hasAtLeast } from "./has-at-least/has-at-least.js";
export type { HasAtLeastParams } from "./has-at-least/has-at-least.types.js";
export { indexBy } from "./index-by/index-by.js";
export type {
    IndexByConflict,
    IndexByParams,
} from "./index-by/index-by.types.js";
export { insertItem } from "./insert-item/insert-item.js";
export type { InsertItemParams } from "./insert-item/insert-item.types.js";
export { insertItems } from "./insert-items/insert-items.js";
export type { InsertItemsParams } from "./insert-items/insert-items.types.js";
export { insertSorted } from "./insert-sorted/insert-sorted.js";
export type { InsertSortedParams } from "./insert-sorted/insert-sorted.types.js";
export { intersperse } from "./intersperse/intersperse.js";
export type { IntersperseParams } from "./intersperse/intersperse.types.js";
export { isArrayLike } from "./is-array-like/is-array-like.js";
export { isDisjoint } from "./is-disjoint/is-disjoint.js";
export type { IsDisjointParams } from "./is-disjoint/is-disjoint.types.js";
export { isEmptyArray } from "./is-empty-array/is-empty-array.js";
export { isEqualArray } from "./is-equal-array/is-equal-array.js";
export type { IsEqualArrayParams } from "./is-equal-array/is-equal-array.types.js";
export { isNonEmptyArray } from "./is-non-empty-array/is-non-empty-array.js";
export { isPermutationOf } from "./is-permutation-of/is-permutation-of.js";
export type { IsPermutationOfParams } from "./is-permutation-of/is-permutation-of.types.js";
export { isSorted } from "./is-sorted/is-sorted.js";
export type { IsSortedParams } from "./is-sorted/is-sorted.types.js";
export { isSubset } from "./is-subset/is-subset.js";
export type { IsSubsetParams } from "./is-subset/is-subset.types.js";
export { isSuperset } from "./is-superset/is-superset.js";
export type { IsSupersetParams } from "./is-superset/is-superset.types.js";
export { isTypedArray } from "./is-typed-array/is-typed-array.js";
export { isUnique } from "./is-unique/is-unique.js";
export type { IsUniqueParams } from "./is-unique/is-unique.types.js";
export { mergeSorted } from "./merge-sorted/merge-sorted.js";
export type { MergeSortedParams } from "./merge-sorted/merge-sorted.types.js";
export { moveItem } from "./move-item/move-item.js";
export type { MoveItemParams } from "./move-item/move-item.types.js";
export { padArrayEnd } from "./pad-array-end/pad-array-end.js";
export type { PadArrayEndParams } from "./pad-array-end/pad-array-end.types.js";
export { padArrayStart } from "./pad-array-start/pad-array-start.js";
export type { PadArrayStartParams } from "./pad-array-start/pad-array-start.types.js";
export { partition } from "./partition/partition.js";
export type { PartitionParams } from "./partition/partition.types.js";
export { partitionBy } from "./partition-by/partition-by.js";
export type { PartitionByParams } from "./partition-by/partition-by.types.js";
export { rejectItems } from "./reject-items/reject-items.js";
export type { RejectItemsParams } from "./reject-items/reject-items.types.js";
export { removeAt } from "./remove-at/remove-at.js";
export type { RemoveAtParams } from "./remove-at/remove-at.types.js";
export { removeAtIndexes } from "./remove-at-indexes/remove-at-indexes.js";
export type { RemoveAtIndexesParams } from "./remove-at-indexes/remove-at-indexes.types.js";
export { removeItems } from "./remove-items/remove-items.js";
export type { RemoveItemsParams } from "./remove-items/remove-items.types.js";
export { replaceItem } from "./replace-item/replace-item.js";
export type { ReplaceItemParams } from "./replace-item/replace-item.types.js";
export { rotateItems } from "./rotate-items/rotate-items.js";
export type { RotateItemsParams } from "./rotate-items/rotate-items.types.js";
export { setAt } from "./set-at/set-at.js";
export type { SetAtParams } from "./set-at/set-at.types.js";
export { sliceArray } from "./slice-array/slice-array.js";
export type { SliceArrayParams } from "./slice-array/slice-array.types.js";
export { sortBy } from "./sort-by/sort-by.js";
export type { SortByParams } from "./sort-by/sort-by.types.js";
export { sortNatural } from "./sort-natural/sort-natural.js";
export type { SortNaturalParams } from "./sort-natural/sort-natural.types.js";
export { splitAt } from "./split-at/split-at.js";
export type { SplitAtParams } from "./split-at/split-at.types.js";
export { splitWhen } from "./split-when/split-when.js";
export type { SplitWhenParams } from "./split-when/split-when.types.js";
export { swapItems } from "./swap-items/swap-items.js";
export type { SwapItemsParams } from "./swap-items/swap-items.types.js";
export { take } from "./take/take.js";
export type { TakeParams } from "./take/take.types.js";
export { takeLast } from "./take-last/take-last.js";
export type { TakeLastParams } from "./take-last/take-last.types.js";
export { takeLastWhile } from "./take-last-while/take-last-while.js";
export type { TakeLastWhileParams } from "./take-last-while/take-last-while.types.js";
export { takeWhile } from "./take-while/take-while.js";
export type { TakeWhileParams } from "./take-while/take-while.types.js";
export { toArray } from "./to-array/to-array.js";
export { toggleItem } from "./toggle-item/toggle-item.js";
export type {
    TogglePlacement,
    ToggleItemParams,
} from "./toggle-item/toggle-item.types.js";
export { updateAt } from "./update-at/update-at.js";
export type { UpdateAtParams } from "./update-at/update-at.types.js";
export { updateWhere } from "./update-where/update-where.js";
export type { UpdateWhereParams } from "./update-where/update-where.types.js";
export { withoutValues } from "./without-values/without-values.js";
export type { WithoutValuesParams } from "./without-values/without-values.types.js";
