import {
    html4EntityNames,
    html5NamedCharacters,
    html5OptionalSemicolon,
} from "../data/html-named-characters.data.js";
import { readEnum } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { HtmlEntityLevel } from "./escape-html-entities.types.js";

const htmlEntityLevels = ["xml", "html4", "html5"] as const;

const xmlNames: Readonly<Record<string, string>> = {
    "&": "amp",
    "<": "lt",
    ">": "gt",
    '"': "quot",
    "'": "apos",
};

/**
 * Characters that are escaped even when the active level has no name.
 */
const alwaysEscaped = new Set<string>(["&", "<", ">", '"', "'"]);

let html5Names: Map<string, string> | undefined;
let html4Names: Map<string, string> | undefined;
let html4NameSet: Set<string> | undefined;
let optionalSemicolon: Set<string> | undefined;

/**
 * Reads a `level` option.
 *
 * @param value - The option value.
 * @param fallback - Level used when `value` is omitted.
 * @returns The level.
 * @throws {@link TypeError} When `value` is present and is not a string.
 * @throws {@link RangeError} When `value` is not `xml`, `html4`, or `html5`.
 */
export function readHtmlEntityLevel(
    value: unknown,
    fallback: HtmlEntityLevel,
): HtmlEntityLevel {
    return readEnum("level", value, htmlEntityLevels, fallback);
}

/**
 * Escapes `value` at `level`.
 *
 * Named characters come from the level's map, built on the first escape
 * that needs it. A character that must be escaped and has no name becomes
 * a decimal reference such as `&#39;`. Other characters are copied.
 *
 * @param value - The text to escape.
 * @param level - The named-character set.
 * @returns The escaped text.
 */
export function escapeHTMLText(value: string, level: HtmlEntityLevel): string {
    const names = namesForLevel(level);
    let escaped = "";
    for (const character of value) {
        const name = names.get(character);
        if (name !== undefined) {
            escaped += `&${name};`;
            continue;
        }
        if (alwaysEscaped.has(character)) {
            const codePoint = character.codePointAt(0) ?? 0;
            escaped += `&#${codePoint};`;
            continue;
        }
        escaped += character;
    }
    return escaped;
}

/**
 * Escapes a string call at `fallback` unless the call sets `level`.
 *
 * A non-string returns `undefined`. Option checks still run.
 *
 * @param valueOrOptions - A string, or `value` plus `level`.
 * @param fallback - Level used when the call omits `level`.
 * @returns The escaped text, or `undefined` when the text is not a string.
 * @throws {@link TypeError} When `level` is present and is not a string.
 * @throws {@link RangeError} When `level` is not a known level.
 */
export function escapeHTMLCall(
    valueOrOptions: unknown,
    fallback: HtmlEntityLevel,
): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        level: readHtmlEntityLevel(record.level, fallback),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    return escapeHTMLText(resolved.value, resolved.options.level);
}

/**
 * Decodes a string call at `fallback` unless the call sets `level`.
 *
 * @param valueOrOptions - A string, or `value` plus `level`.
 * @param fallback - Level used when the call omits `level`.
 * @returns The decoded text, or `undefined` when the text is not a string.
 * @throws {@link TypeError} When `level` is present and is not a string.
 * @throws {@link RangeError} When `level` is not a known level.
 */
export function unescapeHTMLCall(
    valueOrOptions: unknown,
    fallback: HtmlEntityLevel,
): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        level: readHtmlEntityLevel(record.level, fallback),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    return unescapeHTMLText(resolved.value, resolved.options.level);
}

/**
 * Decodes character references in `value` at `level`.
 *
 * Named references may omit the semicolon when the name is in the HTML
 * optional-semicolon list and the level allows that name. Decimal and
 * hexadecimal numeric references may omit the semicolon. An unknown
 * reference is left in place.
 *
 * @param value - The text to decode.
 * @param level - Which names are recognized.
 * @returns The decoded text.
 */
export function unescapeHTMLText(
    value: string,
    level: HtmlEntityLevel,
): string {
    let decoded = "";
    for (let index = 0; index < value.length;) {
        if (value.charAt(index) !== "&") {
            decoded += value.charAt(index);
            index += 1;
            continue;
        }
        const reference = readReference(value, index, level);
        if (reference === undefined) {
            decoded += "&";
            index += 1;
            continue;
        }
        decoded += reference.text;
        index = reference.nextIndex;
    }
    return decoded;
}

/**
 * The character-to-name map for `level`.
 *
 * The HTML maps are built on first use. The XML map is the five names.
 *
 * @param level - The named-character set.
 * @returns A map from one character to its preferred name.
 */
function namesForLevel(level: HtmlEntityLevel): ReadonlyMap<string, string> {
    if (level === "xml") {
        return new Map(Object.entries(xmlNames));
    }
    if (level === "html4") {
        html4Names ??= buildReverseMap(html4EntityNames);
        return html4Names;
    }
    html5Names ??= buildReverseMap(Object.keys(html5NamedCharacters));
    return html5Names;
}

/**
 * Builds a character-to-name map from `names`.
 *
 * Names that expand to more than one code point are skipped. When several
 * names share a character, the shortest name wins, then an all-lowercase
 * name, then the earlier name in code-point order.
 *
 * @param names - Entity names without the leading ampersand.
 * @returns The reverse map.
 */
function buildReverseMap(names: readonly string[]): Map<string, string> {
    const map = new Map<string, string>();
    for (const name of names) {
        const characters = html5NamedCharacters[name];
        if (characters === undefined || Array.from(characters).length !== 1) {
            continue;
        }
        const current = map.get(characters);
        if (current === undefined || preferName(name, current)) {
            map.set(characters, name);
        }
    }
    return map;
}

/**
 * Whether `candidate` should replace `current` as the name for a character.
 *
 * @param candidate - A name that maps to the same character.
 * @param current - The name already stored.
 * @returns `true` when `candidate` is the better escape name.
 */
function preferName(candidate: string, current: string): boolean {
    if (candidate.length !== current.length) {
        return candidate.length < current.length;
    }
    const candidateLower = candidate === candidate.toLowerCase();
    const currentLower = current === current.toLowerCase();
    if (candidateLower !== currentLower) {
        return candidateLower;
    }
    return candidate < current;
}

/**
 * One decoded reference and the index just after it.
 */
interface DecodedReference {
    /** The replacement text. It may be more than one character. */
    text: string;
    /** Index in the source at which scanning should resume. */
    nextIndex: number;
}

/**
 * Reads one character reference that starts at `index`.
 *
 * @param value - The full source.
 * @param index - Index of the ampersand.
 * @param level - Which names are recognized.
 * @returns The reference, or `undefined` when the text is not one.
 */
function readReference(
    value: string,
    index: number,
    level: HtmlEntityLevel,
): DecodedReference | undefined {
    const rest = value.slice(index + 1);
    const numeric = readNumericReference(rest);
    if (numeric !== undefined) {
        return {
            text: numeric.text,
            nextIndex: index + 1 + numeric.consumed,
        };
    }
    return readNamedReference(rest, index, level);
}

/**
 * A numeric reference and how many characters of the body it consumed.
 */
interface NumericReference {
    /** The decoded character. */
    text: string;
    /** Characters consumed after the ampersand, including a semicolon. */
    consumed: number;
}

/**
 * Reads a decimal or hexadecimal numeric reference.
 *
 * @param rest - The text after the ampersand.
 * @returns The character, or `undefined` when the text is not numeric.
 */
function readNumericReference(rest: string): NumericReference | undefined {
    const hex = /^#x([0-9A-Fa-f]+);?/iu.exec(rest);
    if (hex !== null) {
        const codePoint = Number.parseInt(hex[1] ?? "", 16);
        if (!isUnicodeScalar(codePoint)) {
            return undefined;
        }
        return {
            text: String.fromCodePoint(codePoint),
            consumed: hex[0]?.length ?? 0,
        };
    }
    const decimal = /^#([0-9]+);?/u.exec(rest);
    if (decimal === null) {
        return undefined;
    }
    const codePoint = Number(decimal[1]);
    if (!isUnicodeScalar(codePoint)) {
        return undefined;
    }
    return {
        text: String.fromCodePoint(codePoint),
        consumed: decimal[0]?.length ?? 0,
    };
}

/**
 * Whether `codePoint` can be encoded as one Unicode scalar value.
 *
 * @param codePoint - A parsed number, which may be `NaN`.
 * @returns `true` for scalars other than U+0000 and the surrogates.
 */
function isUnicodeScalar(codePoint: number): boolean {
    return (
        Number.isInteger(codePoint) &&
        codePoint > 0 &&
        codePoint <= 0x10ffff &&
        (codePoint < 0xd800 || codePoint > 0xdfff)
    );
}

/**
 * Reads a named character reference.
 *
 * @param rest - The text after the ampersand.
 * @param index - Index of the ampersand in the source.
 * @param level - Which names are recognized.
 * @returns The reference, or `undefined` when the name is not allowed.
 */
function readNamedReference(
    rest: string,
    index: number,
    level: HtmlEntityLevel,
): DecodedReference | undefined {
    const matched = /^([A-Za-z][A-Za-z0-9]*)/u.exec(rest);
    if (matched === null) {
        return undefined;
    }
    const raw = matched[1] ?? "";
    const semicolon = rest.charAt(raw.length) === ";";
    if (semicolon) {
        const text = replacementFor(raw, level);
        if (text === undefined) {
            return undefined;
        }
        return { text, nextIndex: index + 1 + raw.length + 1 };
    }
    const name = longestOptionalName(raw, level);
    if (name === undefined) {
        return undefined;
    }
    const text = replacementFor(name, level);
    if (text === undefined) {
        return undefined;
    }
    return { text, nextIndex: index + 1 + name.length };
}

/**
 * The longest prefix of `raw` that may omit its semicolon.
 *
 * @param raw - The name characters after the ampersand.
 * @param level - Which names are recognized.
 * @returns The prefix, or `undefined` when none is allowed.
 */
function longestOptionalName(
    raw: string,
    level: HtmlEntityLevel,
): string | undefined {
    const optional = optionalSemicolonNames();
    for (let length = raw.length; length > 0; length -= 1) {
        const prefix = raw.slice(0, length);
        if (
            optional.has(prefix) &&
            replacementFor(prefix, level) !== undefined
        ) {
            return prefix;
        }
    }
    return undefined;
}

/**
 * The replacement for `name` when `level` allows it.
 *
 * @param name - An entity name without the ampersand.
 * @param level - Which names are recognized.
 * @returns The replacement, or `undefined` when the name is not allowed.
 */
function replacementFor(
    name: string,
    level: HtmlEntityLevel,
): string | undefined {
    if (!nameAllowed(name, level)) {
        return undefined;
    }
    return html5NamedCharacters[name];
}

/**
 * Whether `level` recognizes `name`.
 *
 * @param name - An entity name.
 * @param level - The named-character set.
 * @returns `true` when the name may be unescaped.
 */
function nameAllowed(name: string, level: HtmlEntityLevel): boolean {
    if (level === "xml") {
        return (
            name === "amp" ||
            name === "lt" ||
            name === "gt" ||
            name === "quot" ||
            name === "apos"
        );
    }
    if (level === "html4") {
        html4NameSet ??= new Set(html4EntityNames);
        return html4NameSet.has(name);
    }
    return Object.hasOwn(html5NamedCharacters, name);
}

/**
 * The HTML names that may omit a trailing semicolon.
 *
 * Built on first use.
 *
 * @returns The name set.
 */
function optionalSemicolonNames(): Set<string> {
    optionalSemicolon ??= new Set(html5OptionalSemicolon);
    return optionalSemicolon;
}
