import { englishWords } from "../english-words.data.js";
import { spellCardinal } from "../../spell-number.utils.js";

/**
 * Spells an integer as an ordinal. This is `toWords` with `kind: "ordinal"`.
 *
 * @example
 * toOrdinalWords({ value: 1 });
 */
export function toOrdinalWords(parameters: {
    value: number | bigint;
}): string | undefined {
    return spellCardinal(parameters.value, englishWords, true);
}
