import { isEmail } from "../is-email/is-email.js";

/**
 * Reports whether `value` is a `mailto:` URL with an address-shaped path.
 *
 * One address, or several addresses separated by commas, must pass the
 * same practical rules as `isEmail`. Percent-encoding in the path is
 * decoded first. A query or fragment may follow the addresses and is not
 * inspected. A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the path contains at least one email address.
 * @example
 * isMailtoURI("mailto:user@example.com");
 */
export function isMailtoURI(value: unknown): boolean {
    if (typeof value !== "string" || !/^mailto:/iu.test(value)) {
        return false;
    }
    const rest = value.slice(7);
    const stop = rest.search(/[?#]/u);
    const path = stop === -1 ? rest : rest.slice(0, stop);
    if (path.length === 0) {
        return false;
    }
    let decoded: string;
    try {
        decoded = decodeURIComponent(path);
    } catch {
        return false;
    }
    const addresses = decoded.split(",");
    return (
        addresses.length > 0 &&
        addresses.every((address) => isEmail(address.trim()))
    );
}
