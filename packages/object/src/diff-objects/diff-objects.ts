import type { ObjectDiff } from "../types/object-diff.types.js";
import {
    readOwnProperty,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { valuesAreEqual } from "../utils/equal.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { DiffObjectsParams } from "./diff-objects.types.js";

interface DiffFrame {
    first: object;
    second: object;
}

/**
 * Builds a structural diff from `first` to `second`.
 *
 * Equal values, compared with `valuesAreEqual`, are `"unchanged"`. Plain
 * objects report added, removed, and nested keys. Arrays are compared by
 * index: the longer tail is added and the shorter tail is removed. A change
 * of kind, such as object to array or object to primitive, is `"changed"`.
 * The inputs are not mutated. The result is always an `ObjectDiff`.
 *
 * @param params - The two values and the symbol flag.
 * @returns The diff. It is never `undefined`.
 * @example
 * diffObjects({ first: { id: 1 }, second: { id: 2 } });
 */
export function diffObjects(params: DiffObjectsParams): ObjectDiff {
    const includeSymbols = params.includeSymbols === true;
    return diffNode(params.first, params.second, includeSymbols, []);
}

/**
 * Diffs one pair.
 *
 * A pair already on the stack is treated as unchanged so a cycle stops.
 *
 * @param first - The left value.
 * @param second - The right value.
 * @param includeSymbols - Whether enumerable symbol keys participate.
 * @param stack - Pairs currently being compared.
 * @returns The diff for this pair.
 */
function diffNode(
    first: unknown,
    second: unknown,
    includeSymbols: boolean,
    stack: DiffFrame[],
): ObjectDiff {
    if (isOnStack(stack, first, second)) {
        return { kind: "unchanged" };
    }
    if (
        valuesAreEqual(first, second, {
            includeNonEnumerable: false,
            includeSymbols,
        })
    ) {
        return { kind: "unchanged" };
    }
    if (Array.isArray(first) && Array.isArray(second)) {
        return diffArrays(first, second, includeSymbols, stack);
    }
    if (isPlainObjectValue(first) && isPlainObjectValue(second)) {
        return diffRecords(first, second, includeSymbols, stack);
    }
    return { kind: "changed", from: first, to: second };
}

/**
 * Diffs two arrays by index.
 *
 * @param first - The left array.
 * @param second - The right array.
 * @param includeSymbols - Whether nested symbol keys participate.
 * @param stack - Pairs currently being compared.
 * @returns An array diff, or `"changed"` when the difference is not index-shaped.
 */
function diffArrays(
    first: unknown[],
    second: unknown[],
    includeSymbols: boolean,
    stack: DiffFrame[],
): ObjectDiff {
    if (includeSymbols && symbolsDiffer(first, second)) {
        return { kind: "changed", from: first, to: second };
    }
    stack.push({ first, second });
    const items: Array<{ index: number; diff: ObjectDiff }> = [];
    const shared = Math.min(first.length, second.length);
    for (let index = 0; index < shared; index += 1) {
        const diff = diffNode(
            first[index],
            second[index],
            includeSymbols,
            stack,
        );
        if (diff.kind !== "unchanged") {
            items.push({ diff, index });
        }
    }
    if (second.length > first.length) {
        for (let index = shared; index < second.length; index += 1) {
            items.push({
                diff: { kind: "added", value: second[index] },
                index,
            });
        }
    } else if (first.length > second.length) {
        for (let index = shared; index < first.length; index += 1) {
            items.push({
                diff: { kind: "removed", value: first[index] },
                index,
            });
        }
    }
    stack.pop();
    if (items.length === 0) {
        return { kind: "changed", from: first, to: second };
    }
    return { kind: "array", items };
}

/**
 * Diffs the own enumerable keys of two plain objects.
 *
 * @param first - The left object.
 * @param second - The right object.
 * @param includeSymbols - Whether enumerable symbol keys participate.
 * @param stack - Pairs currently being compared.
 * @returns An object diff, or `"changed"` when symbol keys differ.
 */
function diffRecords(
    first: Record<string, unknown>,
    second: Record<string, unknown>,
    includeSymbols: boolean,
    stack: DiffFrame[],
): ObjectDiff {
    if (includeSymbols && symbolsDiffer(first, second)) {
        return { kind: "changed", from: first, to: second };
    }
    stack.push({ first, second });
    const properties = Object.create(null) as Record<string, ObjectDiff>;
    for (const key of unionKeys(first, second)) {
        const diff = diffKey(first, second, key, includeSymbols, stack);
        if (diff.kind !== "unchanged") {
            writeOwnProperty(properties, key, diff, "keep");
        }
    }
    stack.pop();
    if (Object.keys(properties).length === 0) {
        return { kind: "changed", from: first, to: second };
    }
    return { kind: "object", properties };
}

/**
 * Diffs one string key.
 *
 * @param first - The left object.
 * @param second - The right object.
 * @param key - The key to compare.
 * @param includeSymbols - Whether nested symbol keys participate.
 * @param stack - Pairs currently being compared.
 * @returns The diff for this key.
 */
function diffKey(
    first: Record<string, unknown>,
    second: Record<string, unknown>,
    key: string,
    includeSymbols: boolean,
    stack: DiffFrame[],
): ObjectDiff {
    const inFirst = Object.hasOwn(first, key);
    const inSecond = Object.hasOwn(second, key);
    if (inFirst && !inSecond) {
        return { kind: "removed", value: readOwnProperty(first, key) };
    }
    if (!inFirst && inSecond) {
        return { kind: "added", value: readOwnProperty(second, key) };
    }
    return diffNode(
        readOwnProperty(first, key),
        readOwnProperty(second, key),
        includeSymbols,
        stack,
    );
}

/**
 * Own enumerable string keys of `first`, then keys only on `second`.
 *
 * @param first - The left object.
 * @param second - The right object.
 * @returns The key union, without duplicates.
 */
function unionKeys(
    first: Record<string, unknown>,
    second: Record<string, unknown>,
): string[] {
    const keys = Object.keys(first);
    const seen = new Set(keys);
    for (const key of Object.keys(second)) {
        if (!seen.has(key)) {
            keys.push(key);
        }
    }
    return keys;
}

/**
 * Whether the enumerable symbol keys of two objects differ.
 *
 * @param first - The left object.
 * @param second - The right object.
 * @returns `true` when the symbol keys or their values differ.
 */
function symbolsDiffer(first: object, second: object): boolean {
    const left = enumerableSymbols(first);
    const right = enumerableSymbols(second);
    if (left.length !== right.length) {
        return true;
    }
    const rightSet = new Set(right);
    for (const symbol of left) {
        if (!rightSet.has(symbol)) {
            return true;
        }
        if (
            !valuesAreEqual(
                readOwnProperty(first, symbol),
                readOwnProperty(second, symbol),
                {
                    includeNonEnumerable: false,
                    includeSymbols: true,
                },
            )
        ) {
            return true;
        }
    }
    return false;
}

/**
 * Enumerable own symbol keys.
 *
 * @param value - The object to list.
 * @returns The symbols, in `Object.getOwnPropertySymbols` order.
 */
function enumerableSymbols(value: object): symbol[] {
    const symbols: symbol[] = [];
    for (const symbol of Object.getOwnPropertySymbols(value)) {
        const descriptor = Object.getOwnPropertyDescriptor(value, symbol);
        if (descriptor?.enumerable === true) {
            symbols.push(symbol);
        }
    }
    return symbols;
}

/**
 * Whether this object pair is already being compared.
 *
 * @param stack - Pairs currently being compared.
 * @param first - The left value.
 * @param second - The right value.
 * @returns `true` when both values are objects and the pair is on the stack.
 */
function isOnStack(
    stack: readonly DiffFrame[],
    first: unknown,
    second: unknown,
): boolean {
    if (typeof first !== "object" || first === null) {
        return false;
    }
    if (typeof second !== "object" || second === null) {
        return false;
    }
    return stack.some(
        (frame) => frame.first === first && frame.second === second,
    );
}
