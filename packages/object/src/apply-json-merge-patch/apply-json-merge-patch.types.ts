import type { PrototypeKeys } from "../types/object-config.types.js";

/**
 * Arguments for `applyJSONMergePatch`.
 */
export interface ApplyJSONMergePatchParams {
    /** The document to copy and edit. It is not mutated. */
    object: unknown;

    /**
     * An RFC 7396 merge patch.
     *
     * A plain object merges by key. Any other value replaces `object`.
     */
    patch: unknown;

    /**
     * How `__proto__`, `prototype`, and `constructor` keys are written.
     * `"skip"` drops the key and does not walk `Object.prototype`.
     *
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;
}
