import { splitIntoUnits } from "../utils/units.utils.js";
import { splitIntoWords } from "../utils/words.utils.js";

/**
 * Turns a token into a short sentence-style phrase.
 *
 * Words come from the same split as `splitIntoWords` and are joined with
 * spaces. The first grapheme is uppercased and the rest is lowercased, so
 * `foo_bar` becomes `Foo bar`. Casing uses the runtime locale. A non-string
 * returns `undefined`. The input is not changed.
 *
 * @param value - Any value. Only a string is converted.
 * @returns The phrase, or `undefined` when `value` is not a string.
 * @example
 * humanize("foo_bar");
 */
export function humanize(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const phrase = splitIntoWords(value).join(" ");
    const graphemes = splitIntoUnits(phrase, "grapheme");
    const first = graphemes[0];
    if (first === undefined) {
        return "";
    }
    return (
        first.toLocaleUpperCase() +
        graphemes.slice(1).join("").toLocaleLowerCase()
    );
}
