import type { applyJSONMergePatch } from "../apply-json-merge-patch/apply-json-merge-patch.js";
import type { applyJSONPatch } from "../apply-json-patch/apply-json-patch.js";
import type { createJSONMergePatch } from "../create-json-merge-patch/create-json-merge-patch.js";
import type { createJSONPatch } from "../create-json-patch/create-json-patch.js";
import type { formatJSONPointer } from "../format-json-pointer/format-json-pointer.js";
import type { isValidJSONPatch } from "../is-valid-json-patch/is-valid-json-patch.js";
import type { parseJSONPointer } from "../parse-json-pointer/parse-json-pointer.js";

/**
 * The JSON Patch and JSON Merge Patch functions with one bound config.
 *
 * `applyJSONPatch` and `applyJSONMergePatch` use the factory's
 * `prototypeKeys` unless a call passes its own. The other functions do not
 * read the config. `pathStyle` is validated and is not used: patch paths are
 * JSON Pointers.
 */
export interface ObjectJSONPatch {
    /** Parses an RFC 6901 pointer. */
    readonly parseJSONPointer: typeof parseJSONPointer;
    /** Formats an RFC 6901 pointer. */
    readonly formatJSONPointer: typeof formatJSONPointer;
    /** Builds an RFC 6902 patch. `"move"` is not emitted. */
    readonly createJSONPatch: typeof createJSONPatch;
    /** Applies an RFC 6902 patch. */
    readonly applyJSONPatch: typeof applyJSONPatch;
    /** Reports whether a value is a well-formed JSON Patch. */
    readonly isValidJSONPatch: typeof isValidJSONPatch;
    /** Builds an RFC 7396 merge patch. */
    readonly createJSONMergePatch: typeof createJSONMergePatch;
    /** Applies an RFC 7396 merge patch. */
    readonly applyJSONMergePatch: typeof applyJSONMergePatch;
}
