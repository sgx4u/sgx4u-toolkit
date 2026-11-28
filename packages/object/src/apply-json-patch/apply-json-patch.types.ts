import type { JSONPatchOperation } from "../types/json-patch.types.js";
import type { PrototypeKeys } from "../types/object-config.types.js";

/**
 * Arguments for `applyJSONPatch`.
 */
export interface ApplyJSONPatchParams {
    /** The document to copy and edit. It is not mutated. */
    object: unknown;

    /** RFC 6902 operations, applied from first to last. */
    patch: readonly JSONPatchOperation[];

    /**
     * When `true`, a missing target for `"remove"`, `"replace"`, `"move"`,
     * `"copy"`, or `"add"` fails the whole patch. When `false`, that
     * operation is skipped. A failed `"test"` always fails the patch.
     *
     * @defaultValue `true`
     */
    strict?: boolean;

    /**
     * How `__proto__`, `prototype`, and `constructor` segments are written.
     * `"skip"` drops the segment and does not walk `Object.prototype`.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;
}
