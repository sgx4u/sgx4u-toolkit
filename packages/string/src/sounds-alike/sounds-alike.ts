import { isOptionsRecord, readEnum } from "../utils/assertions.utils.js";
import { getDoubleMetaphone } from "../get-double-metaphone/get-double-metaphone.js";
import { getMetaphone } from "../get-metaphone/get-metaphone.js";
import { getSoundex } from "../get-soundex/get-soundex.js";
import type {
    SoundsAlikeAlgorithm,
    SoundsAlikeOptions,
} from "./sounds-alike.types.js";

const algorithms = ["soundex", "metaphone", "double-metaphone"] as const;

/**
 * Reports whether two words share a phonetic code.
 *
 * `"soundex"` and `"metaphone"` match when the codes are equal.
 * `"double-metaphone"` matches when any primary or secondary code of one
 * word equals any code of the other, so `Smith` and `Schmidt` match.
 * A value that cannot be encoded does not match. A non-string returns
 * `false`. The inputs are not changed.
 *
 * @param options - The two words and an optional algorithm.
 * @returns `true` when the chosen codes overlap.
 * @throws {@link RangeError} When `algorithm` is not a known algorithm.
 * @throws {@link TypeError} When `algorithm` is present and is not a string.
 * @example
 * soundsAlike({ first: "Smith", second: "Schmidt" });
 */
export function soundsAlike(options: SoundsAlikeOptions): boolean {
    if (!isOptionsRecord(options)) {
        return false;
    }
    const algorithm = readEnum(
        "algorithm",
        options.algorithm,
        algorithms,
        "double-metaphone",
    );
    if (
        typeof options.first !== "string" ||
        typeof options.second !== "string"
    ) {
        return false;
    }
    return codesMatch(options.first, options.second, algorithm);
}

/**
 * @param first - The first word.
 * @param second - The second word.
 * @param algorithm - The code to compare.
 * @returns `true` when the codes overlap.
 */
function codesMatch(
    first: string,
    second: string,
    algorithm: SoundsAlikeAlgorithm,
): boolean {
    if (algorithm === "soundex") {
        const left = getSoundex(first);
        const right = getSoundex(second);
        return left !== undefined && left === right;
    }
    if (algorithm === "metaphone") {
        const left = getMetaphone(first);
        const right = getMetaphone(second);
        return left !== undefined && left === right;
    }
    const left = getDoubleMetaphone(first);
    const right = getDoubleMetaphone(second);
    if (left === undefined || right === undefined) {
        return false;
    }
    const leftCodes = [left.primary, left.secondary];
    const rightCodes = [right.primary, right.secondary];
    return leftCodes.some(
        (leftCode) => leftCode.length > 0 && rightCodes.includes(leftCode),
    );
}
