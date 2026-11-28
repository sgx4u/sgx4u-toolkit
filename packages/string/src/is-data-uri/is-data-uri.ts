import { isBase64 } from "../is-base64/is-base64.js";
import { isMimeType } from "../is-mime-type/is-mime-type.js";

const parameterExpression =
    /^[-!#$%&'*+.^_`|~0-9A-Za-z]+=(?:[-!#$%&'*+.^_`|~0-9A-Za-z]+|"[^"]*")$/u;

/**
 * Reports whether `value` is a `data:` URL.
 *
 * The media type is optional. Parameters use `name=value` or a quoted
 * value. `;base64`, when present, is the last parameter and the payload
 * must be standard Base64 with optional padding. The payload may be empty.
 * A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is a data URL.
 * @example
 * isDataURI("data:text/plain;base64,SGVsbG8=");
 */
export function isDataURI(value: unknown): boolean {
    if (typeof value !== "string" || !/^data:/iu.test(value)) {
        return false;
    }
    const rest = value.slice(5);
    const commaIndex = rest.indexOf(",");
    if (commaIndex < 0) {
        return false;
    }
    const header = rest.slice(0, commaIndex);
    const payload = rest.slice(commaIndex + 1);
    if (header.length === 0) {
        return true;
    }
    return headerIsValid(header, payload);
}

/**
 * Whether the media-type header is valid for `payload`.
 *
 * @param header - The text between `data:` and the comma.
 * @param payload - The text after the comma.
 * @returns `true` when the header parses and a Base64 payload is Base64.
 */
function headerIsValid(header: string, payload: string): boolean {
    const pieces = header.split(";");
    const mediaType = pieces[0] ?? "";
    let start = 0;
    if (mediaType.length > 0) {
        if (!isMimeType(mediaType)) {
            return false;
        }
        start = 1;
    }
    let base64 = false;
    for (let index = start; index < pieces.length; index += 1) {
        const piece = pieces[index] ?? "";
        if (piece.toLowerCase() === "base64") {
            if (index !== pieces.length - 1) {
                return false;
            }
            base64 = true;
            continue;
        }
        if (!parameterExpression.test(piece)) {
            return false;
        }
    }
    if (base64) {
        return isBase64(payload);
    }
    return true;
}
