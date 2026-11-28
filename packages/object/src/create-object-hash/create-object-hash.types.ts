import type { canonicalizeJSON } from "../canonicalize-json/canonicalize-json.js";
import type { hashObject } from "../hash-object/hash-object.js";

/**
 * Canonical JSON and its digests, validated against one config.
 *
 * The functions do not read `pathStyle` or `pathDelimiter`. Those options are
 * still checked so a bad shared config throws.
 */
export interface ObjectHash {
    /** Serializes a value with RFC 8785. */
    readonly canonicalizeJSON: typeof canonicalizeJSON;
    /**
     * Hashes the canonical form.
     *
     * `"sha256"` returns a promise. `"fnv1a64"` returns a string.
     */
    readonly hashObject: typeof hashObject;
}
