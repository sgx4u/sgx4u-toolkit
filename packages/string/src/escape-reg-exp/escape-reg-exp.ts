/**
 * ASCII punctuation escaped as `\xHH` when it is not already a syntax character.
 *
 * The set is comma, hyphen, equals, the angle brackets, and
 * `!"#%&':;@` plus backtick and tilde.
 */
const hexadecimalPunctuation: ReadonlySet<number> = new Set([
    0x21, 0x22, 0x23, 0x25, 0x26, 0x27, 0x2c, 0x2d, 0x3a, 0x3b, 0x3c, 0x3d,
    0x3e, 0x40, 0x60, 0x7e,
]);

/**
 * Syntax characters, plus `/`, that are escaped with a single backslash.
 */
const syntaxCharacters: ReadonlySet<number> = new Set([
    0x24, 0x28, 0x29, 0x2a, 0x2b, 0x2e, 0x2f, 0x3f, 0x5b, 0x5c, 0x5d, 0x5e,
    0x7b, 0x7c, 0x7d,
]);

const controlEscapes: Readonly<Record<number, string>> = {
    0x09: "\\t",
    0x0a: "\\n",
    0x0b: "\\v",
    0x0c: "\\f",
    0x0d: "\\r",
};

/**
 * Escapes `value` so it can be pasted into a regular expression as text.
 *
 * When `RegExp.escape` is a function, that function is called. Otherwise
 * the ES2025 algorithm in {@link escapeRegExpFallback} is used. A
 * non-string returns `undefined` and does not throw. The input is not
 * changed.
 *
 * @param value - Literal text to escape. A non-string returns `undefined`.
 * @returns The escaped pattern text, or `undefined` when `value` is not a string.
 * @example
 * escapeRegExp("foo.bar");
 */
export function escapeRegExp(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const native = readNativeRegExpEscape();
    if (native !== undefined) {
        return native(value);
    }
    return escapeRegExpFallback(value);
}

/**
 * Escapes `value` with the ES2025 `RegExp.escape` algorithm.
 *
 * A leading ASCII letter or decimal digit becomes `\xHH` so it cannot be
 * read as an identity escape or a legacy octal escape. Syntax characters
 * and `/` get a backslash. Tab, line feed, vertical tab, form feed, and
 * carriage return use `\t`, `\n`, `\v`, `\f`, and `\r`. Other punctuation
 * in the ES2025 set, white space, line terminators, and lone surrogates
 * use `\xHH` or `\uHHHH`. Every other code point is copied. Backspace is
 * copied, because the control-escape table is only `t`, `n`, `v`, `f`,
 * and `r`.
 *
 * @param value - Literal text. The caller has already checked that it is a string.
 * @returns The escaped pattern text.
 * @example
 * escapeRegExpFallback("foo.bar");
 */
export function escapeRegExpFallback(value: string): string {
    let escaped = "";
    for (const character of value) {
        const codePoint = character.codePointAt(0) ?? 0;
        escaped += escapeCodePoint(character, codePoint, escaped.length === 0);
    }
    return escaped;
}

/**
 * @returns The native escape function, or `undefined` when this runtime does not have one.
 */
function readNativeRegExpEscape(): ((text: string) => string) | undefined {
    const candidate: unknown = Reflect.get(RegExp, "escape");
    if (typeof candidate !== "function") {
        return undefined;
    }
    return (text: string): string => {
        const escaped: unknown = Reflect.apply(candidate, RegExp, [text]);
        return typeof escaped === "string"
            ? escaped
            : escapeRegExpFallback(text);
    };
}

/**
 * @param character - The code point as a string. A non-BMP character is one string of two code units.
 * @param codePoint - The numeric code point.
 * @param isLeading - `true` while the escaped output is still empty.
 * @returns The escaped form of this code point.
 */
function escapeCodePoint(
    character: string,
    codePoint: number,
    isLeading: boolean,
): string {
    if (isLeading && (isDecimalDigit(codePoint) || isASCIILetter(codePoint))) {
        return formatHexadecimalEscape(codePoint, 2);
    }
    if (syntaxCharacters.has(codePoint)) {
        return `\\${character}`;
    }
    const controlEscape = controlEscapes[codePoint];
    if (controlEscape !== undefined) {
        return controlEscape;
    }
    if (needsHexadecimalEscape(codePoint)) {
        return encodeForRegExpEscape(character, codePoint);
    }
    return character;
}

/**
 * @param codePoint - A Unicode code point.
 * @returns `true` for ASCII `0` through `9`.
 */
function isDecimalDigit(codePoint: number): boolean {
    return codePoint >= 0x30 && codePoint <= 0x39;
}

/**
 * @param codePoint - A Unicode code point.
 * @returns `true` for ASCII `A`–`Z` and `a`–`z`.
 */
function isASCIILetter(codePoint: number): boolean {
    return (
        (codePoint >= 0x41 && codePoint <= 0x5a) ||
        (codePoint >= 0x61 && codePoint <= 0x7a)
    );
}

/**
 * @param codePoint - A Unicode code point.
 * @returns `true` when the code point uses a hexadecimal escape.
 */
function needsHexadecimalEscape(codePoint: number): boolean {
    return (
        hexadecimalPunctuation.has(codePoint) ||
        isPatternWhiteSpace(codePoint) ||
        isSurrogate(codePoint)
    );
}

/**
 * White space and line terminators that are not already control escapes.
 *
 * @param codePoint - A Unicode code point.
 * @returns `true` for `Zs`, `U+FEFF`, `U+2028`, and `U+2029`.
 */
function isPatternWhiteSpace(codePoint: number): boolean {
    if (codePoint === 0xfeff || codePoint === 0x2028 || codePoint === 0x2029) {
        return true;
    }
    return /^\p{Zs}$/u.test(String.fromCodePoint(codePoint));
}

/**
 * @param codePoint - A Unicode code point.
 * @returns `true` for a UTF-16 surrogate code point.
 */
function isSurrogate(codePoint: number): boolean {
    return codePoint >= 0xd800 && codePoint <= 0xdfff;
}

/**
 * @param character - The original character, used when it has more than one code unit.
 * @param codePoint - The numeric code point.
 * @returns `\xHH` at or below `U+00FF`, otherwise `\uHHHH` for each code unit.
 */
function encodeForRegExpEscape(character: string, codePoint: number): string {
    if (codePoint <= 0xff) {
        return formatHexadecimalEscape(codePoint, 2);
    }
    let encoded = "";
    for (let index = 0; index < character.length; index += 1) {
        encoded += formatHexadecimalEscape(character.charCodeAt(index), 4);
    }
    return encoded;
}

/**
 * @param codePoint - The number to write.
 * @param width - `2` for `\x`, `4` for `\u`.
 * @returns A lowercase hexadecimal escape.
 */
function formatHexadecimalEscape(codePoint: number, width: number): string {
    const digits = codePoint.toString(16).padStart(width, "0");
    return width === 2 ? `\\x${digits}` : `\\u${digits}`;
}
