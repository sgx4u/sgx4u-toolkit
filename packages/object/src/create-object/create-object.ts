import { applyObjectPatch } from "../apply-object-patch/apply-object-patch.js";
import { applyPathUpdates } from "../apply-path-updates/apply-path-updates.js";
import { assign } from "../assign/assign.js";
import { clone } from "../clone/clone.js";
import { cloneDeep } from "../clone-deep/clone-deep.js";
import {
    cloneContinue,
    cloneDeepWith,
} from "../clone-deep-with/clone-deep-with.js";
import { convertKeys } from "../convert-keys/convert-keys.js";
import { createEmptyObject } from "../create-empty-object/create-empty-object.js";
import { defaults } from "../defaults/defaults.js";
import { defaultsDeep } from "../defaults-deep/defaults-deep.js";
import { diffObjects } from "../diff-objects/diff-objects.js";
import { evolve } from "../evolve/evolve.js";
import { findKey } from "../find-key/find-key.js";
import { findLastKey } from "../find-last-key/find-last-key.js";
import { findPath } from "../find-path/find-path.js";
import { findValue } from "../find-value/find-value.js";
import { flattenObject } from "../flatten-object/flatten-object.js";
import { formatObjectPath } from "../format-object-path/format-object-path.js";
import { freezeDeep } from "../freeze-deep/freeze-deep.js";
import { fromMap } from "../from-map/from-map.js";
import { fromObjectEntries } from "../from-object-entries/from-object-entries.js";
import { getObjectEntries } from "../get-object-entries/get-object-entries.js";
import { getObjectKeys } from "../get-object-keys/get-object-keys.js";
import { getObjectSize } from "../get-object-size/get-object-size.js";
import { getObjectValues } from "../get-object-values/get-object-values.js";
import { getPath } from "../get-path/get-path.js";
import { getPaths } from "../get-paths/get-paths.js";
import { hasCircularReference } from "../has-circular-reference/has-circular-reference.js";
import { hasKey } from "../has-key/has-key.js";
import { hasOwnKey } from "../has-own-key/has-own-key.js";
import { hasPath } from "../has-path/has-path.js";
import { invert } from "../invert/invert.js";
import { invertBy } from "../invert-by/invert-by.js";
import { isDeepFrozen } from "../is-deep-frozen/is-deep-frozen.js";
import { isEmptyObject } from "../is-empty-object/is-empty-object.js";
import { isEqual } from "../is-equal/is-equal.js";
import { isEqualWith } from "../is-equal-with/is-equal-with.js";
import { isFrozenObject } from "../is-frozen-object/is-frozen-object.js";
import { isJSONArray } from "../is-json-array/is-json-array.js";
import { isJSONObject } from "../is-json-object/is-json-object.js";
import { isJSONValue } from "../is-json-value/is-json-value.js";
import { isMap } from "../is-map/is-map.js";
import { isMatch } from "../is-match/is-match.js";
import { isMatchWith } from "../is-match-with/is-match-with.js";
import { isNullPrototypeObject } from "../is-null-prototype-object/is-null-prototype-object.js";
import { isObjectLike } from "../is-object-like/is-object-like.js";
import { isPlainObject } from "../is-plain-object/is-plain-object.js";
import { isSet } from "../is-set/is-set.js";
import { isShallowEqual } from "../is-shallow-equal/is-shallow-equal.js";
import { isValidJSON } from "../is-valid-json/is-valid-json.js";
import { isWeakMap } from "../is-weak-map/is-weak-map.js";
import { isWeakSet } from "../is-weak-set/is-weak-set.js";
import { listCircularPaths } from "../list-circular-paths/list-circular-paths.js";
import { mapEntries, mapSkip } from "../map-entries/map-entries.js";
import { mapKeys } from "../map-keys/map-keys.js";
import { mapValues } from "../map-values/map-values.js";
import { maskValues } from "../mask-values/mask-values.js";
import { mergeDeep } from "../merge-deep/merge-deep.js";
import { omit } from "../omit/omit.js";
import { omitBy } from "../omit-by/omit-by.js";
import { omitPaths } from "../omit-paths/omit-paths.js";
import { parseJSON } from "../parse-json/parse-json.js";
import { parseObjectPath } from "../parse-object-path/parse-object-path.js";
import { pick } from "../pick/pick.js";
import { pickBy } from "../pick-by/pick-by.js";
import { pickPaths } from "../pick-paths/pick-paths.js";
import { preventExtensionsDeep } from "../prevent-extensions-deep/prevent-extensions-deep.js";
import { removeEmptyValues } from "../remove-empty-values/remove-empty-values.js";
import { renameKeys } from "../rename-keys/rename-keys.js";
import { revertObjectPatch } from "../revert-object-patch/revert-object-patch.js";
import { sanitizeObject } from "../sanitize-object/sanitize-object.js";
import { sealDeep } from "../seal-deep/seal-deep.js";
import { setPath } from "../set-path/set-path.js";
import { sortKeys } from "../sort-keys/sort-keys.js";
import { splitObject } from "../split-object/split-object.js";
import { stringifyJSON } from "../stringify-json/stringify-json.js";
import { toMap } from "../to-map/to-map.js";
import { transformObject } from "../transform-object/transform-object.js";
import { unflattenObject } from "../unflatten-object/unflatten-object.js";
import { unsetPath } from "../unset-path/unset-path.js";
import { updatePath } from "../update-path/update-path.js";
import { walkObject } from "../walk-object/walk-object.js";
import { zipObject } from "../zip-object/zip-object.js";
import {
    arrayMergeValues,
    circularValues,
    emptyValueNames,
    keyCaseValues,
    pathStyleValues,
    prototypeKeyValues,
    prototypePolicyValues,
} from "../constants/object-options.constants.js";
import type {
    ArrayMerge,
    CircularPolicy,
    EmptyValue,
    KeyCase,
    ObjectConfig,
    PrototypeKeys,
    PrototypePolicy,
} from "../types/object-config.types.js";
import type { PathStyle } from "../types/path.types.js";
import {
    describeReceived,
    readChoice,
    readPathDelimiter,
} from "../utils/describe-received.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import { readOwnProperty } from "../utils/dangerous-key.utils.js";
import { isPlainObjectValue } from "../utils/value-kind.utils.js";
import type { ObjectInstance } from "./create-object.types.js";

/**
 * Builds a frozen object API with `config` bound in.
 *
 * Per-call fields replace the config. Fields the config omits keep each
 * function's own default, so `flattenObject` stays on `circular: "skip"`
 * until the config sets `circular`. `stringifyJSON` ignores `circular:
 * "preserve"` because that function only accepts `"throw"`, `"skip"`, and
 * `"replace"`. There is no module-level state. Two instances do not affect
 * each other or the standalone functions.
 *
 * @param config - Defaults for the bound functions. Omitted means each function's own default.
 * @returns A frozen instance of the root functions.
 * @throws {TypeError} When `config` is present and is not a plain object.
 * @throws {RangeError} When a known field has an unknown value, including an empty `pathDelimiter`.
 * @example
 * const object = createObject({ arrayMerge: "concat", prototypeKeys: "throw" });
 */
export function createObject(config?: ObjectConfig): ObjectInstance {
    const bound = readBoundConfig(config);
    const pathDefaults = pickDefined({
        pathDelimiter: bound.pathDelimiter,
        pathStyle: bound.pathStyle,
        prototypeKeys: bound.prototypeKeys,
    });
    const mergeDefaults = pickDefined({
        arrayMerge: bound.arrayMerge,
        circular: bound.circular,
        prototypeKeys: bound.prototypeKeys,
    });
    const symbolDefaults = pickDefined({
        includeNonEnumerable: bound.includeNonEnumerable,
        includeSymbols: bound.includeSymbols,
    });

    const instance: ObjectInstance = {
        applyObjectPatch: bindParams(applyObjectPatch, {}),
        applyPathUpdates: bindParams(applyPathUpdates, pathDefaults),
        assign: bindParams(assign, {}),
        clone,
        cloneContinue,
        cloneDeep: (value: unknown): unknown =>
            bindValueForm(
                cloneDeep,
                value,
                "value",
                ["value", "circular", "prototypes", "prototypeKeys"],
                pickDefined({
                    circular: bound.circular,
                    prototypeKeys: bound.prototypeKeys,
                    prototypes: bound.prototypes,
                }),
            ),
        cloneDeepWith: bindParams(
            cloneDeepWith,
            pickDefined({
                circular: bound.circular,
                prototypes: bound.prototypes,
            }),
        ),
        convertKeys: bindParams(convertKeys, {
            ...pickDefined({
                pathStyle: bound.pathStyle,
                preserveConsecutiveUppercase:
                    bound.preserveConsecutiveUppercase,
            }),
            ...(bound.keyCase === undefined ? {} : { case: bound.keyCase }),
        }),
        createEmptyObject,
        createObject: (next?: ObjectConfig): ObjectInstance =>
            createObject(mergeConfig(config, next)),
        defaults: bindParams(defaults, {}),
        defaultsDeep: bindParams(
            defaultsDeep,
            pickDefined({
                arrayMerge: bound.arrayMerge,
                prototypeKeys: bound.prototypeKeys,
            }),
        ),
        diffObjects: bindParams(
            diffObjects,
            pickDefined({ includeSymbols: bound.includeSymbols }),
        ),
        evolve: bindParams(evolve, {}),
        findKey: bindParams(findKey, {}),
        findLastKey: bindParams(findLastKey, {}),
        findPath: bindParams(
            findPath,
            pickDefined({
                pathDelimiter: bound.pathDelimiter,
                pathStyle: bound.pathStyle,
            }),
        ),
        findValue: bindParams(findValue, {}),
        flattenObject: bindParams(flattenObject, {
            ...pickDefined({
                circular: bound.circular,
                maxDepth: bound.maxDepth,
            }),
            ...(bound.pathDelimiter === undefined
                ? {}
                : { delimiter: bound.pathDelimiter }),
        }),
        formatObjectPath: bindParams(
            formatObjectPath,
            pickDefined({
                pathDelimiter: bound.pathDelimiter,
                pathStyle: bound.pathStyle,
            }),
        ),
        freezeDeep: (value: unknown): unknown =>
            bindValueForm(
                freezeDeep,
                value,
                "value",
                ["value", "circular"],
                pickDefined({
                    circular: bound.circular,
                }),
            ),
        fromMap,
        fromObjectEntries,
        getObjectEntries: ((value: unknown): unknown =>
            bindValueForm(
                getObjectEntries,
                value,
                "object",
                ["object", "includeSymbols", "includeNonEnumerable"],
                symbolDefaults,
            )) as ObjectInstance["getObjectEntries"],
        getObjectKeys: ((value: unknown): unknown =>
            bindValueForm(
                getObjectKeys,
                value,
                "object",
                ["object", "includeSymbols", "includeNonEnumerable"],
                symbolDefaults,
            )) as ObjectInstance["getObjectKeys"],
        getObjectSize: ((value: unknown): unknown =>
            bindValueForm(
                getObjectSize,
                value,
                "object",
                ["object", "deep", "includeSymbols"],
                pickDefined({ includeSymbols: bound.includeSymbols }),
            )) as ObjectInstance["getObjectSize"],
        getObjectValues: ((value: unknown): unknown =>
            bindValueForm(
                getObjectValues,
                value,
                "object",
                ["object", "includeSymbols", "includeNonEnumerable"],
                symbolDefaults,
            )) as ObjectInstance["getObjectValues"],
        getPath: bindParams(getPath, pathDefaults) as ObjectInstance["getPath"],
        getPaths: bindParams(
            getPaths,
            pickDefined({
                pathDelimiter: bound.pathDelimiter,
                pathStyle: bound.pathStyle,
            }),
        ),
        hasCircularReference,
        hasKey: bindParams(hasKey, {}),
        hasOwnKey: bindParams(hasOwnKey, {}),
        hasPath: bindParams(hasPath, pathDefaults),
        invert: ((value: unknown): unknown =>
            bindValueForm(
                invert as (value: unknown) => unknown,
                value,
                "object",
                ["object", "duplicateValues"],
                {},
            )) as ObjectInstance["invert"],
        invertBy: bindParams(invertBy, {}),
        isDeepFrozen,
        isEmptyObject,
        isEqual: bindParams(
            isEqual,
            pickDefined({
                includeNonEnumerable: bound.includeNonEnumerable,
                includeSymbols: bound.includeSymbols,
            }),
        ),
        isEqualWith: bindParams(
            isEqualWith,
            pickDefined({ includeSymbols: bound.includeSymbols }),
        ),
        isFrozenObject,
        isJSONArray,
        isJSONObject,
        isJSONValue,
        isMap,
        isMatch: bindParams(isMatch, {}),
        isMatchWith: bindParams(isMatchWith, {}),
        isNullPrototypeObject,
        isObjectLike,
        isPlainObject,
        isSet,
        isShallowEqual: bindParams(
            isShallowEqual,
            pickDefined({ includeSymbols: bound.includeSymbols }),
        ),
        isValidJSON,
        isWeakMap,
        isWeakSet,
        listCircularPaths: (value: unknown): string[] =>
            bindValueForm(
                listCircularPaths,
                value,
                "value",
                ["value", "pathStyle", "pathDelimiter"],
                pickDefined({
                    pathDelimiter: bound.pathDelimiter,
                    pathStyle: bound.pathStyle,
                }),
            ) as string[],
        mapEntries: bindParams(mapEntries, {}),
        mapKeys: bindParams(mapKeys, {}),
        mapSkip,
        mapValues: bindParams(mapValues, {}),
        maskValues: bindParams(
            maskValues,
            pickDefined({
                pathDelimiter: bound.pathDelimiter,
                pathStyle: bound.pathStyle,
            }),
        ),
        mergeDeep: bindParams(mergeDeep, mergeDefaults),
        omit: bindParams(omit, {}),
        omitBy: bindParams(omitBy, {}),
        omitPaths: bindParams(
            omitPaths,
            pickDefined({
                pathDelimiter: bound.pathDelimiter,
                pathStyle: bound.pathStyle,
            }),
        ),
        parseJSON,
        parseObjectPath: (value: unknown): ReturnType<typeof parseObjectPath> =>
            bindValueForm(
                parseObjectPath as (value: unknown) => unknown,
                value,
                "path",
                ["path", "pathStyle", "pathDelimiter"],
                pickDefined({
                    pathDelimiter: bound.pathDelimiter,
                    pathStyle: bound.pathStyle,
                }),
            ) as ReturnType<typeof parseObjectPath>,
        pick: bindParams(pick, {}),
        pickBy: bindParams(pickBy, {}),
        pickPaths: bindParams(
            pickPaths,
            pickDefined({
                pathDelimiter: bound.pathDelimiter,
                pathStyle: bound.pathStyle,
            }),
        ),
        preventExtensionsDeep: (value: unknown): unknown =>
            bindValueForm(
                preventExtensionsDeep,
                value,
                "value",
                ["value", "circular"],
                pickDefined({ circular: bound.circular }),
            ),
        removeEmptyValues: bindParams(
            removeEmptyValues,
            pickDefined({ emptyValues: bound.emptyValues }),
        ),
        renameKeys: bindParams(renameKeys, {}),
        revertObjectPatch: bindParams(revertObjectPatch, {}),
        sanitizeObject,
        sealDeep: (value: unknown): unknown =>
            bindValueForm(
                sealDeep,
                value,
                "value",
                ["value", "circular"],
                pickDefined({
                    circular: bound.circular,
                }),
            ),
        setPath: bindParams(setPath, pathDefaults),
        sortKeys: bindParams(sortKeys, pickDefined({ locale: bound.locale })),
        splitObject: bindParams(splitObject, {}),
        stringifyJSON: (value: unknown): string | undefined => {
            const circular =
                bound.circular === "throw" ||
                bound.circular === "skip" ||
                bound.circular === "replace"
                    ? bound.circular
                    : undefined;
            return bindValueForm(
                stringifyJSON,
                value,
                "value",
                ["value", "space", "stable", "circular"],
                pickDefined({ circular }),
            ) as string | undefined;
        },
        toMap,
        transformObject: bindParams(
            transformObject,
            {},
        ) as ObjectInstance["transformObject"],
        unflattenObject: bindParams(
            unflattenObject,
            pickDefined({ prototypeKeys: bound.prototypeKeys }),
        ),
        unsetPath: bindParams(unsetPath, pathDefaults),
        updatePath: bindParams(updatePath, pathDefaults),
        walkObject: bindParams(
            walkObject,
            pickDefined({ maxDepth: bound.maxDepth }),
        ),
        zipObject: bindParams(zipObject, {}),
    };
    return Object.freeze(instance);
}

interface BoundConfig {
    arrayMerge?: ArrayMerge;
    circular?: CircularPolicy;
    emptyValues?: readonly EmptyValue[];
    includeNonEnumerable?: boolean;
    includeSymbols?: boolean;
    keyCase?: KeyCase;
    locale?: string | readonly string[];
    maxDepth?: number;
    pathDelimiter?: string;
    pathStyle?: PathStyle;
    preserveConsecutiveUppercase?: boolean;
    prototypeKeys?: PrototypeKeys;
    prototypes?: PrototypePolicy;
}

/**
 * Validates `config` and keeps only the fields the caller set.
 *
 * @param config - The caller config.
 * @returns The fields that should override function defaults.
 * @throws {TypeError} When `config` is present and is not a plain object.
 * @throws {RangeError} When a known field is invalid.
 */
function readBoundConfig(config: ObjectConfig | undefined): BoundConfig {
    if (config === undefined) {
        return {};
    }
    if (!isPlainObjectValue(config)) {
        throw new TypeError(
            `\`config\` must be a plain object; received ${describeReceived(config)}.`,
        );
    }
    const bound: BoundConfig = {};
    if (Object.hasOwn(config, "pathStyle")) {
        bound.pathStyle = readChoice(
            readOwnProperty(config, "pathStyle"),
            "pathStyle",
            pathStyleValues,
            "dot",
        );
    }
    if (Object.hasOwn(config, "pathDelimiter")) {
        bound.pathDelimiter = readPathDelimiter(
            readOwnProperty(config, "pathDelimiter"),
            ".",
        );
    }
    if (Object.hasOwn(config, "arrayMerge")) {
        bound.arrayMerge = readChoice(
            readOwnProperty(config, "arrayMerge"),
            "arrayMerge",
            arrayMergeValues,
            "replace",
        );
    }
    if (Object.hasOwn(config, "prototypeKeys")) {
        bound.prototypeKeys = readChoice(
            readOwnProperty(config, "prototypeKeys"),
            "prototypeKeys",
            prototypeKeyValues,
            "skip",
        );
    }
    if (Object.hasOwn(config, "circular")) {
        bound.circular = readChoice(
            readOwnProperty(config, "circular"),
            "circular",
            circularValues,
            "preserve",
        );
    }
    if (Object.hasOwn(config, "keyCase")) {
        bound.keyCase = readChoice(
            readOwnProperty(config, "keyCase"),
            "keyCase",
            keyCaseValues,
            "camelCase",
        );
    }
    if (Object.hasOwn(config, "includeSymbols")) {
        bound.includeSymbols = readBoolean(
            readOwnProperty(config, "includeSymbols"),
            "includeSymbols",
        );
    }
    if (Object.hasOwn(config, "includeNonEnumerable")) {
        bound.includeNonEnumerable = readBoolean(
            readOwnProperty(config, "includeNonEnumerable"),
            "includeNonEnumerable",
        );
    }
    if (Object.hasOwn(config, "emptyValues")) {
        bound.emptyValues = readEmptyValues(
            readOwnProperty(config, "emptyValues"),
        );
    }
    if (Object.hasOwn(config, "locale")) {
        bound.locale = readLocale(readOwnProperty(config, "locale"));
    }
    if (Object.hasOwn(config, "preserveConsecutiveUppercase")) {
        bound.preserveConsecutiveUppercase = readBoolean(
            readOwnProperty(config, "preserveConsecutiveUppercase"),
            "preserveConsecutiveUppercase",
        );
    }
    if (Object.hasOwn(config, "prototypes")) {
        bound.prototypes = readChoice(
            readOwnProperty(config, "prototypes"),
            "prototypes",
            prototypePolicyValues,
            "strip",
        );
    }
    if (Object.hasOwn(config, "maxDepth")) {
        bound.maxDepth = readMaxDepth(readOwnProperty(config, "maxDepth"));
    }
    return bound;
}

/**
 * Layers `next` over `config`.
 *
 * @param config - The instance config.
 * @param next - A later config. Omitted repeats `config`.
 * @returns The combined config.
 * @throws {TypeError} When `next` is present and is not a plain object.
 */
function mergeConfig(
    config: ObjectConfig | undefined,
    next: ObjectConfig | undefined,
): ObjectConfig | undefined {
    if (next === undefined) {
        return config;
    }
    if (!isPlainObjectValue(next)) {
        throw new TypeError(
            `\`config\` must be a plain object; received ${describeReceived(next)}.`,
        );
    }
    return { ...(config ?? {}), ...next };
}

/**
 * Calls `implementation` with `defaults` under the call's own fields.
 *
 * @param implementation - The standalone function.
 * @param defaults - Config fields that apply to this function.
 * @returns A function with those defaults bound in.
 */
function bindParams<Params extends object, Result>(
    implementation: (params: Params) => Result,
    defaults: object,
): (params: Params) => Result {
    return (params: Params): Result => {
        if (!isPlainObjectValue(params)) {
            return implementation(params);
        }
        return implementation({
            ...defaults,
            ...definedFields(params),
        } as Params);
    };
}

/**
 * Applies config defaults to either a bare value or an options object.
 *
 * @param implementation - The standalone function.
 * @param value - The caller argument.
 * @param requiredKey - The key that marks the options form.
 * @param allowedKeys - Keys allowed on the options form.
 * @param defaults - Config fields to merge into the options form.
 * @returns The function result.
 */
function bindValueForm(
    implementation: (value: unknown) => unknown,
    value: unknown,
    requiredKey: string,
    allowedKeys: readonly string[],
    defaults: Record<string, unknown>,
): unknown {
    if (isParameterRecord(value, requiredKey, allowedKeys)) {
        return implementation({ ...defaults, ...definedFields(value) });
    }
    if (Object.keys(defaults).length === 0) {
        return implementation(value);
    }
    return implementation({ ...defaults, [requiredKey]: value });
}

/**
 * Copies fields whose value is not `undefined`.
 *
 * @param value - A record that may contain holes.
 * @returns A record of present fields.
 */
function definedFields(value: object): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
        const property = (value as Record<string, unknown>)[key];
        if (property !== undefined) {
            result[key] = property;
        }
    }
    return result;
}

/**
 * Drops `undefined` fields so optional properties stay omitted.
 *
 * @param value - A partial record.
 * @returns The same fields, without `undefined`.
 */
function pickDefined<T extends object>(value: T): Partial<T> {
    return definedFields(value) as Partial<T>;
}

/**
 * Reads a boolean option.
 *
 * @param value - The raw option.
 * @param name - The option name.
 * @returns The boolean.
 * @throws {RangeError} When `value` is not a boolean.
 */
function readBoolean(value: unknown, name: string): boolean {
    if (typeof value === "boolean") {
        return value;
    }
    throw new RangeError(
        `\`${name}\` must be a boolean; received ${describeReceived(value)}.`,
    );
}

/**
 * Reads `emptyValues`.
 *
 * @param value - The raw option.
 * @returns The allowed names.
 * @throws {RangeError} When `value` is not an array of known names.
 */
function readEmptyValues(value: unknown): readonly EmptyValue[] {
    if (!Array.isArray(value)) {
        throw new RangeError(
            `\`emptyValues\` must be an array of empty-value names; received ${describeReceived(value)}.`,
        );
    }
    const names: EmptyValue[] = [];
    for (const entry of value) {
        names.push(
            readChoice(entry, "emptyValues", emptyValueNames, "undefined"),
        );
    }
    return names;
}

/**
 * Reads `locale`.
 *
 * @param value - The raw option.
 * @returns A locale string or a list of locale strings.
 * @throws {RangeError} When `value` is not a string or a list of strings.
 */
function readLocale(value: unknown): string | readonly string[] {
    if (typeof value === "string") {
        return value;
    }
    if (
        Array.isArray(value) &&
        value.every((entry) => typeof entry === "string")
    ) {
        return value as string[];
    }
    throw new RangeError(
        `\`locale\` must be a string or a list of strings; received ${describeReceived(value)}.`,
    );
}

/**
 * Reads `maxDepth`.
 *
 * @param value - The raw option.
 * @returns A non-negative finite number, or `Infinity`.
 * @throws {RangeError} When `value` is not that kind of number.
 */
function readMaxDepth(value: unknown): number {
    if (
        typeof value === "number" &&
        (value === Number.POSITIVE_INFINITY ||
            (Number.isFinite(value) && value >= 0))
    ) {
        return value;
    }
    throw new RangeError(
        `\`maxDepth\` must be a non-negative number; received ${describeReceived(value)}.`,
    );
}
