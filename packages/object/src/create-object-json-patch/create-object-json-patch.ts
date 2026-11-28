import { applyJSONMergePatch } from "../apply-json-merge-patch/apply-json-merge-patch.js";
import type { ApplyJSONMergePatchParams } from "../apply-json-merge-patch/apply-json-merge-patch.types.js";
import { applyJSONPatch } from "../apply-json-patch/apply-json-patch.js";
import type { ApplyJSONPatchParams } from "../apply-json-patch/apply-json-patch.types.js";
import { createJSONMergePatch } from "../create-json-merge-patch/create-json-merge-patch.js";
import { createJSONPatch } from "../create-json-patch/create-json-patch.js";
import { formatJSONPointer } from "../format-json-pointer/format-json-pointer.js";
import { isValidJSONPatch } from "../is-valid-json-patch/is-valid-json-patch.js";
import { parseJSONPointer } from "../parse-json-pointer/parse-json-pointer.js";
import type { ObjectConfig } from "../types/object-config.types.js";
import { readObjectConfig } from "../utils/object-config.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { ObjectJSONPatch } from "./create-object-json-patch.types.js";

/**
 * Builds a frozen JSON Patch API with `config` bound in.
 *
 * `prototypeKeys` is the default for `applyJSONPatch` and
 * `applyJSONMergePatch`. A `prototypeKeys` on a call replaces it. `pathStyle`
 * and `pathDelimiter` are validated so a shared config fails here the same
 * way it fails for path functions. Patch paths stay JSON Pointers, so those
 * two options do not change parsing. Unknown config keys, `keyCase`,
 * `emptyValues`, `locale`, and `maxDepth` are ignored.
 *
 * Each call returns its own functions. There is no module-level config.
 * Two instances do not affect each other.
 *
 * @param config - Defaults for the bound apply functions. Omitted means `"skip"`.
 * @returns A frozen object with the seven JSON Patch functions.
 * @throws {TypeError} When `config` is present and is not a plain object.
 * @throws {RangeError} When a checked option is invalid, including an empty `pathDelimiter`.
 * @example
 * createObjectJSONPatch({ prototypeKeys: "skip" });
 */
export function createObjectJSONPatch(config?: ObjectConfig): ObjectJSONPatch {
    const prototypeKeys = readObjectConfig(config).prototypeKeys;

    function applyJSONPatchBound(params: ApplyJSONPatchParams): unknown {
        if (!isPlainObjectValue(params) || params.prototypeKeys !== undefined) {
            return applyJSONPatch(params);
        }
        return applyJSONPatch({ ...params, prototypeKeys });
    }

    function applyJSONMergePatchBound(
        params: ApplyJSONMergePatchParams,
    ): unknown {
        if (!isPlainObjectValue(params) || params.prototypeKeys !== undefined) {
            return applyJSONMergePatch(params);
        }
        return applyJSONMergePatch({ ...params, prototypeKeys });
    }

    return Object.freeze({
        applyJSONMergePatch: applyJSONMergePatchBound,
        applyJSONPatch: applyJSONPatchBound,
        createJSONMergePatch,
        createJSONPatch,
        formatJSONPointer,
        isValidJSONPatch,
        parseJSONPointer,
    });
}
