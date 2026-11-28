import type { PathSegment } from "../types/path.types.js";
import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import type { EqualOptions } from "../utils/equal.utils.js";
import { valuesAreEqual } from "../utils/equal.utils.js";
import {
    isObjectLikeValue,
    isPlainObjectValue,
} from "../utils/value-kind.utils.js";
import type { IsMatchParams, MatchVisit } from "./is-match.types.js";

const structuralEquality: EqualOptions = {
    includeNonEnumerable: false,
    includeSymbols: false,
};

/**
 * Reports whether `object` has at least the structure in `specification`.
 *
 * Extra keys on `object` are allowed. Nested plain objects recurse. Arrays
 * match by index and may be longer than the specification. Primitives, and
 * any specification that is not a plain object or an array, use deep
 * equality. `null` matches only `null`. A hole in a specification array adds
 * no constraint. The function does not throw.
 *
 * @param params - The value and the required structure.
 * @returns `true` when `object` satisfies `specification`. A non-object argument returns `false`.
 * @example
 * isMatch({ object: { a: 1, b: 2 }, specification: { b: 2 } });
 */
export function isMatch(params: IsMatchParams): boolean {
    if (!isObjectLikeValue(params)) {
        return false;
    }
    return matchesSpecification(params.object, params.specification, undefined);
}

/**
 * Partial comparison shared by `isMatch` and `isMatchWith`.
 *
 * `undefined` from `comparator` keeps the default partial rule. A boolean
 * decides that step. A specification object already on the stack matches, so
 * a cycle ends.
 *
 * @param object - The value being tested.
 * @param specification - The required structure.
 * @param comparator - Optional override for a step. Pass `undefined` for the default rule only.
 * @returns `true` when `object` satisfies `specification`.
 */
export function matchesSpecification(
    object: unknown,
    specification: unknown,
    comparator: ((details: MatchVisit) => boolean | undefined) | undefined,
): boolean {
    return matchNode(
        object,
        specification,
        comparator,
        [],
        undefined,
        new Set(),
    );
}

/**
 * Compares one step, asking `comparator` first.
 *
 * @param object - The value being tested.
 * @param specification - The required value.
 * @param comparator - Optional override. `undefined` means there is none.
 * @param path - The path from the root.
 * @param key - The key that selected this step.
 * @param specStack - Specification objects currently being matched.
 * @returns `true` when this step matches.
 */
function matchNode(
    object: unknown,
    specification: unknown,
    comparator: ((details: MatchVisit) => boolean | undefined) | undefined,
    path: PathSegment[],
    key: PropertyKey | undefined,
    specStack: Set<object>,
): boolean {
    if (comparator !== undefined) {
        const compared = comparator(
            visitDetails(object, specification, path, key),
        );
        if (compared !== undefined) {
            return compared;
        }
    }
    if (specification === null) {
        return object === null;
    }
    if (Array.isArray(specification)) {
        return matchArray(object, specification, comparator, path, specStack);
    }
    if (isPlainObjectValue(specification)) {
        return matchRecord(object, specification, comparator, path, specStack);
    }
    return valuesAreEqual(object, specification, structuralEquality);
}

/**
 * Builds the comparator argument without assigning an omitted key.
 *
 * @param object - The value being tested.
 * @param specification - The required value.
 * @param path - The path from the root.
 * @param key - The key that selected this step.
 * @returns The visit details.
 */
function visitDetails(
    object: unknown,
    specification: unknown,
    path: PathSegment[],
    key: PropertyKey | undefined,
): MatchVisit {
    const details: MatchVisit = { object, path, specification };
    if (key !== undefined) {
        details.key = key;
    }
    return details;
}

/**
 * Matches an array by index. A longer object array is allowed.
 *
 * @param object - The value being tested.
 * @param specification - The required array.
 * @param comparator - Optional override.
 * @param path - The path of the array.
 * @param specStack - Specification objects currently being matched.
 * @returns `true` when every present specification index matches.
 */
function matchArray(
    object: unknown,
    specification: unknown[],
    comparator: ((details: MatchVisit) => boolean | undefined) | undefined,
    path: PathSegment[],
    specStack: Set<object>,
): boolean {
    if (specStack.has(specification)) {
        return true;
    }
    if (!Array.isArray(object) || object.length < specification.length) {
        return false;
    }
    specStack.add(specification);
    let matched = true;
    for (let index = 0; index < specification.length; index += 1) {
        if (!Object.hasOwn(specification, index)) {
            continue;
        }
        const childMatches = matchNode(
            object[index],
            specification[index],
            comparator,
            [...path, index],
            index,
            specStack,
        );
        if (!childMatches) {
            matched = false;
            break;
        }
    }
    specStack.delete(specification);
    return matched;
}

/**
 * Matches a plain object key by key. Extra keys on `object` are ignored.
 *
 * @param object - The value being tested.
 * @param specification - The required plain object.
 * @param comparator - Optional override.
 * @param path - The path of the object.
 * @param specStack - Specification objects currently being matched.
 * @returns `true` when every specification key matches.
 */
function matchRecord(
    object: unknown,
    specification: Record<string, unknown>,
    comparator: ((details: MatchVisit) => boolean | undefined) | undefined,
    path: PathSegment[],
    specStack: Set<object>,
): boolean {
    if (specStack.has(specification)) {
        return true;
    }
    const keys = Object.keys(specification);
    if (!isObjectLikeValue(object)) {
        return keys.length === 0;
    }
    specStack.add(specification);
    let matched = true;
    for (const key of keys) {
        const objectValue = Object.hasOwn(object, key)
            ? readOwnProperty(object, key)
            : undefined;
        const childMatches = matchNode(
            objectValue,
            readOwnProperty(specification, key),
            comparator,
            [...path, key],
            key,
            specStack,
        );
        if (!childMatches) {
            matched = false;
            break;
        }
    }
    specStack.delete(specification);
    return matched;
}
