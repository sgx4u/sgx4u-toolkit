import { canonicalizeJSON } from "../canonicalize-json/canonicalize-json.js";
import { hashObject } from "../hash-object/hash-object.js";
import type { ObjectConfig } from "../types/object-config.types.js";
import { readObjectConfig } from "../utils/object-config.utils.js";
import type { ObjectHash } from "./create-object-hash.types.js";

/**
 * Builds a frozen hash API after validating `config`.
 *
 * `canonicalizeJSON` and `hashObject` do not read the config. Validation
 * still runs, so a value that is not a plain object throws `TypeError`, and
 * an invalid checked option throws `RangeError`. Unknown keys, `keyCase`,
 * `emptyValues`, `locale`, and `maxDepth` are ignored.
 * There is no module-level config. Two instances do not affect each other.
 *
 * @param config - Checked and then unused. Omitted selects the defaults.
 * @returns A frozen object with `canonicalizeJSON` and `hashObject`.
 * @throws {TypeError} When `config` is present and is not a plain object.
 * @throws {RangeError} When a checked option is invalid, including an empty `pathDelimiter`.
 * @example
 * createObjectHash({ pathDelimiter: "." });
 */
export function createObjectHash(config?: ObjectConfig): ObjectHash {
    readObjectConfig(config);
    return Object.freeze({
        canonicalizeJSON,
        hashObject,
    });
}
