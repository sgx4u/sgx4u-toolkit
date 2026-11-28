import type { LocaleArgument } from "./locale.utils.js";
import { splitIntoUnits } from "./units.utils.js";

/** Class of one grapheme while words are being split. */
type GraphemeClass =
    "upper" | "lower" | "otherLetter" | "digit" | "separator" | "other";

const separatorExpression = /^[\p{P}\p{Z}\s]+$/u;
const digitExpression = /^\p{Nd}+$/u;
const upperExpression = /\p{Lu}|\p{Lt}/u;
const lowerExpression = /\p{Ll}/u;
const letterExpression = /\p{L}/u;
const emojiExpression = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;

/**
 * Options that change where `splitIntoWords` places a boundary.
 */
export interface WordSplitOptions {
    /** Locale used for grapheme boundaries. */
    locale?: LocaleArgument;
    /**
     * When `true`, a letter and a neighboring digit stay together, and a
     * separator between those runs is dropped. A digit followed by an
     * uppercase letter still starts a word, so `version2Beta` stays
     * `version2` and `Beta`.
     */
    mergeAmbiguousCharacters?: boolean;
}

/**
 * Classifies one grapheme for the word splitter.
 *
 * @param grapheme - One grapheme cluster.
 * @returns The class used by the boundary rules.
 */
function classifyGrapheme(grapheme: string): GraphemeClass {
    if (emojiExpression.test(grapheme)) {
        return "other";
    }
    if (separatorExpression.test(grapheme)) {
        return "separator";
    }
    if (digitExpression.test(grapheme)) {
        return "digit";
    }
    if (!letterExpression.test(grapheme)) {
        return "other";
    }
    const hasUpper = upperExpression.test(grapheme);
    const hasLower = lowerExpression.test(grapheme);
    if (hasUpper && !hasLower) {
        return "upper";
    }
    if (hasLower && !hasUpper) {
        return "lower";
    }
    if (hasUpper) {
        return "upper";
    }
    return "otherLetter";
}

/**
 * Whether `graphemeClass` is a letter or a digit.
 *
 * @param graphemeClass - A class, or `undefined` at the ends of the string.
 * @returns `true` for letters and digits.
 */
function isAlphanumericClass(
    graphemeClass: GraphemeClass | undefined,
): graphemeClass is "upper" | "lower" | "otherLetter" | "digit" {
    return (
        graphemeClass === "upper" ||
        graphemeClass === "lower" ||
        graphemeClass === "otherLetter" ||
        graphemeClass === "digit"
    );
}

/**
 * Whether two alphanumeric classes merge when `mergeAmbiguousCharacters` is set.
 *
 * A digit followed by an uppercase letter stays a boundary so a camel-case
 * word such as `Beta` is not swallowed by the digits before it.
 *
 * @param previous - Class before a separator or at a run edge.
 * @param next - Class after that point.
 * @returns `true` when the runs belong to one word.
 */
function mergesAmbiguous(
    previous: GraphemeClass,
    next: GraphemeClass,
): boolean {
    const previousIsDigit = previous === "digit";
    const nextIsDigit = next === "digit";
    if (previousIsDigit === nextIsDigit) {
        return true;
    }
    if (previousIsDigit && next === "upper") {
        return false;
    }
    return true;
}

/**
 * Whether a new word starts before the grapheme at `index`.
 *
 * @param previous - Class of the grapheme already in the current word.
 * @param next - Class of the grapheme under the cursor.
 * @param classes - Every grapheme class, used to see the letter after an uppercase run.
 * @param index - Index of `next`.
 * @param mergeAmbiguousCharacters - When `true`, letter and digit runs merge.
 * @returns `true` when the current word should be closed first.
 */
function shouldStartWord(
    previous: GraphemeClass,
    next: GraphemeClass,
    classes: readonly GraphemeClass[],
    index: number,
    mergeAmbiguousCharacters: boolean,
): boolean {
    if (previous === "lower" && next === "upper") {
        return true;
    }
    if (previous === "upper" && next === "upper") {
        return classes[index + 1] === "lower";
    }
    if (previous === "otherLetter" && next !== "otherLetter") {
        return true;
    }
    if (next === "otherLetter" && previous !== "otherLetter") {
        return true;
    }
    const crossesDigit =
        (previous === "digit" && next !== "digit") ||
        (next === "digit" && previous !== "digit");
    if (!crossesDigit) {
        return false;
    }
    if (!mergeAmbiguousCharacters) {
        return true;
    }
    return !mergesAmbiguous(previous, next);
}

/**
 * Splits `value` into words for case conversion.
 *
 * Separators are Unicode punctuation and whitespace. A lowercase letter
 * followed by an uppercase letter starts a word (`fooBar`). An uppercase
 * run keeps together except the last capital that starts a lowercase word
 * (`XMLHttpRequest` is `XML`, `Http`, `Request`). Emoji are their own
 * words. A run of letters with no case, including CJK, is one word.
 * The input is not changed.
 *
 * @param value - The string to split. An empty string returns an empty array.
 * @param options - Locale and the ambiguous-character merge.
 * @returns A new array of words, without separators.
 */
export function splitIntoWords(
    value: string,
    options: WordSplitOptions = {},
): string[] {
    if (value.length === 0) {
        return [];
    }
    const graphemes = splitIntoUnits(value, "grapheme", options.locale);
    const classes = graphemes.map((grapheme) => classifyGrapheme(grapheme));
    const mergeAmbiguousCharacters = options.mergeAmbiguousCharacters === true;
    const words: string[] = [];
    let current = "";
    let currentClass: GraphemeClass | undefined;

    /**
     * Pushes the open word when it has text.
     */
    function flushWord(): void {
        if (current.length > 0) {
            words.push(current);
            current = "";
            currentClass = undefined;
        }
    }

    for (let index = 0; index < graphemes.length; index += 1) {
        const grapheme = graphemes[index] ?? "";
        const graphemeClass = classes[index] ?? "other";
        if (graphemeClass === "separator") {
            if (!mergeAmbiguousCharacters) {
                flushWord();
                continue;
            }
            let previousClass: GraphemeClass | undefined;
            for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
                const candidate = classes[cursor];
                if (candidate !== "separator") {
                    previousClass = candidate;
                    break;
                }
            }
            let nextClass: GraphemeClass | undefined;
            for (let cursor = index + 1; cursor < classes.length; cursor += 1) {
                const candidate = classes[cursor];
                if (candidate !== "separator") {
                    nextClass = candidate;
                    break;
                }
            }
            if (
                currentClass !== undefined &&
                isAlphanumericClass(previousClass) &&
                isAlphanumericClass(nextClass) &&
                mergesAmbiguous(previousClass, nextClass)
            ) {
                continue;
            }
            flushWord();
            continue;
        }
        if (graphemeClass === "other") {
            flushWord();
            words.push(grapheme);
            continue;
        }
        if (
            currentClass !== undefined &&
            shouldStartWord(
                currentClass,
                graphemeClass,
                classes,
                index,
                mergeAmbiguousCharacters,
            )
        ) {
            flushWord();
        }
        current += grapheme;
        currentClass = graphemeClass;
    }
    flushWord();
    return words;
}
