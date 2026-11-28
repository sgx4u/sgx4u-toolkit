import { jaroWinklerSimilarity } from "../utils/distance.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { GetJaroWinklerSimilarityOptions } from "./get-jaro-winkler-similarity.types.js";

/**
 * Returns the Jaro-Winkler similarity of two strings, from 0 to 1.
 *
 * Units are graphemes. Equal strings score 1, including two empty
 * strings. A non-string input returns `undefined`. The inputs are not
 * changed.
 *
 * @param options - The two strings.
 * @returns The similarity, or `undefined` when either input is not a string.
 * @example
 * getJaroWinklerSimilarity({ first: "martha", second: "marhta" });
 */
export function getJaroWinklerSimilarity(
    options: GetJaroWinklerSimilarityOptions,
): number | undefined {
    const resolved = readOptionsCall(options, readEmptyOptions);
    if (resolved === undefined) {
        return undefined;
    }
    const first = resolved.record.first;
    const second = resolved.record.second;
    if (typeof first !== "string" || typeof second !== "string") {
        return undefined;
    }
    return jaroWinklerSimilarity(
        splitIntoUnits(first, "grapheme"),
        splitIntoUnits(second, "grapheme"),
    );
}

/**
 * @param _record - The options object. This function has no optional fields.
 * @returns An empty settings object.
 */
function readEmptyOptions(
    _record: Record<string, unknown>,
): Record<string, never> {
    return {};
}
