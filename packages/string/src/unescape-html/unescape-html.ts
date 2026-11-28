const namedCharacters: Readonly<Record<string, string>> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
};

const maximumReferenceLength = 32;

/**
 * Reverses {@link escapeHTML} and decodes numeric character references.
 *
 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` become the original
 * characters. Decimal references such as `&#65;` and hexadecimal
 * references such as `&#x41;` become that code point when it is a scalar
 * value. Named entities other than those five are left unchanged. Invalid
 * numeric references, including surrogates and code points above
 * `U+10FFFF`, are left unchanged. The function does not throw. The input
 * is not changed.
 *
 * @param value - Text that may contain character references. A non-string returns `undefined`.
 * @returns The decoded text, or `undefined` when `value` is not a string.
 * @example
 * unescapeHTML("&lt;A&gt;");
 */
export function unescapeHTML(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    let decoded = "";
    let index = 0;
    while (index < value.length) {
        const ampersand = value.indexOf("&", index);
        if (ampersand === -1) {
            decoded += value.slice(index);
            break;
        }
        decoded += value.slice(index, ampersand);
        const semicolon = value.indexOf(";", ampersand + 1);
        const bodyLength = semicolon - ampersand - 1;
        if (
            semicolon === -1 ||
            bodyLength < 1 ||
            bodyLength > maximumReferenceLength
        ) {
            decoded += "&";
            index = ampersand + 1;
            continue;
        }
        const replacement = decodeReference(
            value.slice(ampersand + 1, semicolon),
        );
        if (replacement === undefined) {
            decoded += "&";
            index = ampersand + 1;
            continue;
        }
        decoded += replacement;
        index = semicolon + 1;
    }
    return decoded;
}

/**
 * @param body - The text between `&` and `;`.
 * @returns The decoded character, or `undefined` when the reference is not one this function accepts.
 */
function decodeReference(body: string): string | undefined {
    const named = namedCharacters[body];
    if (named !== undefined) {
        return named;
    }
    if (body.startsWith("#")) {
        return decodeNumericReference(body.slice(1));
    }
    return undefined;
}

/**
 * @param body - The reference after `#`, which may start with `x`.
 * @returns The character, or `undefined` when the number is not a scalar value.
 */
function decodeNumericReference(body: string): string | undefined {
    const hexadecimal = body[0] === "x" || body[0] === "X";
    const digits = hexadecimal ? body.slice(1) : body;
    if (digits.length === 0) {
        return undefined;
    }
    const pattern = hexadecimal ? /^[0-9a-fA-F]+$/u : /^[0-9]+$/u;
    if (!pattern.test(digits)) {
        return undefined;
    }
    const codePoint = Number.parseInt(digits, hexadecimal ? 16 : 10);
    if (!isScalarValue(codePoint)) {
        return undefined;
    }
    return String.fromCodePoint(codePoint);
}

/**
 * @param codePoint - A parsed reference value.
 * @returns `true` when `codePoint` can be encoded as a Unicode scalar value.
 */
function isScalarValue(codePoint: number): boolean {
    return (
        Number.isInteger(codePoint) &&
        codePoint >= 0 &&
        codePoint <= 0x10ffff &&
        (codePoint < 0xd800 || codePoint > 0xdfff)
    );
}
