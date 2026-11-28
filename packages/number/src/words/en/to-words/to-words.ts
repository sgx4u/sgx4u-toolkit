import { englishWords } from "../english-words.data.js";
import { spellCardinal } from "../../spell-number.utils.js";

/**
 * Spells a number in international English, thousand through decillion (below 10^36). Integers and values with at most two decimal places are supported. A fractional value is read as `point` plus each digit.
 *
 * @example
 * toWords({ value: 1 });
 */
export function toWords(parameters: {
    value: number | bigint;
    kind?: "cardinal" | "ordinal";
}): string | undefined {
    const kind = parameters.kind ?? "cardinal";
    if (kind !== "cardinal" && kind !== "ordinal") {
        return undefined;
    }
    return spellCardinal(parameters.value, englishWords, kind === "ordinal");
}
