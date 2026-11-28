/**
 * Reports whether `value` has the three-part shape of a JSON Web Token.
 *
 * The parts are base64url text separated by dots. Padding is not required.
 * An empty part is accepted, so an empty payload is still three parts.
 * The signature is not verified and the payload is not parsed. A
 * non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is three base64url parts.
 * @example
 * isJWT("eyJhbGciOiJub25lIn0.e30.");
 */
export function isJWT(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    const parts = value.split(".");
    if (parts.length !== 3) {
        return false;
    }
    return parts.every((part) => isBase64URLPart(part));
}

/**
 * Whether `part` is base64url text, including the empty string.
 *
 * @param part - One dot-separated piece.
 * @returns `true` when the alphabet is URL-safe and the length can be decoded.
 */
function isBase64URLPart(part: string): boolean {
    if (!/^[A-Za-z0-9_-]*$/u.test(part)) {
        return false;
    }
    return part.length % 4 !== 1;
}
