/**
 * Returns the original Metaphone code of an English word.
 *
 * The rules follow Lawrence Philips' 1990 published summary. Adjacent
 * duplicate letters are dropped, except `C`. A leading `KN`, `GN`, `PN`,
 * `AE`, or `WR` drops the first letter. `B` is dropped after a final `M`.
 * `C` becomes `X` before `IA` or `H`, except `SCH`, which becomes `K`.
 * Otherwise `C` becomes `S` before `I`, `E`, or `Y`, and `K` in other
 * cases. `D` becomes `J` before `GE`, `GY`, or `GI`, and `T` otherwise.
 * `G` is dropped before `H` when that `H` is not at the end and is not
 * before a vowel, and before a final `N`. `G` becomes `J` before `I`,
 * `E`, or `Y` unless the pair is `GG`, and `K` otherwise. `H` is dropped
 * after a vowel when it is not before a vowel. `CK` becomes `K`, `PH`
 * becomes `F`, `Q` becomes `K`, and `V` becomes `F`. `S` becomes `X`
 * before `H`, `IO`, or `IA`. `T` becomes `X` before `IA` or `IO`, `TH`
 * becomes `0`, and `T` is dropped before `CH`. A leading `WH` becomes
 * `W`. `W` and `Y` are dropped when they are not before a vowel. A
 * leading `X` becomes `S`; any other `X` becomes `KS`. `Z` becomes `S`.
 * Vowels are dropped except at the start. Characters that are not ASCII
 * letters are ignored. A value with nothing to encode returns
 * `undefined`. The input is not changed.
 *
 * @param value - A word. A non-string returns `undefined`.
 * @returns The Metaphone code, or `undefined` when there is nothing to encode.
 * @example
 * getMetaphone("Smith");
 */
export function getMetaphone(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const prepared = dropLeadingPair(
        dropAdjacentDuplicates(asciiLetters(value)),
    );
    if (prepared.length === 0) {
        return undefined;
    }
    const code = encodeMetaphone(prepared);
    return code.length === 0 ? undefined : code;
}

/**
 * @param value - The caller's text.
 * @returns Uppercase ASCII letters. Other characters are ignored.
 */
function asciiLetters(value: string): string[] {
    const letters: string[] = [];
    for (const character of value.toLocaleUpperCase("en")) {
        if (character >= "A" && character <= "Z") {
            letters.push(character);
        }
    }
    return letters;
}

/**
 * Drops adjacent duplicate letters, keeping both letters of `CC`.
 *
 * @param letters - Uppercase letters. The array is not changed.
 * @returns A new array.
 */
function dropAdjacentDuplicates(letters: readonly string[]): string[] {
    const kept: string[] = [];
    for (const letter of letters) {
        const previous = kept[kept.length - 1];
        if (letter === previous && letter !== "C") {
            continue;
        }
        kept.push(letter);
    }
    return kept;
}

/**
 * Drops the first letter of a leading `KN`, `GN`, `PN`, `AE`, or `WR`.
 *
 * @param letters - Uppercase letters. The array is not changed.
 * @returns A new array.
 */
function dropLeadingPair(letters: readonly string[]): string[] {
    const first = letters[0] ?? "";
    const second = letters[1] ?? "";
    const pair = `${first}${second}`;
    if (
        pair === "KN" ||
        pair === "GN" ||
        pair === "PN" ||
        pair === "AE" ||
        pair === "WR"
    ) {
        return letters.slice(1);
    }
    return [...letters];
}

/**
 * @param letters - Prepared uppercase letters.
 * @returns The Metaphone code. It may be empty when every letter is dropped.
 */
function encodeMetaphone(letters: readonly string[]): string {
    let code = "";
    let index = 0;
    while (index < letters.length) {
        const letter = letters[index] ?? "";
        const next = letters[index + 1] ?? "";
        const afterNext = letters[index + 2] ?? "";
        const previous = index === 0 ? "" : (letters[index - 1] ?? "");
        const step = encodeLetter(
            letter,
            next,
            afterNext,
            previous,
            index === 0,
        );
        code += step.text;
        index += step.advance;
    }
    return code;
}

/**
 * How one letter contributes to the code.
 */
interface EncodedLetter {
    /** Text to append. It may be empty when the letter is dropped. */
    text: string;
    /** How many source letters this step consumes. */
    advance: number;
}

/**
 * @param letter - The current letter.
 * @param next - The following letter, or `""` at the end.
 * @param afterNext - The letter after `next`, or `""`.
 * @param previous - The previous letter, or `""` at the start.
 * @param isStart - `true` for the first letter of the prepared word.
 * @returns The text to append and how far to move.
 */
function encodeLetter(
    letter: string,
    next: string,
    afterNext: string,
    previous: string,
    isStart: boolean,
): EncodedLetter {
    const pair = `${next}${afterNext}`;
    switch (letter) {
        case "A":
        case "E":
        case "I":
        case "O":
        case "U":
            return { text: isStart ? letter : "", advance: 1 };
        case "B":
            return {
                text: next.length === 0 && previous === "M" ? "" : "B",
                advance: 1,
            };
        case "C":
            return encodeC(next, previous, pair);
        case "D":
            if (pair === "GE" || pair === "GY" || pair === "GI") {
                return { text: "J", advance: 2 };
            }
            return { text: "T", advance: 1 };
        case "G":
            return encodeG(
                next,
                afterNext,
                previous,
                lettersEnd(next, afterNext),
            );
        case "H":
            if (isVowel(previous) && !isVowel(next)) {
                return { text: "", advance: 1 };
            }
            return { text: "H", advance: 1 };
        case "P":
            return next === "H"
                ? { text: "F", advance: 2 }
                : { text: "P", advance: 1 };
        case "Q":
            return { text: "K", advance: 1 };
        case "S":
            if (next === "H" || pair === "IO" || pair === "IA") {
                return { text: "X", advance: next === "H" ? 2 : 1 };
            }
            return { text: "S", advance: 1 };
        case "T":
            return encodeT(next, afterNext, pair);
        case "V":
            return { text: "F", advance: 1 };
        case "W":
            return encodeW(next, isStart);
        case "X":
            return { text: isStart ? "S" : "KS", advance: 1 };
        case "Y":
            return isVowel(next)
                ? { text: "Y", advance: 1 }
                : { text: "", advance: 1 };
        case "Z":
            return { text: "S", advance: 1 };
        default:
            return { text: letter, advance: 1 };
    }
}

/**
 * @param next - The letter after `C`.
 * @param afterNext - The letter after that.
 * @param previous - The letter before `C`.
 * @param pair - `next` and `afterNext` joined.
 * @returns The encoding of `C`.
 */
function encodeC(next: string, previous: string, pair: string): EncodedLetter {
    if (next === "K") {
        return { text: "K", advance: 2 };
    }
    if (previous === "S" && next === "H") {
        return { text: "K", advance: 2 };
    }
    if (next === "H" || pair === "IA") {
        return { text: "X", advance: next === "H" ? 2 : 1 };
    }
    if (next === "I" || next === "E" || next === "Y") {
        return { text: "S", advance: 1 };
    }
    return { text: "K", advance: 1 };
}

/**
 * @param next - The letter after `G`.
 * @param afterNext - The letter after that.
 * @param previous - The letter before `G`.
 * @param atFinalN - `true` when `N` is the last letter.
 * @returns The encoding of `G`.
 */
function encodeG(
    next: string,
    afterNext: string,
    previous: string,
    atFinalN: boolean,
): EncodedLetter {
    if (next === "H" && afterNext.length > 0 && !isVowel(afterNext)) {
        return { text: "", advance: 1 };
    }
    if (next === "N" && atFinalN) {
        return { text: "", advance: 1 };
    }
    const soft =
        (next === "I" || next === "E" || next === "Y") && previous !== "G";
    return { text: soft ? "J" : "K", advance: 1 };
}

/**
 * @param next - The letter after `T`.
 * @param afterNext - The letter after that.
 * @param pair - `next` and `afterNext` joined.
 * @returns The encoding of `T`.
 */
function encodeT(next: string, afterNext: string, pair: string): EncodedLetter {
    if (next === "C" && afterNext === "H") {
        return { text: "", advance: 1 };
    }
    if (pair === "IA" || pair === "IO") {
        return { text: "X", advance: 1 };
    }
    if (next === "H") {
        return { text: "0", advance: 2 };
    }
    return { text: "T", advance: 1 };
}

/**
 * @param next - The letter after `W`.
 * @param isStart - `true` when `W` is the first prepared letter.
 * @returns The encoding of `W`.
 */
function encodeW(next: string, isStart: boolean): EncodedLetter {
    if (isStart && next === "H") {
        return { text: "W", advance: 2 };
    }
    if (!isVowel(next)) {
        return { text: "", advance: 1 };
    }
    return { text: "W", advance: 1 };
}

/**
 * @param next - The letter after `G`.
 * @param afterNext - The letter after that. An empty `afterNext` with `next === "N"` means `N` is final.
 * @returns `true` when `G` is followed by a final `N`.
 */
function lettersEnd(next: string, afterNext: string): boolean {
    return next === "N" && afterNext.length === 0;
}

/**
 * @param letter - One letter, or `""` at the end of the word.
 * @returns `true` for `A`, `E`, `I`, `O`, and `U`.
 */
function isVowel(letter: string): boolean {
    return (
        letter === "A" ||
        letter === "E" ||
        letter === "I" ||
        letter === "O" ||
        letter === "U"
    );
}
