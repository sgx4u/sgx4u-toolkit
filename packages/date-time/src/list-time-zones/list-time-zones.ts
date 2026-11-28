/**
 * Returns the IANA time zones this runtime knows.
 *
 * An older runtime without `Intl.supportedValuesOf` returns an empty list.
 *
 * @returns Zone names. The list may be empty.
 * @example
 * listTimeZones().includes("Africa/Abidjan"); // true
 */
export function listTimeZones(): string[] {
    const intl = Intl as unknown as {
        supportedValuesOf?: (key: "timeZone") => string[];
    };
    if (typeof intl.supportedValuesOf !== "function") {
        return [];
    }
    return intl.supportedValuesOf("timeZone");
}
