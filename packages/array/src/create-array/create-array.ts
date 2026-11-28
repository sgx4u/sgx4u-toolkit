import type { ArrayConfig } from "../types/config.types.js";
import {
    assignConfigDefaults,
    resolveArrayConfig,
    type ResolvedArrayConfig,
} from "../utils/config.utils.js";
import { applyArrayPatch } from "../apply-array-patch/apply-array-patch.js";
import { binItems } from "../bin-items/bin-items.js";
import { binarySearch } from "../binary-search/binary-search.js";
import { chunk } from "../chunk/chunk.js";
import { chunkBy } from "../chunk-by/chunk-by.js";
import { compact } from "../compact/compact.js";
import { compactNullish } from "../compact-nullish/compact-nullish.js";
import { concatArrays } from "../concat-arrays/concat-arrays.js";
import { countBy } from "../count-by/count-by.js";
import { countOccurrences } from "../count-occurrences/count-occurrences.js";
import { createComparator } from "../create-comparator/create-comparator.js";
import { createRange } from "../create-range/create-range.js";
import { createTimes } from "../create-times/create-times.js";
import { createWindows } from "../create-windows/create-windows.js";
import { cycleItems } from "../cycle-items/cycle-items.js";
import { diffArraySequence } from "../diff-array-sequence/diff-array-sequence.js";
import { diffArrays } from "../diff-arrays/diff-arrays.js";
import { diffArraysByKey } from "../diff-arrays-by-key/diff-arrays-by-key.js";
import { drop } from "../drop/drop.js";
import { dropLast } from "../drop-last/drop-last.js";
import { dropLastWhile } from "../drop-last-while/drop-last-while.js";
import { dropWhile } from "../drop-while/drop-while.js";
import { ensureArray } from "../ensure-array/ensure-array.js";
import { fillRange } from "../fill-range/fill-range.js";
import { findDuplicateIndexes } from "../find-duplicate-indexes/find-duplicate-indexes.js";
import { findDuplicateItems } from "../find-duplicate-items/find-duplicate-items.js";
import { findIndexes } from "../find-indexes/find-indexes.js";
import { flatten } from "../flatten/flatten.js";
import { flattenDeep } from "../flatten-deep/flatten-deep.js";
import { flattenTree } from "../flatten-tree/flatten-tree.js";
import { getAt } from "../get-at/get-at.js";
import { getBestItem } from "../get-best-item/get-best-item.js";
import { getDifference } from "../get-difference/get-difference.js";
import { getExtent } from "../get-extent/get-extent.js";
import { getFirst } from "../get-first/get-first.js";
import { getFrequencies } from "../get-frequencies/get-frequencies.js";
import { getIndexOf } from "../get-index-of/get-index-of.js";
import { getInitial } from "../get-initial/get-initial.js";
import { getIntersection } from "../get-intersection/get-intersection.js";
import { getItemsAt } from "../get-items-at/get-items-at.js";
import { getLast } from "../get-last/get-last.js";
import { getLastIndexOf } from "../get-last-index-of/get-last-index-of.js";
import { getLength } from "../get-length/get-length.js";
import { getLongestCommonPrefix } from "../get-longest-common-prefix/get-longest-common-prefix.js";
import { getLongestCommonSubsequence } from "../get-longest-common-subsequence/get-longest-common-subsequence.js";
import { getLongestCommonSuffix } from "../get-longest-common-suffix/get-longest-common-suffix.js";
import { getMax } from "../get-max/get-max.js";
import { getMean } from "../get-mean/get-mean.js";
import { getMedian } from "../get-median/get-median.js";
import { getMin } from "../get-min/get-min.js";
import { getMode } from "../get-mode/get-mode.js";
import { getOffsetItems } from "../get-offset-items/get-offset-items.js";
import { getPageItems } from "../get-page-items/get-page-items.js";
import { getPercentile } from "../get-percentile/get-percentile.js";
import { getProduct } from "../get-product/get-product.js";
import { getRunningTotals } from "../get-running-totals/get-running-totals.js";
import { getSortedInsertIndex } from "../get-sorted-insert-index/get-sorted-insert-index.js";
import { getSortedLastInsertIndex } from "../get-sorted-last-insert-index/get-sorted-last-insert-index.js";
import { getStandardDeviation } from "../get-standard-deviation/get-standard-deviation.js";
import { getSum } from "../get-sum/get-sum.js";
import { getSymmetricDifference } from "../get-symmetric-difference/get-symmetric-difference.js";
import { getTail } from "../get-tail/get-tail.js";
import { getUnion } from "../get-union/get-union.js";
import { getUniqueItems } from "../get-unique-items/get-unique-items.js";
import { getUniqueItemsBy } from "../get-unique-items-by/get-unique-items-by.js";
import { getUniqueSorted } from "../get-unique-sorted/get-unique-sorted.js";
import { getVariance } from "../get-variance/get-variance.js";
import { getWindowAggregates } from "../get-window-aggregates/get-window-aggregates.js";
import { groupBy } from "../group-by/group-by.js";
import { groupByKeys } from "../group-by-keys/group-by-keys.js";
import { hasAtLeast } from "../has-at-least/has-at-least.js";
import { indexBy } from "../index-by/index-by.js";
import { insertItem } from "../insert-item/insert-item.js";
import { insertItems } from "../insert-items/insert-items.js";
import { insertSorted } from "../insert-sorted/insert-sorted.js";
import { interleave } from "../interleave/interleave.js";
import { intersperse } from "../intersperse/intersperse.js";
import { isArrayLike } from "../is-array-like/is-array-like.js";
import { isDisjoint } from "../is-disjoint/is-disjoint.js";
import { isEmptyArray } from "../is-empty-array/is-empty-array.js";
import { isEqualArray } from "../is-equal-array/is-equal-array.js";
import { isNonEmptyArray } from "../is-non-empty-array/is-non-empty-array.js";
import { isPermutationOf } from "../is-permutation-of/is-permutation-of.js";
import { isSorted } from "../is-sorted/is-sorted.js";
import { isSubset } from "../is-subset/is-subset.js";
import { isSuperset } from "../is-superset/is-superset.js";
import { isTypedArray } from "../is-typed-array/is-typed-array.js";
import { isUnique } from "../is-unique/is-unique.js";
import { joinItems } from "../join-items/join-items.js";
import { mergeSorted } from "../merge-sorted/merge-sorted.js";
import { moveItem } from "../move-item/move-item.js";
import { padArrayEnd } from "../pad-array-end/pad-array-end.js";
import { padArrayStart } from "../pad-array-start/pad-array-start.js";
import { paginate } from "../paginate/paginate.js";
import { partition } from "../partition/partition.js";
import { partitionBy } from "../partition-by/partition-by.js";
import { rejectItems } from "../reject-items/reject-items.js";
import { removeAt } from "../remove-at/remove-at.js";
import { removeAtIndexes } from "../remove-at-indexes/remove-at-indexes.js";
import { removeItems } from "../remove-items/remove-items.js";
import { repeatArray } from "../repeat-array/repeat-array.js";
import { repeatItem } from "../repeat-item/repeat-item.js";
import { replaceItem } from "../replace-item/replace-item.js";
import { rotateItems } from "../rotate-items/rotate-items.js";
import { sampleItem } from "../sample-item/sample-item.js";
import { sampleItems } from "../sample-items/sample-items.js";
import { sampleWeighted } from "../sample-weighted/sample-weighted.js";
import { setAt } from "../set-at/set-at.js";
import { shuffleItems } from "../shuffle-items/shuffle-items.js";
import { sliceArray } from "../slice-array/slice-array.js";
import { sortBy } from "../sort-by/sort-by.js";
import { sortNatural } from "../sort-natural/sort-natural.js";
import { splitAt } from "../split-at/split-at.js";
import { splitWhen } from "../split-when/split-when.js";
import { swapItems } from "../swap-items/swap-items.js";
import { take } from "../take/take.js";
import { takeLast } from "../take-last/take-last.js";
import { takeLastWhile } from "../take-last-while/take-last-while.js";
import { takeWhile } from "../take-while/take-while.js";
import { toArray } from "../to-array/to-array.js";
import { toggleItem } from "../toggle-item/toggle-item.js";
import { transpose } from "../transpose/transpose.js";
import { unzip } from "../unzip/unzip.js";
import { unzipWith } from "../unzip-with/unzip-with.js";
import { updateAt } from "../update-at/update-at.js";
import { updateWhere } from "../update-where/update-where.js";
import { withoutValues } from "../without-values/without-values.js";
import { zip } from "../zip/zip.js";
import { zipToObject } from "../zip-to-object/zip-to-object.js";
import { zipWith } from "../zip-with/zip-with.js";

/**
 * Every root function, with instance defaults already applied.
 *
 * Config fields stay optional on each method. A per-call value replaces the
 * instance value. `createArray` itself is not included.
 */
export interface ArrayToolkit {
    readonly applyArrayPatch: typeof applyArrayPatch;
    readonly binItems: typeof binItems;
    readonly binarySearch: typeof binarySearch;
    readonly chunk: typeof chunk;
    readonly chunkBy: typeof chunkBy;
    readonly compact: typeof compact;
    readonly compactNullish: typeof compactNullish;
    readonly concatArrays: typeof concatArrays;
    readonly countBy: typeof countBy;
    readonly countOccurrences: typeof countOccurrences;
    readonly createComparator: typeof createComparator;
    readonly createRange: typeof createRange;
    readonly createTimes: typeof createTimes;
    readonly createWindows: typeof createWindows;
    readonly cycleItems: typeof cycleItems;
    readonly diffArraySequence: typeof diffArraySequence;
    readonly diffArrays: typeof diffArrays;
    readonly diffArraysByKey: typeof diffArraysByKey;
    readonly drop: typeof drop;
    readonly dropLast: typeof dropLast;
    readonly dropLastWhile: typeof dropLastWhile;
    readonly dropWhile: typeof dropWhile;
    readonly ensureArray: typeof ensureArray;
    readonly fillRange: typeof fillRange;
    readonly findDuplicateIndexes: typeof findDuplicateIndexes;
    readonly findDuplicateItems: typeof findDuplicateItems;
    readonly findIndexes: typeof findIndexes;
    readonly flatten: typeof flatten;
    readonly flattenDeep: typeof flattenDeep;
    readonly flattenTree: typeof flattenTree;
    readonly getAt: typeof getAt;
    readonly getBestItem: typeof getBestItem;
    readonly getDifference: typeof getDifference;
    readonly getExtent: typeof getExtent;
    readonly getFirst: typeof getFirst;
    readonly getFrequencies: typeof getFrequencies;
    readonly getIndexOf: typeof getIndexOf;
    readonly getInitial: typeof getInitial;
    readonly getIntersection: typeof getIntersection;
    readonly getItemsAt: typeof getItemsAt;
    readonly getLast: typeof getLast;
    readonly getLastIndexOf: typeof getLastIndexOf;
    readonly getLength: typeof getLength;
    readonly getLongestCommonPrefix: typeof getLongestCommonPrefix;
    readonly getLongestCommonSubsequence: typeof getLongestCommonSubsequence;
    readonly getLongestCommonSuffix: typeof getLongestCommonSuffix;
    readonly getMax: typeof getMax;
    readonly getMean: typeof getMean;
    readonly getMedian: typeof getMedian;
    readonly getMin: typeof getMin;
    readonly getMode: typeof getMode;
    readonly getOffsetItems: typeof getOffsetItems;
    readonly getPageItems: typeof getPageItems;
    readonly getPercentile: typeof getPercentile;
    readonly getProduct: typeof getProduct;
    readonly getRunningTotals: typeof getRunningTotals;
    readonly getSortedInsertIndex: typeof getSortedInsertIndex;
    readonly getSortedLastInsertIndex: typeof getSortedLastInsertIndex;
    readonly getStandardDeviation: typeof getStandardDeviation;
    readonly getSum: typeof getSum;
    readonly getSymmetricDifference: typeof getSymmetricDifference;
    readonly getTail: typeof getTail;
    readonly getUnion: typeof getUnion;
    readonly getUniqueItems: typeof getUniqueItems;
    readonly getUniqueItemsBy: typeof getUniqueItemsBy;
    readonly getUniqueSorted: typeof getUniqueSorted;
    readonly getVariance: typeof getVariance;
    readonly getWindowAggregates: typeof getWindowAggregates;
    readonly groupBy: typeof groupBy;
    readonly groupByKeys: typeof groupByKeys;
    readonly hasAtLeast: typeof hasAtLeast;
    readonly indexBy: typeof indexBy;
    readonly insertItem: typeof insertItem;
    readonly insertItems: typeof insertItems;
    readonly insertSorted: typeof insertSorted;
    readonly interleave: typeof interleave;
    readonly intersperse: typeof intersperse;
    readonly isArrayLike: typeof isArrayLike;
    readonly isDisjoint: typeof isDisjoint;
    readonly isEmptyArray: typeof isEmptyArray;
    readonly isEqualArray: typeof isEqualArray;
    readonly isNonEmptyArray: typeof isNonEmptyArray;
    readonly isPermutationOf: typeof isPermutationOf;
    readonly isSorted: typeof isSorted;
    readonly isSubset: typeof isSubset;
    readonly isSuperset: typeof isSuperset;
    readonly isTypedArray: typeof isTypedArray;
    readonly isUnique: typeof isUnique;
    readonly joinItems: typeof joinItems;
    readonly mergeSorted: typeof mergeSorted;
    readonly moveItem: typeof moveItem;
    readonly padArrayEnd: typeof padArrayEnd;
    readonly padArrayStart: typeof padArrayStart;
    readonly paginate: typeof paginate;
    readonly partition: typeof partition;
    readonly partitionBy: typeof partitionBy;
    readonly rejectItems: typeof rejectItems;
    readonly removeAt: typeof removeAt;
    readonly removeAtIndexes: typeof removeAtIndexes;
    readonly removeItems: typeof removeItems;
    readonly repeatArray: typeof repeatArray;
    readonly repeatItem: typeof repeatItem;
    readonly replaceItem: typeof replaceItem;
    readonly rotateItems: typeof rotateItems;
    readonly sampleItem: typeof sampleItem;
    readonly sampleItems: typeof sampleItems;
    readonly sampleWeighted: typeof sampleWeighted;
    readonly setAt: typeof setAt;
    readonly shuffleItems: typeof shuffleItems;
    readonly sliceArray: typeof sliceArray;
    readonly sortBy: typeof sortBy;
    readonly sortNatural: typeof sortNatural;
    readonly splitAt: typeof splitAt;
    readonly splitWhen: typeof splitWhen;
    readonly swapItems: typeof swapItems;
    readonly take: typeof take;
    readonly takeLast: typeof takeLast;
    readonly takeLastWhile: typeof takeLastWhile;
    readonly takeWhile: typeof takeWhile;
    readonly toArray: typeof toArray;
    readonly toggleItem: typeof toggleItem;
    readonly transpose: typeof transpose;
    readonly unzip: typeof unzip;
    readonly unzipWith: typeof unzipWith;
    readonly updateAt: typeof updateAt;
    readonly updateWhere: typeof updateWhere;
    readonly withoutValues: typeof withoutValues;
    readonly zip: typeof zip;
    readonly zipToObject: typeof zipToObject;
    readonly zipWith: typeof zipWith;
}

/**
 * Returns a frozen set of root functions with `config` bound in.
 *
 * Standalone functions keep the built-in defaults. This object does not
 * change later calls to those functions, and two instances do not share
 * state. Per-call `equals`, locale options, and `random` replace the
 * bound values. A per-call `seed` still wins over a bound `random`.
 *
 * @param config - Defaults read once. Omit it for the built-in defaults.
 * @returns A frozen toolkit. It is not an array.
 * @throws {@link TypeError} When `config` is not an object, or a field has the wrong type.
 * @throws {@link RangeError} When a field is the right type but not usable, including `concurrency` of `0`.
 * @example
 * const arrays = createArray({ numeric: true, locale: "en-IN" });
 */
export function createArray(config?: ArrayConfig): ArrayToolkit {
    const resolved = resolveArrayConfig(config);
    const toolkit: ArrayToolkit = {
        applyArrayPatch: applyArrayPatch,
        binItems: binItems,
        binarySearch: bind(
            binarySearch,
            resolved,
            ["locale", "numeric", "sensitivity", "nulls"],
            false,
        ),
        chunk: chunk,
        chunkBy: chunkBy,
        compact: compact,
        compactNullish: compactNullish,
        concatArrays: concatArrays,
        countBy: countBy,
        countOccurrences: bind(countOccurrences, resolved, ["equals"], false),
        createComparator: bind(
            createComparator,
            resolved,
            ["locale", "numeric", "sensitivity", "nulls"],
            false,
        ),
        createRange: createRange,
        createTimes: createTimes,
        createWindows: createWindows,
        cycleItems: cycleItems,
        diffArraySequence: bind(diffArraySequence, resolved, ["equals"], false),
        diffArrays: bind(diffArrays, resolved, ["equals"], false),
        diffArraysByKey: bind(diffArraysByKey, resolved, ["equals"], false),
        drop: drop,
        dropLast: dropLast,
        dropLastWhile: dropLastWhile,
        dropWhile: dropWhile,
        ensureArray: ensureArray,
        fillRange: fillRange,
        findDuplicateIndexes: bind(
            findDuplicateIndexes,
            resolved,
            ["equals"],
            false,
        ),
        findDuplicateItems: bind(
            findDuplicateItems,
            resolved,
            ["equals"],
            false,
        ),
        findIndexes: findIndexes,
        flatten: flatten,
        flattenDeep: flattenDeep,
        flattenTree: flattenTree,
        getAt: getAt,
        getBestItem: getBestItem,
        getDifference: bind(getDifference, resolved, ["equals"], false),
        getExtent: getExtent,
        getFirst: getFirst,
        getFrequencies: getFrequencies,
        getIndexOf: bind(getIndexOf, resolved, ["equals"], false),
        getInitial: getInitial,
        getIntersection: bind(getIntersection, resolved, ["equals"], false),
        getItemsAt: getItemsAt,
        getLast: getLast,
        getLastIndexOf: bind(getLastIndexOf, resolved, ["equals"], false),
        getLength: getLength,
        getLongestCommonPrefix: bind(
            getLongestCommonPrefix,
            resolved,
            ["equals"],
            false,
        ),
        getLongestCommonSubsequence: bind(
            getLongestCommonSubsequence,
            resolved,
            ["equals"],
            false,
        ),
        getLongestCommonSuffix: bind(
            getLongestCommonSuffix,
            resolved,
            ["equals"],
            false,
        ),
        getMax: getMax,
        getMean: getMean,
        getMedian: getMedian,
        getMin: getMin,
        getMode: getMode,
        getOffsetItems: getOffsetItems,
        getPageItems: getPageItems,
        getPercentile: getPercentile,
        getProduct: getProduct,
        getRunningTotals: getRunningTotals,
        getSortedInsertIndex: bind(
            getSortedInsertIndex,
            resolved,
            ["locale", "numeric", "sensitivity", "nulls"],
            false,
        ),
        getSortedLastInsertIndex: bind(
            getSortedLastInsertIndex,
            resolved,
            ["locale", "numeric", "sensitivity", "nulls"],
            false,
        ),
        getStandardDeviation: getStandardDeviation,
        getSum: getSum,
        getSymmetricDifference: bind(
            getSymmetricDifference,
            resolved,
            ["equals"],
            false,
        ),
        getTail: getTail,
        getUnion: bind(getUnion, resolved, ["equals"], false),
        getUniqueItems: bind(getUniqueItems, resolved, ["equals"], true),
        getUniqueItemsBy: getUniqueItemsBy,
        getUniqueSorted: getUniqueSorted,
        getVariance: getVariance,
        getWindowAggregates: getWindowAggregates,
        groupBy: groupBy,
        groupByKeys: groupByKeys,
        hasAtLeast: hasAtLeast,
        indexBy: indexBy,
        insertItem: insertItem,
        insertItems: insertItems,
        insertSorted: bind(
            insertSorted,
            resolved,
            ["locale", "numeric", "sensitivity", "nulls"],
            false,
        ),
        interleave: interleave,
        intersperse: intersperse,
        isArrayLike: isArrayLike,
        isDisjoint: bind(isDisjoint, resolved, ["equals"], false),
        isEmptyArray: isEmptyArray,
        isEqualArray: bind(isEqualArray, resolved, ["equals"], false),
        isNonEmptyArray: isNonEmptyArray,
        isPermutationOf: bind(isPermutationOf, resolved, ["equals"], false),
        isSorted: bind(
            isSorted,
            resolved,
            ["locale", "numeric", "sensitivity", "nulls"],
            false,
        ),
        isSubset: bind(isSubset, resolved, ["equals"], false),
        isSuperset: bind(isSuperset, resolved, ["equals"], false),
        isTypedArray: isTypedArray,
        isUnique: bind(isUnique, resolved, ["equals"], false),
        joinItems: joinItems,
        mergeSorted: bind(
            mergeSorted,
            resolved,
            ["locale", "numeric", "sensitivity", "nulls"],
            false,
        ),
        moveItem: moveItem,
        padArrayEnd: padArrayEnd,
        padArrayStart: padArrayStart,
        paginate: paginate,
        partition: partition,
        partitionBy: partitionBy,
        rejectItems: rejectItems,
        removeAt: removeAt,
        removeAtIndexes: removeAtIndexes,
        removeItems: bind(removeItems, resolved, ["equals"], false),
        repeatArray: repeatArray,
        repeatItem: repeatItem,
        replaceItem: bind(replaceItem, resolved, ["equals"], false),
        rotateItems: rotateItems,
        sampleItem: bind(sampleItem, resolved, ["random"], true),
        sampleItems: bind(sampleItems, resolved, ["random"], false),
        sampleWeighted: bind(sampleWeighted, resolved, ["random"], false),
        setAt: setAt,
        shuffleItems: bind(shuffleItems, resolved, ["random"], true),
        sliceArray: sliceArray,
        sortBy: bind(
            sortBy,
            resolved,
            ["locale", "numeric", "sensitivity", "nulls"],
            false,
        ),
        sortNatural: bind(
            sortNatural,
            resolved,
            ["locale", "numeric", "sensitivity", "nulls"],
            false,
        ),
        splitAt: splitAt,
        splitWhen: splitWhen,
        swapItems: swapItems,
        take: take,
        takeLast: takeLast,
        takeLastWhile: takeLastWhile,
        takeWhile: takeWhile,
        toArray: toArray,
        toggleItem: bind(toggleItem, resolved, ["equals"], false),
        transpose: transpose,
        unzip: unzip,
        unzipWith: unzipWith,
        updateAt: updateAt,
        updateWhere: updateWhere,
        withoutValues: bind(withoutValues, resolved, ["equals"], false),
        zip: zip,
        zipToObject: zipToObject,
        zipWith: zipWith,
    };
    return Object.freeze(toolkit);
}

/**
 * Calls `implementation` with instance defaults filled in.
 *
 * A bare array becomes `{ array }` when the function has that overload.
 * Fields the call already set are left alone.
 *
 * @param implementation - The standalone function.
 * @param config - The frozen instance config.
 * @param fields - Config keys this function reads.
 * @param acceptsBareArray - Whether a bare array is a valid call.
 * @returns The standalone function, or a wrapper with the same type.
 */
function bind<FunctionType extends (input: never) => unknown>(
    implementation: FunctionType,
    config: ResolvedArrayConfig,
    fields: readonly (keyof ResolvedArrayConfig)[],
    acceptsBareArray: boolean,
): FunctionType {
    if (!fields.some((field) => config[field] !== undefined)) {
        return implementation;
    }
    const call = implementation as unknown as (value: unknown) => unknown;
    return ((input: unknown) => {
        if (acceptsBareArray && Array.isArray(input)) {
            const params: Record<string, unknown> = { array: input };
            assignConfigDefaults(params, config, fields);
            return call(params);
        }
        if (
            input !== null &&
            typeof input === "object" &&
            !Array.isArray(input)
        ) {
            const params: Record<string, unknown> = {
                ...(input as Record<string, unknown>),
            };
            assignConfigDefaults(params, config, fields);
            return call(params);
        }
        return call(input);
    }) as unknown as FunctionType;
}
