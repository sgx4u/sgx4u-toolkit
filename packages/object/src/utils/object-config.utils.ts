import {
    arrayMergeValues,
    circularValues,
    defaultPathDelimiter,
    pathStyleValues,
    prototypeKeyValues,
    prototypePolicyValues,
} from "../constants/object-options.constants.js";
import type { PrototypeKeys } from "../types/object-config.types.js";
import type { PathStyle } from "../types/path.types.js";
import { readOwnProperty } from "./dangerous-key.utils.js";
import {
    describeReceived,
    readChoice,
    readPathDelimiter,
} from "./describe-received.utils.js";
import { isPlainObjectValue } from "./value-kind.utils.js";

/**
 * Options a JSON Patch or hash factory keeps after validation.
 *
 * `pathStyle` and `pathDelimiter` are checked so a shared `ObjectConfig`
 * fails the same way for every factory. JSON Patch pointers do not read them.
 */
export interface BoundObjectConfig {
    /** A valid path style. JSON Patch does not parse dot paths. */
    pathStyle: PathStyle;
    /** A non-empty delimiter. JSON Patch does not join dot paths. */
    pathDelimiter: string;
    /** How dangerous keys are written. */
    prototypeKeys: PrototypeKeys;
}

/**
 * Validates `config` and returns the options these factories bind.
 *
 * `undefined` selects the defaults. A present value that is not a plain
 * object throws `TypeError`. Unknown keys are ignored. `keyCase`,
 * `emptyValues`, `locale`, and `maxDepth` are ignored so the JSON Patch
 * subpath can stay within its size limit. The checked keys must use their
 * allowed values. `pathDelimiter` must be a non-empty string when it is
 * present. Only own properties are read.
 *
 * @param config - The caller config, or `undefined` for the defaults.
 * @returns The bound options.
 * @throws {TypeError} When `config` is present and is not a plain object.
 * @throws {RangeError} When a known option has a value this package does not accept.
 */
export function readObjectConfig(config: unknown): BoundObjectConfig {
    if (config === undefined) {
        return {
            pathDelimiter: defaultPathDelimiter,
            pathStyle: "dot",
            prototypeKeys: "skip",
        };
    }
    if (!isPlainObjectValue(config)) {
        throw new TypeError(
            `\`config\` must be a plain object; received ${describeReceived(config)}.`,
        );
    }
    const pathStyle = readNamedChoice(
        config,
        "pathStyle",
        pathStyleValues,
        "dot",
    );
    const pathDelimiter = readPathDelimiter(
        ownOption(config, "pathDelimiter"),
        defaultPathDelimiter,
    );
    const prototypeKeys = readNamedChoice(
        config,
        "prototypeKeys",
        prototypeKeyValues,
        "skip",
    );
    readNamedChoice(config, "arrayMerge", arrayMergeValues, "replace");
    readNamedChoice(config, "circular", circularValues, "preserve");
    readNamedChoice(config, "prototypes", prototypePolicyValues, "strip");
    assertBooleanOption(ownOption(config, "includeSymbols"), "includeSymbols");
    assertBooleanOption(
        ownOption(config, "includeNonEnumerable"),
        "includeNonEnumerable",
    );
    assertBooleanOption(
        ownOption(config, "preserveConsecutiveUppercase"),
        "preserveConsecutiveUppercase",
    );
    return { pathDelimiter, pathStyle, prototypeKeys };
}

/**
 * Reads one enum option from an own property.
 *
 * @param config - The plain config object.
 * @param name - The option name.
 * @param allowed - Legal values.
 * @param fallback - Value used when the option is omitted.
 * @returns The selected value.
 * @throws {RangeError} When the own value is not allowed.
 */
function readNamedChoice<T extends string>(
    config: object,
    name: string,
    allowed: readonly T[],
    fallback: T,
): T {
    return readChoice(ownOption(config, name), name, allowed, fallback);
}

/**
 * Reads an own option without walking the prototype.
 *
 * @param config - The plain config object.
 * @param key - The option name.
 * @returns The own value, or `undefined` when the key is absent.
 */
function ownOption(config: object, key: string): unknown {
    if (!Object.hasOwn(config, key)) {
        return undefined;
    }
    return readOwnProperty(config, key);
}

/**
 * Throws when a boolean option is present and is not a boolean.
 *
 * @param value - The option value. `undefined` means the key was omitted.
 * @param name - The option name, without backticks.
 * @throws {RangeError} When `value` is present and is not a boolean.
 */
function assertBooleanOption(value: unknown, name: string): void {
    if (value === undefined || typeof value === "boolean") {
        return;
    }
    rejectOption(name, value);
}

/**
 * Throws `RangeError` for an option value this package does not accept.
 *
 * @param name - The option name, without backticks.
 * @param value - The rejected value.
 * @throws {RangeError} Always.
 */
function rejectOption(name: string, value: unknown): never {
    throw new RangeError(
        `\`${name}\` is invalid; received ${describeReceived(value)}.`,
    );
}
