import {
    defaultFalsyTokens,
    defaultTruthyTokens,
} from "../constants/default-tokens.constants.js";
import { localeWordsByLanguage } from "../data/locale-words.data.js";
import type { WordListMode } from "../types/parse-options.types.js";
import { describeReceived } from "./describe-received.utils.js";
import { languageSubtag } from "./language-subtag.utils.js";

/**
 * Option bag before validation. Absent fields use the parse defaults.
 */
export interface RawParseOptions {
    locale?: unknown;
    truthyWords?: unknown;
    falsyWords?: unknown;
    wordListMode?: unknown;
    caseSensitive?: unknown;
    trim?: unknown;
    lenient?: unknown;
    fallback?: unknown;
}

/**
 * Word lists after validation, trim, and case-folding.
 *
 * English tokens, locale yes/no words, and custom words stay in separate
 * sets because they are folded differently. `fallback` is stored here and
 * applied by the caller only for `parseBoolean`.
 */
export interface ResolvedParseSettings {
    caseSensitive: boolean;
    trim: boolean;
    lenient: boolean;
    locale: string | undefined;
    fallback: boolean | undefined;
    truthy: ReadonlySet<string>;
    falsy: ReadonlySet<string>;
    localeTruthy: ReadonlySet<string>;
    localeFalsy: ReadonlySet<string>;
    customTruthy: ReadonlySet<string>;
    customFalsy: ReadonlySet<string>;
}

/**
 * Validates parse options and builds the word sets they imply.
 *
 * Call this at `createBoolean` time as well as on each parse, so a bad
 * config fails before the first value arrives. The same word on both sides,
 * after trim and case-folding, throws. An empty word is skipped so it cannot
 * match an empty string.
 *
 * @param options - Fields the caller provided. Omitted fields use defaults.
 * @returns Settings `readBooleanToken` can match against.
 * @throws {TypeError} When a provided option has the wrong type, or `wordListMode` is not `"extend"` or `"replace"`.
 * @throws {RangeError} When a folded word would be both truthy and falsy.
 */
export function resolveParseSettings(
    options: RawParseOptions,
): ResolvedParseSettings {
    const locale = readLocale(options.locale);
    const wordListMode = readWordListMode(options.wordListMode);
    const caseSensitive = readBooleanOption(
        options.caseSensitive,
        "caseSensitive",
    );
    const trim = readBooleanOption(options.trim, "trim", true);
    const lenient = readBooleanOption(options.lenient, "lenient");
    const fallback = readOptionalBoolean(options.fallback, "fallback");
    const customTruthyWords = readStringArray(
        options.truthyWords,
        "truthyWords",
    );
    const customFalsyWords = readStringArray(options.falsyWords, "falsyWords");

    const truthy = new Set<string>();
    const falsy = new Set<string>();
    const localeTruthy = new Set<string>();
    const localeFalsy = new Set<string>();
    const customTruthy = new Set<string>();
    const customFalsy = new Set<string>();
    const truthySeen = new Set<string>();
    const falsySeen = new Set<string>();

    if (wordListMode === "extend") {
        for (const token of defaultTruthyTokens) {
            addWord(
                "truthy",
                foldEnglish(token, caseSensitive),
                truthy,
                truthySeen,
                falsySeen,
            );
        }
        for (const token of defaultFalsyTokens) {
            addWord(
                "falsy",
                foldEnglish(token, caseSensitive),
                falsy,
                truthySeen,
                falsySeen,
            );
        }
        if (locale !== undefined) {
            const entry = localeWordsByLanguage[languageSubtag(locale)];
            if (entry !== undefined) {
                for (const token of entry.truthy) {
                    addWord(
                        "truthy",
                        foldLocalized(token, caseSensitive, trim, locale),
                        localeTruthy,
                        truthySeen,
                        falsySeen,
                    );
                }
                for (const token of entry.falsy) {
                    addWord(
                        "falsy",
                        foldLocalized(token, caseSensitive, trim, locale),
                        localeFalsy,
                        truthySeen,
                        falsySeen,
                    );
                }
            }
        }
    }

    for (const token of customTruthyWords) {
        addWord(
            "truthy",
            foldLocalized(token, caseSensitive, trim, locale),
            customTruthy,
            truthySeen,
            falsySeen,
        );
    }
    for (const token of customFalsyWords) {
        addWord(
            "falsy",
            foldLocalized(token, caseSensitive, trim, locale),
            customFalsy,
            truthySeen,
            falsySeen,
        );
    }

    return {
        caseSensitive,
        trim,
        lenient,
        locale,
        fallback,
        truthy,
        falsy,
        localeTruthy,
        localeFalsy,
        customTruthy,
        customFalsy,
    };
}

/**
 * Records `word` on one side, or ignores an empty or duplicate word.
 *
 * @param side - Which meaning `word` carries.
 * @param word - Already trimmed and folded.
 * @param bucket - The set that will be matched with this fold.
 * @param truthySeen - Folded truthy words already accepted.
 * @param falsySeen - Folded falsy words already accepted.
 * @throws {RangeError} When `word` is already on the other side.
 */
function addWord(
    side: "truthy" | "falsy",
    word: string,
    bucket: Set<string>,
    truthySeen: Set<string>,
    falsySeen: Set<string>,
): void {
    if (word.length === 0) {
        return;
    }
    const sameSide = side === "truthy" ? truthySeen : falsySeen;
    const otherSide = side === "truthy" ? falsySeen : truthySeen;
    if (sameSide.has(word)) {
        return;
    }
    if (otherSide.has(word)) {
        throw new RangeError(
            `truthyWords and falsyWords overlap on ${JSON.stringify(word)}.`,
        );
    }
    sameSide.add(word);
    bucket.add(word);
}

/**
 * @param token - A default English token. It has no surrounding whitespace.
 * @param caseSensitive - When `true`, the token is stored unchanged.
 * @returns The form an English comparison uses.
 */
function foldEnglish(token: string, caseSensitive: boolean): string {
    if (caseSensitive) {
        return token;
    }
    return token.toLowerCase();
}

/**
 * @param token - A locale word or a custom word.
 * @param caseSensitive - When `true`, only trim is applied.
 * @param trim - When `true`, surrounding whitespace is removed.
 * @param locale - Full BCP 47 tag when the caller set one.
 * @returns The form a locale or custom comparison uses.
 */
function foldLocalized(
    token: string,
    caseSensitive: boolean,
    trim: boolean,
    locale: string | undefined,
): string {
    const trimmed = trim ? token.trim() : token;
    if (caseSensitive) {
        return trimmed;
    }
    if (locale !== undefined) {
        return trimmed.toLocaleLowerCase(locale);
    }
    return trimmed.toLowerCase();
}

/**
 * @param locale - The provided locale, or `undefined` when omitted.
 * @returns A string locale, or `undefined` when the caller omitted it.
 * @throws {TypeError} When `locale` is provided and is not a string.
 */
function readLocale(locale: unknown): string | undefined {
    if (locale === undefined) {
        return undefined;
    }
    if (typeof locale !== "string") {
        throw new TypeError(
            `locale must be a string. Received ${describeReceived(locale)}.`,
        );
    }
    return locale;
}

/**
 * @param wordListMode - The provided mode, or `undefined` when omitted.
 * @returns `"extend"` when omitted.
 * @throws {TypeError} When the mode is not `"extend"` or `"replace"`.
 */
function readWordListMode(wordListMode: unknown): WordListMode {
    if (wordListMode === undefined || wordListMode === "extend") {
        return "extend";
    }
    if (wordListMode === "replace") {
        return "replace";
    }
    throw new TypeError(
        `wordListMode must be "extend" or "replace". Received ${describeReceived(wordListMode)}.`,
    );
}

/**
 * @param value - The provided flag, or `undefined` when omitted.
 * @param name - Option name used in the error.
 * @param defaultValue - Value used when the option is omitted.
 * @returns The flag the caller set, or `defaultValue`.
 * @throws {TypeError} When `value` is provided and is not a boolean.
 */
function readBooleanOption(
    value: unknown,
    name: string,
    defaultValue = false,
): boolean {
    if (value === undefined) {
        return defaultValue;
    }
    if (typeof value !== "boolean") {
        throw new TypeError(
            `${name} must be a boolean. Received ${describeReceived(value)}.`,
        );
    }
    return value;
}

/**
 * @param value - The provided fallback, or `undefined` when omitted.
 * @param name - Option name used in the error.
 * @returns The boolean, or `undefined` when the caller omitted it.
 * @throws {TypeError} When `value` is provided and is not a boolean.
 */
function readOptionalBoolean(
    value: unknown,
    name: string,
): boolean | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value !== "boolean") {
        throw new TypeError(
            `${name} must be a boolean. Received ${describeReceived(value)}.`,
        );
    }
    return value;
}

/**
 * @param value - The provided word list, or `undefined` when omitted.
 * @param name - Option name used in the error.
 * @returns The strings, or an empty array when the caller omitted the list.
 * @throws {TypeError} When `value` is not an array of strings.
 */
function readStringArray(value: unknown, name: string): readonly string[] {
    if (value === undefined) {
        return [];
    }
    if (!Array.isArray(value)) {
        throw new TypeError(
            `${name} must be an array of strings. Received ${describeReceived(value)}.`,
        );
    }
    for (let index = 0; index < value.length; index += 1) {
        const entry = value[index];
        if (typeof entry !== "string") {
            throw new TypeError(
                `${name}[${index}] must be a string. Received ${describeReceived(entry)}.`,
            );
        }
    }
    return value;
}
