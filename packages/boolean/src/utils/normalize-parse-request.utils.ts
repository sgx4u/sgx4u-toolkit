import type { RawParseOptions } from "./resolve-parse-settings.utils.js";

/** Keys a parse options object may set, not including `value`. */
export type ParseOptionKey =
    | "locale"
    | "truthyWords"
    | "falsyWords"
    | "wordListMode"
    | "caseSensitive"
    | "trim"
    | "lenient"
    | "fallback";

/**
 * A parse call split into the value and the options the caller wrote.
 */
export interface NormalizedParseRequest {
    /** The value to recognize. */
    value: unknown;
    /** Only keys the caller set on the options object. */
    options: RawParseOptions;
    /** Option names present on the object. `value` is not included. */
    providedKeys: ReadonlySet<ParseOptionKey>;
}

const parseOptionKeys: readonly ParseOptionKey[] = [
    "locale",
    "truthyWords",
    "falsyWords",
    "wordListMode",
    "caseSensitive",
    "trim",
    "lenient",
    "fallback",
] as const;

/**
 * Reads either a bare value or one flat object that owns `value`.
 *
 * An object is the options form only when it has an own `value` property.
 * Any other object, including an array, is the value to parse and is not
 * a token. Inherited `value` properties are ignored.
 *
 * @param valueOrInput - The direct argument of `parseBoolean` or `isParseableBoolean`.
 * @returns The value and the option fields the object actually contained.
 */
export function normalizeParseRequest(
    valueOrInput: unknown,
): NormalizedParseRequest {
    if (!isParseInputRecord(valueOrInput)) {
        return {
            value: valueOrInput,
            options: {},
            providedKeys: new Set<ParseOptionKey>(),
        };
    }

    const record = valueOrInput as Record<string, unknown>;
    const options: RawParseOptions = {};
    const providedKeys = new Set<ParseOptionKey>();
    for (const key of parseOptionKeys) {
        if (!Object.hasOwn(record, key)) {
            continue;
        }
        providedKeys.add(key);
        options[key] = record[key];
    }
    return {
        value: record.value,
        options,
        providedKeys,
    };
}

/**
 * Whether `value` is the flat options object rather than a token.
 *
 * @param value - The direct argument.
 * @returns `true` when `value` is a non-array object with an own `value` property.
 */
function isParseInputRecord(value: unknown): boolean {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.hasOwn(value, "value")
    );
}
