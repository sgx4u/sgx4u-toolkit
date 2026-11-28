const standardAlphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const urlAlphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

const punycodeBase = 36;
const punycodeTmin = 1;
const punycodeTmax = 26;
const punycodeSkew = 38;
const punycodeDamp = 700;
const punycodeInitialBias = 72;
const punycodeInitialN = 128;

/**
 * Encodes bytes as Base64.
 *
 * @param bytes - The bytes to encode.
 * @param urlSafe - When `true`, use `-` and `_` and omit padding.
 * @returns The encoded text.
 */
export function encodeBase64Bytes(bytes: Uint8Array, urlSafe: boolean): string {
    const alphabet = urlSafe ? urlAlphabet : standardAlphabet;
    let encoded = "";
    for (let index = 0; index < bytes.length; index += 3) {
        const first = bytes[index] ?? 0;
        const second = bytes[index + 1];
        const third = bytes[index + 2];
        const packed = (first << 16) | ((second ?? 0) << 8) | (third ?? 0);
        encoded += alphabet[(packed >> 18) & 63];
        encoded += alphabet[(packed >> 12) & 63];
        if (second === undefined) {
            encoded += urlSafe ? "" : "==";
        } else if (third === undefined) {
            encoded += alphabet[(packed >> 6) & 63];
            encoded += urlSafe ? "" : "=";
        } else {
            encoded += alphabet[(packed >> 6) & 63];
            encoded += alphabet[packed & 63];
        }
    }
    return encoded;
}

/**
 * Decodes standard or URL-safe Base64 into bytes.
 *
 * Padding is optional. A bad alphabet, a bad padding length, or leftover
 * bits that are not zero returns `undefined`.
 *
 * @param value - The encoded text, without surrounding whitespace.
 * @param urlSafe - When `true`, accept `-` and `_` instead of `+` and `/`.
 * @returns The bytes, or `undefined` when the text is not valid Base64.
 */
export function decodeBase64Bytes(
    value: string,
    urlSafe: boolean,
): Uint8Array | undefined {
    const alphabet = urlSafe ? urlAlphabet : standardAlphabet;
    const cleaned = urlSafe ? value : value.replace(/=+$/u, "");
    if (!urlSafe && value.length % 4 === 1) {
        return undefined;
    }
    if (urlSafe && /[+/=]/u.test(value)) {
        return undefined;
    }
    if (!urlSafe && value.length !== 0 && value.length % 4 === 1) {
        return undefined;
    }
    const paddingLength = urlSafe ? (4 - (cleaned.length % 4)) % 4 : 0;
    const source = cleaned + (urlSafe ? "" : "");
    if (/[^A-Za-z0-9+/_-]/u.test(cleaned)) {
        return undefined;
    }
    if (!urlSafe && /[_-]/u.test(cleaned)) {
        return undefined;
    }
    if (urlSafe && /[+]/u.test(value)) {
        return undefined;
    }
    const digits: number[] = [];
    for (const character of source) {
        const digit = alphabet.indexOf(character);
        if (digit < 0) {
            return undefined;
        }
        digits.push(digit);
    }
    if (urlSafe && paddingLength === 3) {
        return undefined;
    }
    const output: number[] = [];
    for (let index = 0; index < digits.length; index += 4) {
        const first = digits[index];
        const second = digits[index + 1];
        const third = digits[index + 2];
        const fourth = digits[index + 3];
        if (first === undefined || second === undefined) {
            return undefined;
        }
        output.push((first << 2) | (second >> 4));
        if (third !== undefined) {
            output.push(((second & 15) << 4) | (third >> 2));
        }
        if (third !== undefined && fourth !== undefined) {
            output.push(((third & 3) << 6) | fourth);
        }
    }
    if (!urlSafe) {
        const expectedPadding = (4 - (cleaned.length % 4)) % 4;
        const actualPadding = value.length - cleaned.length;
        if (value.includes("=") && actualPadding !== expectedPadding) {
            return undefined;
        }
        if (actualPadding > 2) {
            return undefined;
        }
    }
    return Uint8Array.from(output);
}

/**
 * Encodes `value` as lowercase hexadecimal UTF-8.
 *
 * @param value - The text to encode.
 * @returns Two lowercase hex digits per byte.
 */
export function encodeHexString(value: string): string {
    const bytes = new TextEncoder().encode(value);
    let encoded = "";
    for (const byte of bytes) {
        encoded += byte.toString(16).padStart(2, "0");
    }
    return encoded;
}

/**
 * Decodes lowercase or uppercase hexadecimal into UTF-8 text.
 *
 * @param value - Even-length hex text.
 * @returns The text, or `undefined` when the length is odd, a digit is not hex, or the bytes are not UTF-8.
 */
export function decodeHexString(value: string): string | undefined {
    if (value.length % 2 !== 0 || !/^[0-9A-Fa-f]*$/u.test(value)) {
        return undefined;
    }
    const bytes = new Uint8Array(value.length / 2);
    for (let index = 0; index < bytes.length; index += 1) {
        bytes[index] = Number.parseInt(
            value.slice(index * 2, index * 2 + 2),
            16,
        );
    }
    return decodeUtf8(bytes);
}

/**
 * Encodes `value` as UTF-8 bytes.
 *
 * @param value - The text to encode.
 * @returns A new byte array.
 */
export function encodeUtf8(value: string): Uint8Array {
    return new TextEncoder().encode(value);
}

/**
 * Decodes UTF-8 bytes.
 *
 * @param bytes - Bytes that must be a `Uint8Array`. A `Buffer` is a `Uint8Array`.
 * @returns The text, or `undefined` when `bytes` is not a `Uint8Array` or is not valid UTF-8.
 */
export function decodeUtf8(bytes: Uint8Array): string | undefined {
    if (!(bytes instanceof Uint8Array)) {
        return undefined;
    }
    try {
        return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
        return undefined;
    }
}

/**
 * Adapts the punycode bias the way RFC 3492 specifies.
 *
 * @param delta - The current delta.
 * @param pointCount - The number of code points produced so far.
 * @param firstTime - Whether this is the first delta.
 * @returns The next bias.
 */
function adaptPunycodeBias(
    delta: number,
    pointCount: number,
    firstTime: boolean,
): number {
    let current = firstTime ? Math.floor(delta / punycodeDamp) : delta >> 1;
    current += Math.floor(current / pointCount);
    let threshold = 0;
    while (
        current > Math.floor(((punycodeBase - punycodeTmin) * punycodeTmax) / 2)
    ) {
        current = Math.floor(current / (punycodeBase - punycodeTmin));
        threshold += punycodeBase;
    }
    return (
        threshold +
        Math.floor(
            ((punycodeBase - punycodeTmin + 1) * current) /
                (current + punycodeSkew),
        )
    );
}

/**
 * Decodes one punycode digit.
 *
 * @param character - One ASCII character.
 * @returns The digit from 0 through 35, or `undefined` when it is not a digit.
 */
function punycodeDigit(character: string): number | undefined {
    const code = character.charCodeAt(0);
    if (code >= 48 && code <= 57) {
        return code - 22;
    }
    if (code >= 65 && code <= 90) {
        return code - 65;
    }
    if (code >= 97 && code <= 122) {
        return code - 97;
    }
    return undefined;
}

/**
 * Decodes one punycode label body, without the `xn--` prefix.
 *
 * @param value - The characters after `xn--`.
 * @returns The Unicode label, or `undefined` when the body is not valid punycode.
 */
function decodePunycodeBody(value: string): string | undefined {
    const output: number[] = [];
    const delimiter = value.lastIndexOf("-");
    if (delimiter > 0) {
        for (let index = 0; index < delimiter; index += 1) {
            const code = value.charCodeAt(index);
            if (code > 127) {
                return undefined;
            }
            output.push(code);
        }
    }
    let index = delimiter < 0 ? 0 : delimiter + 1;
    let codePoint = punycodeInitialN;
    let bias = punycodeInitialBias;
    let insertion = 0;
    while (index < value.length) {
        const previousInsertion = insertion;
        let weight = 1;
        for (let base = punycodeBase; ; base += punycodeBase) {
            if (index >= value.length) {
                return undefined;
            }
            const character = value[index];
            index += 1;
            if (character === undefined) {
                return undefined;
            }
            const digit = punycodeDigit(character);
            if (digit === undefined) {
                return undefined;
            }
            insertion += digit * weight;
            const threshold =
                base <= bias
                    ? punycodeTmin
                    : base >= bias + punycodeTmax
                      ? punycodeTmax
                      : base - bias;
            if (digit < threshold) {
                break;
            }
            weight *= punycodeBase - threshold;
        }
        const length = output.length + 1;
        bias = adaptPunycodeBias(
            insertion - previousInsertion,
            length,
            previousInsertion === 0,
        );
        codePoint += Math.floor(insertion / length);
        insertion %= length;
        if (codePoint > 0x10ffff) {
            return undefined;
        }
        output.splice(insertion, 0, codePoint);
        insertion += 1;
    }
    return String.fromCodePoint(...output);
}

const domainLabelExpression =
    /^(?:[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?)$/u;

/**
 * Whether `value` is a single domain name or one label.
 *
 * @param value - Candidate text.
 * @returns `true` when every label is a hostname label and the URL parser agrees.
 */
function isDomainOrLabel(value: string): boolean {
    if (value.length === 0 || value.length > 253 || value.includes("..")) {
        return false;
    }
    const labels = value.split(".");
    if (labels.some((label) => !domainLabelExpression.test(label))) {
        return false;
    }
    try {
        const url = new URL(`http://${value}`);
        return (
            url.pathname === "/" &&
            url.username === "" &&
            url.password === "" &&
            url.search === "" &&
            url.hash === "" &&
            url.port === ""
        );
    } catch {
        return false;
    }
}

/**
 * Converts a domain or label to its ASCII punycode hostname.
 *
 * Uses the platform URL parser. An input that is not a domain or label
 * returns `undefined`.
 *
 * @param value - A domain such as `münchen.de`, or a single label.
 * @returns The ASCII hostname, or `undefined` when `value` is not a domain.
 */
export function domainToPunycode(value: string): string | undefined {
    if (!isDomainOrLabel(value)) {
        return undefined;
    }
    return new URL(`http://${value}`).hostname;
}

/**
 * Converts a punycode domain or label to Unicode.
 *
 * Labels that start with `xn--` are decoded. Other labels are kept. An
 * input that is not a domain or label returns `undefined`.
 *
 * @param value - An ASCII hostname, possibly with `xn--` labels.
 * @returns The Unicode domain, or `undefined` when a label cannot be decoded.
 */
export function domainFromPunycode(value: string): string | undefined {
    if (!isDomainOrLabel(value)) {
        return undefined;
    }
    const labels: string[] = [];
    for (const label of value.split(".")) {
        const lower = label.toLocaleLowerCase("en");
        if (lower.startsWith("xn--")) {
            const decoded = decodePunycodeBody(lower.slice(4));
            if (decoded === undefined || decoded.length === 0) {
                return undefined;
            }
            labels.push(decoded);
        } else {
            labels.push(lower);
        }
    }
    return labels.join(".");
}
