import type { ArrayConfig } from "../types/config.types.js";
import type { Equals } from "../types/equals.types.js";
import { assertChoice, typeError } from "./errors.utils.js";
import { assertConcurrency } from "./number.utils.js";
import {
    assertLocale,
    sortNullPlacements,
    sortSensitivities,
} from "./locale.utils.js";

/**
 * Config stored on an instance after validation.
 *
 * Fields the caller omitted stay absent, so per-call values and the built-in
 * defaults still apply.
 */
export interface ResolvedArrayConfig {
    readonly equals?: Equals<unknown>;
    readonly locale?: string | readonly string[];
    readonly numeric?: boolean;
    readonly sensitivity?: "base" | "accent" | "case" | "variant";
    readonly nulls?: "first" | "last";
    readonly random?: () => number;
    readonly concurrency?: number;
}

/**
 * Validates `config` once and returns a frozen copy.
 *
 * `undefined` is an empty config. Unused fields are still validated so a
 * typo fails at creation on every factory.
 *
 * @param config - The caller's defaults.
 * @returns A frozen config.
 * @throws {@link TypeError} When `config` is not an object, or a field has the wrong type.
 * @throws {@link RangeError} When a field is the right type but not usable.
 */
export function resolveArrayConfig(
    config: ArrayConfig | undefined,
): ResolvedArrayConfig {
    if (config === undefined) {
        return Object.freeze({});
    }
    if (
        config === null ||
        typeof config !== "object" ||
        Array.isArray(config)
    ) {
        throw typeError("config", "an object", config);
    }
    const equals = readEquals(config.equals);
    const locale = readLocale(config.locale);
    const numeric = readBoolean("numeric", config.numeric);
    assertChoice("sensitivity", config.sensitivity, sortSensitivities);
    assertChoice("nulls", config.nulls, sortNullPlacements);
    const random = readRandom(config.random);
    const concurrency = assertConcurrency("concurrency", config.concurrency);

    const resolved: {
        equals?: Equals<unknown>;
        locale?: string | readonly string[];
        numeric?: boolean;
        sensitivity?: "base" | "accent" | "case" | "variant";
        nulls?: "first" | "last";
        random?: () => number;
        concurrency?: number;
    } = {};
    if (equals !== undefined) {
        resolved.equals = equals;
    }
    if (locale !== undefined) {
        resolved.locale = locale;
    }
    if (numeric !== undefined) {
        resolved.numeric = numeric;
    }
    if (config.sensitivity !== undefined) {
        resolved.sensitivity = config.sensitivity;
    }
    if (config.nulls !== undefined) {
        resolved.nulls = config.nulls;
    }
    if (random !== undefined) {
        resolved.random = random;
    }
    if (concurrency !== undefined) {
        resolved.concurrency = concurrency;
    }
    return Object.freeze(resolved);
}

/**
 * @param equals - The candidate comparer.
 * @returns The comparer, or `undefined` when it was omitted.
 */
function readEquals(equals: unknown): Equals<unknown> | undefined {
    if (equals === undefined) {
        return undefined;
    }
    if (typeof equals !== "function") {
        throw typeError("equals", "a function", equals);
    }
    return equals as Equals<unknown>;
}

/**
 * @param locale - The candidate locale.
 * @returns A string, a frozen copy of a tag list, or `undefined`.
 */
function readLocale(locale: unknown): string | readonly string[] | undefined {
    if (locale === undefined) {
        return undefined;
    }
    assertLocale(locale as string | readonly string[]);
    if (typeof locale === "string") {
        return locale;
    }
    return Object.freeze([...(locale as readonly string[])]);
}

/**
 * @param name - Field name.
 * @param value - The candidate boolean.
 * @returns The boolean, or `undefined` when it was omitted.
 */
function readBoolean(name: string, value: unknown): boolean | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "boolean") {
        throw typeError(name, "a boolean", value);
    }
    return value;
}

/**
 * @param random - The candidate random source.
 * @returns The function, or `undefined` when it was omitted.
 */
function readRandom(random: unknown): (() => number) | undefined {
    if (random === undefined) {
        return undefined;
    }
    if (typeof random !== "function") {
        throw typeError("random", "a function", random);
    }
    return random as () => number;
}

/**
 * Copies config fields onto a params object when the call omitted them.
 *
 * A call property that is present, including an explicit `undefined`, is
 * left alone. The implementation then treats `undefined` as the built-in
 * default rather than the instance default.
 *
 * @param params - A shallow copy of the call's params.
 * @param config - The frozen instance config.
 * @param fields - Config keys this function understands.
 */
export function assignConfigDefaults(
    params: Record<string, unknown>,
    config: ResolvedArrayConfig,
    fields: readonly (keyof ResolvedArrayConfig)[],
): void {
    for (const field of fields) {
        if (params[field] === undefined && config[field] !== undefined) {
            params[field] = config[field];
        }
    }
}
