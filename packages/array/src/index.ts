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

export type {
    ArrayMultisetDiff,
    DiffArraysParams,
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
export { toArray } from "./to-array/to-array.js";
export type {
    TogglePlacement,
    ToggleItemParams,
