import type {
    ArrayMerge,
    CircularPolicy,
    EmptyValue,
    KeyCase,
    PrototypeKeys,
    PrototypePolicy,
} from "../types/object-config.types.js";
import type { PathStyle } from "../types/path.types.js";

/** Allowed `pathStyle` values, in error-message order. */
export const pathStyleValues: readonly PathStyle[] = ["dot", "json-pointer"];

/** Allowed `arrayMerge` values, in error-message order. */
export const arrayMergeValues: readonly ArrayMerge[] = [
    "replace",
    "concat",
    "index",
];

/** Allowed `prototypeKeys` values, in error-message order. */
export const prototypeKeyValues: readonly PrototypeKeys[] = [
    "skip",
    "throw",
    "keep",
];

/** Allowed `circular` values, in error-message order. */
export const circularValues: readonly CircularPolicy[] = [
    "preserve",
    "skip",
    "throw",
    "replace",
];

/** Allowed `case` values, in error-message order. */
export const keyCaseValues: readonly KeyCase[] = [
    "camelCase",
    "snakeCase",
    "kebabCase",
    "pascalCase",
    "constantCase",
    "upper",
    "lower",
];

/** Allowed `emptyValues` entries, in error-message order. */
export const emptyValueNames: readonly EmptyValue[] = [
    "undefined",
    "null",
    "emptyString",
    "emptyArray",
    "emptyObject",
    "nan",
];

/** Allowed `prototypes` values, in error-message order. */
export const prototypePolicyValues: readonly PrototypePolicy[] = [
    "strip",
    "keep",
];

/** Allowed `duplicateValues` values, in error-message order. */
export const duplicateValuePolicies = [
    "last",
    "first",
    "array",
    "throw",
] as const;

/** Default dot-path separator. */
export const defaultPathDelimiter = ".";

/** Default replacement used by `maskValues`. */
export const defaultMaskText = "[Redacted]";

/** Marker `stringifyJSON` writes when `circular` is `"replace"`. */
export const circularMarker = "[Circular]";
