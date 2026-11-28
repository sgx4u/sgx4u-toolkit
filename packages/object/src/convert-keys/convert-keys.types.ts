import type { KeyCase } from "../types/object-config.types.js";
import type { ObjectPath, PathStyle } from "../types/path.types.js";

/**
 * Arguments for `convertKeys`.
 */
export interface ConvertKeysParams {
    /**
     * The dictionary whose keys are converted.
     *
     * `null`, primitives, and arrays return `undefined`. Objects inside arrays
     * are converted when `deep` is true.
     */
    object: unknown;

    /**
     * The case to apply to each key.
     *
     * @defaultValue `"camelCase"`
     */
    case?: KeyCase;

    /**
     * When true, also convert nested plain objects and objects inside arrays.
     *
     * @defaultValue `true`
     */
    deep?: boolean;

    /**
     * Keep a run of two or more uppercase letters together in `camelCase` and
     * `pascalCase`. `snakeCase`, `kebabCase`, and `constantCase` still split
     * that run into words.
     *
     * @defaultValue `false`
     */
    preserveConsecutiveUppercase?: boolean;

    /**
     * Keys that stay unchanged. A string matches the whole key. A regular
     * expression matches when it tests true. The call does not change
     * `lastIndex`.
     *
     * @defaultValue `[]`
     */
    exclude?: readonly (string | RegExp)[];

    /**
     * Paths whose descendant keys stay unchanged.
     *
     * The key named by the path is still converted. Paths are matched against
     * the original key names, before conversion. A dot path and a JSON Pointer
     * are read with `pathStyle`.
     *
     * @defaultValue `[]`
     */
    stopPaths?: readonly ObjectPath[];

    /**
     * How string values in `stopPaths` are parsed.
     *
     * @defaultValue `"dot"`
     */
    pathStyle?: PathStyle;
}
