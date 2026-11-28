import type { PathStyle } from "./path.types.js";

/**
 * How two arrays are combined when both sides are arrays.
 */
export type ArrayMerge = "replace" | "concat" | "index";

/**
 * What a writer does with `__proto__`, `prototype`, and `constructor`.
 *
 * `"skip"` drops the key. `"throw"` raises `RangeError`. `"keep"` writes an
 * own data property and does not walk `Object.prototype`.
 */
export type PrototypeKeys = "skip" | "throw" | "keep";

/**
 * What a walker does when a nested value points at an ancestor.
 */
export type CircularPolicy = "preserve" | "skip" | "throw" | "replace";

/**
 * A key-case conversion.
 */
export type KeyCase =
    | "camelCase"
    | "snakeCase"
    | "kebabCase"
    | "pascalCase"
    | "constantCase"
    | "upper"
    | "lower";

/**
 * A value `removeEmptyValues` can drop.
 */
export type EmptyValue =
    "undefined" | "null" | "emptyString" | "emptyArray" | "emptyObject" | "nan";

/**
 * How `cloneDeep` copies a class instance.
 *
 * `"strip"` copies own enumerable properties onto a plain object.
 * `"keep"` creates an object with the same prototype and copies those properties.
 */
export type PrototypePolicy = "strip" | "keep";

/**
 * Defaults bound by `createObject`, `createObjectJSONPatch`, and `createObjectHash`.
 *
 * Every field is optional. A field that is omitted leaves each function's own
 * default in place. A field that is set becomes the default for functions that
 * accept it, and a per-call value still wins.
 */
export interface ObjectConfig {
    /**
     * @defaultValue `"dot"`
     */
    pathStyle?: PathStyle;

    /**
     * @defaultValue `"."`
     */
    pathDelimiter?: string;

    /**
     * @defaultValue `"replace"`
     */
    arrayMerge?: ArrayMerge;

    /**
     * @defaultValue `"skip"`
     */
    prototypeKeys?: PrototypeKeys;

    /**
     * Bound only when set. Clone and equality otherwise use `"preserve"`,
     * flatten uses `"skip"`, and `stringifyJSON` uses `"throw"`.
     *
     * @defaultValue `"preserve"`
     */
    circular?: CircularPolicy;

    /**
     * @defaultValue `"camelCase"`
     */
    keyCase?: KeyCase;

    /**
     * @defaultValue `false`
     */
    includeSymbols?: boolean;

    /**
     * @defaultValue `false`
     */
    includeNonEnumerable?: boolean;

    /**
     * @defaultValue `["undefined"]`
     */
    emptyValues?: readonly EmptyValue[];

    /**
     * Passed to `localeCompare` by `sortKeys`.
     *
     * @defaultValue The runtime locale.
     */
    locale?: string | readonly string[];

    /**
     * @defaultValue `false`
     */
    preserveConsecutiveUppercase?: boolean;

    /**
     * @defaultValue `"strip"`
     */
    prototypes?: PrototypePolicy;

    /**
     * @defaultValue `Infinity`
     */
    maxDepth?: number;
}
