/**
 * A structural diff produced by `diffObjects`.
 *
 * Apply it with `applyObjectPatch` and undo it with `revertObjectPatch`.
 * This is not an RFC 6902 JSON Patch.
 */
export type ObjectDiff =
    | { kind: "unchanged" }
    | { kind: "added"; value: unknown }
    | { kind: "removed"; value: unknown }
    | { kind: "changed"; from: unknown; to: unknown }
    | { kind: "object"; properties: Record<string, ObjectDiff> }
    | { kind: "array"; items: Array<{ index: number; diff: ObjectDiff }> };
