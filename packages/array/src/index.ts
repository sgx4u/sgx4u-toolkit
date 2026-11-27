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

export { compact } from "./compact/compact.js";
export type { Falsy } from "./compact/compact.types.js";
export { compactNullish } from "./compact-nullish/compact-nullish.js";
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
export { findIndexes } from "./find-indexes/find-indexes.js";
export type { FindIndexesParams } from "./find-indexes/find-indexes.types.js";
export { getAt } from "./get-at/get-at.js";
export type { GetAtParams } from "./get-at/get-at.types.js";
export { getFirst } from "./get-first/get-first.js";
export type { GetFirstParams } from "./get-first/get-first.types.js";
export type {
    FrequencyEntry,
    GetFrequenciesParams,
export { getIndexOf } from "./get-index-of/get-index-of.js";
export type { GetIndexOfParams } from "./get-index-of/get-index-of.types.js";
export { getInitial } from "./get-initial/get-initial.js";
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
export { getTail } from "./get-tail/get-tail.js";
export type {
    UniqueKeep,
    GetUniqueItemsParams,
export type {
    WindowAggregateName,
    GetWindowAggregatesParams,
export { hasAtLeast } from "./has-at-least/has-at-least.js";
export type { HasAtLeastParams } from "./has-at-least/has-at-least.types.js";
export type {
    IndexByConflict,
    IndexByParams,
export { isArrayLike } from "./is-array-like/is-array-like.js";
export { isEmptyArray } from "./is-empty-array/is-empty-array.js";
export { isNonEmptyArray } from "./is-non-empty-array/is-non-empty-array.js";
export { isTypedArray } from "./is-typed-array/is-typed-array.js";
export { rejectItems } from "./reject-items/reject-items.js";
export type { RejectItemsParams } from "./reject-items/reject-items.types.js";
export { sliceArray } from "./slice-array/slice-array.js";
export type { SliceArrayParams } from "./slice-array/slice-array.types.js";
export { splitAt } from "./split-at/split-at.js";
export type { SplitAtParams } from "./split-at/split-at.types.js";
export { splitWhen } from "./split-when/split-when.js";
export type { SplitWhenParams } from "./split-when/split-when.types.js";
export { take } from "./take/take.js";
export type { TakeParams } from "./take/take.types.js";
export { takeLast } from "./take-last/take-last.js";
export type { TakeLastParams } from "./take-last/take-last.types.js";
export { takeLastWhile } from "./take-last-while/take-last-while.js";
export type { TakeLastWhileParams } from "./take-last-while/take-last-while.types.js";
export { takeWhile } from "./take-while/take-while.js";
export type { TakeWhileParams } from "./take-while/take-while.types.js";
export { toArray } from "./to-array/to-array.js";
export type {
    TogglePlacement,
    ToggleItemParams,
