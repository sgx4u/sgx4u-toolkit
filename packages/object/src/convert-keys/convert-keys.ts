import {
    defaultPathDelimiter,
    keyCaseValues,
    pathStyleValues,
} from "../constants/object-options.constants.js";
import type { KeyCase } from "../types/object-config.types.js";
import type {
    ObjectPath,
    PathSegment,
    PathStyle,
} from "../types/path.types.js";
import {
    describeReceived,
    readChoice,
} from "../utils/describe-received.utils.js";
import {
    createDictionary,
    writeOwnProperty,
} from "../utils/dangerous-key.utils.js";
import { isParameterRecord } from "../utils/parameter-record.utils.js";
import {
    canonicalInteger,
    resolvePathSegments,
} from "../utils/path-text.utils.js";
import {
    isPlainObjectValue,
    isRegExpValue,
} from "../utils/value-kind.utils.js";
import type { ConvertKeysParams } from "./convert-keys.types.js";

const convertFields = [
    "object",
    "case",
    "deep",
    "preserveConsecutiveUppercase",
    "exclude",
    "stopPaths",
    "pathStyle",
] as const;

interface ConvertState {
    keyCase: KeyCase;
    deep: boolean;
    preserveConsecutiveUppercase: boolean;
    exclude: readonly (string | RegExp)[];
    stopPaths: ReadonlySet<string>;
}

/**
 * Copies a plain object with its keys converted to another case.
 *
 * Breaks a key on an uppercase letter, on a change between a letter and a
 * digit, and on `-`, `_`, `.`, and whitespace. A leading run of `_` and `$`
 * stays as a prefix. `preserveConsecutiveUppercase` keeps a run of two or
 * more uppercase letters in its original case for `camelCase` and
 * `pascalCase`. `upper` and `lower` do not insert separators: they change the
 * case of the original text after the prefix and put the prefix back.
 * `exclude` leaves a key unchanged. `stopPaths` leaves the keys inside that
 * original path unchanged, while the path's own key may still change. A
 * stopped subtree keeps its original reference. The input is not mutated.
 * `null`, primitives, and arrays return `undefined`.
 *
 * @param params - The object and conversion options.
 * @returns The converted object, or `undefined` when `object` is not a plain object.
 * @throws {RangeError} When `case` or `pathStyle` is unknown, or a stop path cannot be parsed.
 * @throws {TypeError} When `exclude` or `stopPaths` is not an array, or an `exclude` entry is not a string or regular expression.
 * @example
 * convertKeys({ object: { user_id: 1 } });
 */
export function convertKeys(
    params: ConvertKeysParams,
): Record<string, unknown> | undefined {
    if (!isParameterRecord(params, "object", convertFields)) {
        return undefined;
    }
    const state = resolveConvertState(params);
    if (!isPlainObjectValue(params.object)) {
        return undefined;
    }
    return convertContainer(params.object, state, [], new WeakMap()) as Record<
        string,
        unknown
    >;
}

/**
 * Reads conversion options from a recognized parameter object.
 *
 * @param params - The options object.
 * @returns The normalized state.
 * @throws {RangeError} When `case` or `pathStyle` is unknown, or a stop path cannot be parsed.
 * @throws {TypeError} When `exclude` or `stopPaths` is not an array.
 */
function resolveConvertState(params: Record<string, unknown>): ConvertState {
    const pathStyle = readChoice(
        params.pathStyle,
        "pathStyle",
        pathStyleValues,
        "dot",
    );
    return {
        deep: params.deep !== false,
        exclude: readExclude(params.exclude),
        keyCase: readChoice(params.case, "case", keyCaseValues, "camelCase"),
        preserveConsecutiveUppercase:
            params.preserveConsecutiveUppercase === true,
        stopPaths: readStopPaths(params.stopPaths, pathStyle),
    };
}

/**
 * Reads `exclude`.
 *
 * @param value - The option the caller passed.
 * @returns The patterns. An omitted option is an empty list.
 * @throws {TypeError} When `value` is present and is not an array of strings and regular expressions.
 */
function readExclude(value: unknown): readonly (string | RegExp)[] {
    if (value === undefined) {
        return [];
    }
    if (!Array.isArray(value)) {
        throw new TypeError(
            `\`exclude\` must be an array of strings and regular expressions; received ${describeReceived(value)}.`,
        );
    }
    const patterns: (string | RegExp)[] = [];
    for (const pattern of value) {
        if (typeof pattern !== "string" && !isRegExpValue(pattern)) {
            throw new TypeError(
                `\`exclude\` must list strings and regular expressions; received ${describeReceived(pattern)}.`,
            );
        }
        patterns.push(pattern);
    }
    return patterns;
}

/**
 * Parses `stopPaths` into a set of original path identities.
 *
 * @param value - The option the caller passed.
 * @param pathStyle - How a string path is read.
 * @returns Identities produced by {@link pathIdentity}.
 * @throws {TypeError} When `value` is present and is not an array.
 * @throws {RangeError} When a path cannot be parsed.
 */
function readStopPaths(
    value: unknown,
    pathStyle: PathStyle,
): ReadonlySet<string> {
    if (value === undefined) {
        return new Set();
    }
    if (!Array.isArray(value)) {
        throw new TypeError(
            `\`stopPaths\` must be an array of paths; received ${describeReceived(value)}.`,
        );
    }
    const identities = new Set<string>();
    for (const path of value) {
        const segments = resolvePathSegments(
            path as ObjectPath,
            pathStyle,
            defaultPathDelimiter,
        );
        if (segments === undefined) {
            throw new RangeError(
                `\`stopPaths\` must be dot paths or JSON pointers; received ${describeReceived(path)}.`,
            );
        }
        identities.add(pathIdentity(segments));
    }
    return identities;
}

/**
 * Converts one plain object or copies one array.
 *
 * A stopped path returns the original container. The clone is registered
 * before children are converted, so a cycle points at the new container.
 *
 * @param source - A plain object or an array reached while converting deeply.
 * @param state - Conversion options.
 * @param path - The original path of `source`.
 * @param clones - Containers already converted during this call.
 * @returns The converted container, or `source` when the path is stopped.
 */
function convertContainer(
    source: object,
    state: ConvertState,
    path: readonly PathSegment[],
    clones: WeakMap<object, object>,
): object {
    if (isStopped(state, path)) {
        return source;
    }
    const cached = clones.get(source);
    if (cached !== undefined) {
        return cached;
    }
    if (Array.isArray(source)) {
        return convertArray(source, state, path, clones);
    }
    return convertPlain(source, state, path, clones);
}

/**
 * Copies an array, converting plain objects inside it when `deep` is true.
 *
 * @param source - The array being copied.
 * @param state - Conversion options.
 * @param path - The original path of the array.
 * @param clones - Containers already converted during this call.
 * @returns A new array of the same length. Holes stay holes.
 */
function convertArray(
    source: readonly unknown[],
    state: ConvertState,
    path: readonly PathSegment[],
    clones: WeakMap<object, object>,
): unknown[] {
    const copy: unknown[] = [];
    clones.set(source, copy);
    copy.length = source.length;
    for (let index = 0; index < source.length; index += 1) {
        if (!Object.hasOwn(source, index)) {
            continue;
        }
        copy[index] = convertChild(
            source[index],
            state,
            [...path, index],
            clones,
        );
    }
    return copy;
}

/**
 * Copies a plain object and converts its keys.
 *
 * @param source - The object being copied.
 * @param state - Conversion options.
 * @param path - The original path of the object.
 * @param clones - Containers already converted during this call.
 * @returns A new dictionary. A null-prototype source stays null-prototype.
 */
function convertPlain(
    source: object,
    state: ConvertState,
    path: readonly PathSegment[],
    clones: WeakMap<object, object>,
): Record<string, unknown> {
    const result = createDictionary(source);
    clones.set(source, result);
    if (!isPlainObjectValue(source)) {
        return result;
    }
    for (const key of Object.keys(source)) {
        const stored = convertChild(
            source[key],
            state,
            [...path, segmentForKey(key)],
            clones,
        );
        writeOwnProperty(result, convertedKey(key, state), stored, "skip");
    }
    return result;
}

/**
 * Converts `value` when deep conversion is still walking.
 *
 * @param value - The property or element value.
 * @param state - Conversion options.
 * @param path - The original path of `value`.
 * @param clones - Containers already converted during this call.
 * @returns The value stored in the copy.
 */
function convertChild(
    value: unknown,
    state: ConvertState,
    path: readonly PathSegment[],
    clones: WeakMap<object, object>,
): unknown {
    if (!state.deep || isStopped(state, path)) {
        return value;
    }
    if (isPlainObjectValue(value) || Array.isArray(value)) {
        return convertContainer(value, state, path, clones);
    }
    return value;
}

/**
 * Whether `path` names a subtree whose keys stay unchanged.
 *
 * @param state - Conversion options.
 * @param path - The original path.
 * @returns `true` when the path was listed in `stopPaths`.
 */
function isStopped(state: ConvertState, path: readonly PathSegment[]): boolean {
    return state.stopPaths.has(pathIdentity(path));
}

/**
 * A stable identity for a path.
 *
 * A number and a string stay distinct so a key `"0"` recorded as a canonical
 * index matches `[0]` from a parsed stop path.
 *
 * @param segments - Path segments.
 * @returns Text that compares equal for the same segments.
 */
function pathIdentity(segments: readonly PathSegment[]): string {
    let identity = "";
    for (const segment of segments) {
        identity += `${typeof segment}:${String(segment)}\0`;
    }
    return identity;
}

/**
 * The path segment for an object key.
 *
 * Canonical integers become numbers so `a.0` and `a[0]` match a key `"0"`.
 *
 * @param key - An own enumerable key, before conversion.
 * @returns The segment stored in the original path.
 */
function segmentForKey(key: string): PathSegment {
    return canonicalInteger(key) ?? key;
}

/**
 * The key written for `key`.
 *
 * @param key - The original key.
 * @param state - Conversion options.
 * @returns `key` when it is excluded, otherwise the converted key.
 */
function convertedKey(key: string, state: ConvertState): string {
    if (isExcluded(key, state.exclude)) {
        return key;
    }
    return convertCase(key, state.keyCase, state.preserveConsecutiveUppercase);
}

/**
 * Whether `key` matches an exclude pattern.
 *
 * A regular expression is copied without the global flag so `lastIndex` on
 * the caller's expression stays unchanged.
 *
 * @param key - The original key.
 * @param exclude - Strings and regular expressions.
 * @returns `true` when the key should be copied unchanged.
 */
function isExcluded(
    key: string,
    exclude: readonly (string | RegExp)[],
): boolean {
    for (const pattern of exclude) {
        if (typeof pattern === "string") {
            if (pattern === key) {
                return true;
            }
            continue;
        }
        const flags = pattern.flags.replaceAll("g", "");
        if (new RegExp(pattern.source, flags).test(key)) {
            return true;
        }
    }
    return false;
}

/**
 * Converts one key to `keyCase`.
 *
 * @param key - The original key.
 * @param keyCase - The target case.
 * @param preserveConsecutiveUppercase - Whether an uppercase run keeps its case in camel and pascal form.
 * @returns The converted key, including its leading `_` and `$` prefix.
 */
function convertCase(
    key: string,
    keyCase: KeyCase,
    preserveConsecutiveUppercase: boolean,
): string {
    const { prefix, rest } = splitPrefix(key);
    if (keyCase === "upper" || keyCase === "lower") {
        return prefix + applyCase(rest, keyCase);
    }
    const words = splitCaseWords(rest);
    return prefix + joinWords(words, keyCase, preserveConsecutiveUppercase);
}

/**
 * Splits a leading run of `_` and `$` from the rest of a key.
 *
 * @param key - The original key.
 * @returns The prefix and the text that is converted.
 */
function splitPrefix(key: string): { prefix: string; rest: string } {
    let index = 0;
    while (index < key.length) {
        const character = key[index];
        if (character !== "_" && character !== "$") {
            break;
        }
        index += 1;
    }
    return { prefix: key.slice(0, index), rest: key.slice(index) };
}

/**
 * Uppercases or lowercases `text` without inserting separators.
 *
 * @param text - Key text after the prefix was removed.
 * @param keyCase - `"upper"` or `"lower"`.
 * @returns The cased text.
 */
function applyCase(text: string, keyCase: "upper" | "lower"): string {
    return keyCase === "upper" ? text.toUpperCase() : text.toLowerCase();
}

/**
 * Splits key text into case words.
 *
 * A separator is dropped. A new word starts at a letter/digit boundary, at an
 * uppercase letter that follows a lowercase letter, and before the last
 * uppercase letter of a run when the next letter is lowercase (`HTTPServer`
 * becomes `HTTP` and `Server`).
 *
 * @param text - Key text after the prefix was removed.
 * @returns Words in their original case. Empty when `text` has no word characters.
 */
function splitCaseWords(text: string): string[] {
    const words: string[] = [];
    let current = "";
    for (let index = 0; index < text.length; index += 1) {
        const character = text[index];
        if (character === undefined) {
            break;
        }
        if (isCaseSeparator(character)) {
            pushWord(words, current);
            current = "";
            continue;
        }
        const previous = current[current.length - 1];
        if (
            previous !== undefined &&
            startsNewCaseWord(previous, character, text[index + 1])
        ) {
            pushWord(words, current);
            current = character;
            continue;
        }
        current += character;
    }
    pushWord(words, current);
    return words;
}

/**
 * Whether `character` starts a word after `previous`.
 *
 * @param previous - The last character of the current word.
 * @param character - The character being read.
 * @param next - The character after `character`, when there is one.
 * @returns `true` when the current word should be closed first.
 */
function startsNewCaseWord(
    previous: string,
    character: string,
    next: string | undefined,
): boolean {
    const previousDigit = isAsciiDigit(previous);
    const characterDigit = isAsciiDigit(character);
    const previousLetter = isAsciiLetter(previous);
    const characterLetter = isAsciiLetter(character);
    if (
        (previousDigit && characterLetter) ||
        (previousLetter && characterDigit)
    ) {
        return true;
    }
    if (!isAsciiUpper(character)) {
        return false;
    }
    if (isAsciiLower(previous)) {
        return true;
    }
    return isAsciiUpper(previous) && next !== undefined && isAsciiLower(next);
}

/**
 * Appends a non-empty word.
 *
 * @param words - The collected words. It is mutated.
 * @param word - The current buffer.
 */
function pushWord(words: string[], word: string): void {
    if (word.length > 0) {
        words.push(word);
    }
}

/**
 * Joins words in the requested case.
 *
 * @param words - Words in their original case.
 * @param keyCase - The target case. `upper` and `lower` are handled before this call.
 * @param preserveConsecutiveUppercase - Whether an uppercase run keeps its case in camel and pascal form.
 * @returns The joined key text, without the prefix.
 */
function joinWords(
    words: readonly string[],
    keyCase: KeyCase,
    preserveConsecutiveUppercase: boolean,
): string {
    if (
        keyCase === "snakeCase" ||
        keyCase === "kebabCase" ||
        keyCase === "constantCase"
    ) {
        const separator = keyCase === "kebabCase" ? "-" : "_";
        return words
            .map((word) =>
                keyCase === "constantCase"
                    ? word.toUpperCase()
                    : word.toLowerCase(),
            )
            .join(separator);
    }
    let joined = "";
    for (let index = 0; index < words.length; index += 1) {
        const word = words[index];
        if (word === undefined) {
            continue;
        }
        joined += formatWord(
            word,
            index,
            keyCase,
            preserveConsecutiveUppercase,
        );
    }
    return joined;
}

/**
 * Formats one word for camel or pascal case.
 *
 * @param word - A word in its original case.
 * @param index - The word index. The first camel word is lowercase.
 * @param keyCase - `"camelCase"` or `"pascalCase"`.
 * @param preserveConsecutiveUppercase - Whether a run of two or more uppercase letters is kept.
 * @returns The formatted word.
 */
function formatWord(
    word: string,
    index: number,
    keyCase: KeyCase,
    preserveConsecutiveUppercase: boolean,
): string {
    if (preserveConsecutiveUppercase && isUpperRun(word)) {
        return word;
    }
    const lower = word.toLowerCase();
    const capitalize = keyCase === "pascalCase" || index > 0;
    if (!capitalize) {
        return lower;
    }
    const first = lower[0];
    if (first === undefined) {
        return lower;
    }
    return first.toUpperCase() + lower.slice(1);
}

/**
 * Whether `word` is a run of two or more ASCII uppercase letters.
 *
 * @param word - One case word.
 * @returns `true` when every character is `A` through `Z` and there are at least two.
 */
function isUpperRun(word: string): boolean {
    if (word.length < 2) {
        return false;
    }
    for (const character of word) {
        if (!isAsciiUpper(character)) {
            return false;
        }
    }
    return true;
}

/**
 * Whether `character` separates case words.
 *
 * @param character - One character.
 * @returns `true` for `-`, `_`, `.`, or whitespace.
 */
function isCaseSeparator(character: string): boolean {
    return (
        character === "-" ||
        character === "_" ||
        character === "." ||
        /\s/u.test(character)
    );
}

/**
 * Whether `character` is `A` through `Z`.
 *
 * @param character - One character.
 * @returns `true` for an ASCII uppercase letter.
 */
function isAsciiUpper(character: string): boolean {
    return character >= "A" && character <= "Z";
}

/**
 * Whether `character` is `a` through `z`.
 *
 * @param character - One character.
 * @returns `true` for an ASCII lowercase letter.
 */
function isAsciiLower(character: string): boolean {
    return character >= "a" && character <= "z";
}

/**
 * Whether `character` is an ASCII letter.
 *
 * @param character - One character.
 * @returns `true` for `A` through `Z` or `a` through `z`.
 */
function isAsciiLetter(character: string): boolean {
    return isAsciiUpper(character) || isAsciiLower(character);
}

/**
 * Whether `character` is `0` through `9`.
 *
 * @param character - One character.
 * @returns `true` for an ASCII digit.
 */
function isAsciiDigit(character: string): boolean {
    return character >= "0" && character <= "9";
}
