import {
    applyDiff,
    isObjectDiff,
} from "../apply-object-patch/apply-object-patch.js";
import type { ObjectDiff } from "../types/object-diff.types.js";
import { writeOwnProperty } from "../utils/dangerous-key.utils.js";
import type { RevertObjectPatchParams } from "./revert-object-patch.types.js";

/**
 * Undoes a structural diff without mutating `object`.
 *
 * Added becomes removed, removed becomes added, and changed swaps `from`
 * with `to`. Nested object and array diffs are inverted the same way, then
 * applied. An invalid patch returns `undefined`.
 *
 * @param params - The value and the patch that produced it.
 * @returns The restored value, or `undefined` when the patch is invalid or the inverse removes the root.
 * @example
 * revertObjectPatch({
 *     object: { id: 2 },
 *     patch: { kind: "object", properties: { id: { from: 1, kind: "changed", to: 2 } } },
 * });
 */
export function revertObjectPatch(params: RevertObjectPatchParams): unknown {
    if (!isObjectDiff(params.patch)) {
        return undefined;
    }
    return applyDiff(params.object, invertDiff(params.patch));
}

/**
 * Builds the inverse of a valid diff.
 *
 * @param diff - A diff that has already been validated.
 * @returns The inverse diff.
 */
function invertDiff(diff: ObjectDiff): ObjectDiff {
    switch (diff.kind) {
        case "unchanged":
            return { kind: "unchanged" };
        case "added":
            return { kind: "removed", value: diff.value };
        case "removed":
            return { kind: "added", value: diff.value };
        case "changed":
            return { kind: "changed", from: diff.to, to: diff.from };
        case "object":
            return {
                kind: "object",
                properties: invertProperties(diff.properties),
            };
        case "array":
            return { kind: "array", items: invertItems(diff.items) };
    }
}

/**
 * Inverts each property diff.
 *
 * @param properties - Property diffs.
 * @returns A new property map.
 */
function invertProperties(
    properties: Record<string, ObjectDiff>,
): Record<string, ObjectDiff> {
    const inverted = Object.create(null) as Record<string, ObjectDiff>;
    for (const key of Object.keys(properties)) {
        const diff = properties[key];
        if (diff === undefined) {
            continue;
        }
        writeOwnProperty(inverted, key, invertDiff(diff), "keep");
    }
    return inverted;
}

/**
 * Inverts each array-index diff.
 *
 * @param items - Index diffs.
 * @returns A new item list.
 */
function invertItems(
    items: Array<{ index: number; diff: ObjectDiff }>,
): Array<{ index: number; diff: ObjectDiff }> {
    const inverted: Array<{ index: number; diff: ObjectDiff }> = [];
    for (const item of items) {
        inverted.push({ diff: invertDiff(item.diff), index: item.index });
    }
    return inverted;
}
