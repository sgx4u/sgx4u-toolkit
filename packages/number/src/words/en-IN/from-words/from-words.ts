import { indianWords } from "../indian-words.data.js";
import { parseCardinal } from "../../spell-number.utils.js";

/**
 * Parses cardinal or ordinal words from this locale. Text that is not a number in words returns `undefined`.
 *
 * @example
 * fromWords({ value: "one" });
 */
export function fromWords(parameters: { value: string }): number | undefined {
    return parseCardinal(parameters.value, indianWords);
}
