import type { DoubleMetaphoneCode } from "./get-double-metaphone.types.js";

const maximumCodeLength = 4;

/**
 * One step of the dual encoder.
 */
interface DualStep {
    /** Symbol appended to the primary code. Empty when the letter is skipped. */
    primary: string;
    /** Symbol appended to the secondary code. */
    secondary: string;
    /** How many source letters this step consumes. */
    advance: number;
}

/**
 * Returns two phonetic codes for an English word.
 *
 * This is an original dual-code encoder. It keeps the published idea of
 * the first four consonant sounds, uses `X` for the "sh" sound and `0`
 * for "th", and encodes a leading vowel sound as `A`. Codes are capped at
 * four characters. `Smith` is primary `SM0` and secondary `XMT`.
 * `Schmidt` is primary `XMT` and secondary `SMT`, so the two names share
 * `XMT`. When a word has no alternate, `secondary` equals `primary`.
 * Characters that are not ASCII letters are ignored. A value with nothing
 * to encode returns `undefined`. The input is not changed.
 *
 * @param value - A word. A non-string returns `undefined`.
 * @returns The two codes, or `undefined` when there is nothing to encode.
 * @example
 * getDoubleMetaphone("Smith");
 */
export function getDoubleMetaphone(
    value: unknown,
): DoubleMetaphoneCode | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const letters = asciiLetters(value);
    if (letters.length === 0) {
        return undefined;
    }
    const code = encodeDual(letters);
    if (code.primary.length === 0 && code.secondary.length === 0) {
        return undefined;
    }
    if (code.secondary.length === 0) {
        return { primary: code.primary, secondary: code.primary };
    }
    if (code.primary.length === 0) {
        return { primary: code.secondary, secondary: code.secondary };
    }
    return code;
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
 * @param letters - Uppercase letters.
 * @returns The two codes, still possibly empty.
 */
function encodeDual(letters: readonly string[]): DoubleMetaphoneCode {
    let primary = "";
    let secondary = "";
    let index = 0;
    while (
        index < letters.length &&
        (primary.length < maximumCodeLength ||
            secondary.length < maximumCodeLength)
    ) {
        const letter = letters[index] ?? "";
        const next = letters[index + 1] ?? "";
        const afterNext = letters[index + 2] ?? "";
        const silentFinalB =
            letter === "B" &&
            index === letters.length - 1 &&
            (letters[index - 1] ?? "") === "M";
        const step = encodeDualLetter(
            letter,
            next,
            afterNext,
            index === 0,
            silentFinalB,
        );
        primary = appendSymbol(primary, step.primary);
        secondary = appendSymbol(secondary, step.secondary);
        index += step.advance;
    }
    return { primary, secondary };
}

/**
 * @param letter - The current letter.
 * @param next - The following letter.
 * @param afterNext - The letter after that.
 * @param isStart - `true` for the first letter.
 * @param silentFinalB - `true` when `B` follows a final `M`.
 * @returns The symbols to append and how far to move.
 */
function encodeDualLetter(
    letter: string,
    next: string,
    afterNext: string,
    isStart: boolean,
    silentFinalB: boolean,
): DualStep {
    if (isVowel(letter)) {
        return {
            primary: isStart ? "A" : "",
            secondary: isStart ? "A" : "",
            advance: 1,
        };
    }
    const pair = `${next}${afterNext}`;
    switch (letter) {
        case "B":
            return silentFinalB
                ? { primary: "", secondary: "", advance: 1 }
                : both("B", 1);
        case "C":
            return encodeDualC(next, pair);
        case "D":
            if (pair === "GE" || pair === "GY" || pair === "GI") {
                return both("J", 2);
            }
            return both("T", 1);
        case "F":
            return both("F", 1);
        case "G":
            return encodeDualG(next, afterNext);
        case "H":
        case "Y":
            return { primary: "", secondary: "", advance: 1 };
        case "J":
            return both("J", 1);
        case "K":
        case "Q":
            return both("K", 1);
        case "L":
            return both("L", 1);
        case "M":
            return both("M", 1);
        case "N":
            return both("N", 1);
        case "P":
            return next === "H" ? both("F", 2) : both("P", 1);
        case "R":
            return both("R", 1);
        case "S":
            return encodeDualS(next, afterNext, pair, isStart);
        case "T":
            return encodeDualT(next, afterNext, pair);
        case "V":
            return both("F", 1);
        case "W":
            return encodeDualW(next, isStart);
        case "X":
            return isStart ? both("S", 1) : both("KS", 1);
        case "Z":
            return both("S", 1);
        default:
            return { primary: "", secondary: "", advance: 1 };
    }
}

/**
 * @param symbol - The symbol written to both codes.
 * @param advance - How many source letters this step consumes.
 * @returns A step with the same symbol on both sides.
 */
function both(symbol: string, advance: number): DualStep {
    return { primary: symbol, secondary: symbol, advance };
}

/**
 * @param next - The letter after `C`.
 * @param pair - The two letters after `C`.
 * @returns The encoding of `C`. `SCH` is handled when the `S` is seen.
 */
function encodeDualC(next: string, pair: string): DualStep {
    if (next === "K" || next === "H") {
        return both(next === "H" ? "X" : "K", 2);
    }
    if (pair === "IA") {
        return both("X", 1);
    }
    if (next === "I" || next === "E" || next === "Y") {
        return both("S", 1);
    }
    return both("K", 1);
}

/**
 * @param next - The letter after `G`.
 * @param afterNext - The letter after that.
 * @returns The encoding of `G`.
 */
function encodeDualG(next: string, afterNext: string): DualStep {
    if (next === "H" && afterNext.length > 0 && !isVowel(afterNext)) {
        return { primary: "", secondary: "", advance: 1 };
    }
    if (next === "N" && afterNext.length === 0) {
        return { primary: "", secondary: "", advance: 1 };
    }
    if (next === "I" || next === "E" || next === "Y") {
        return both("J", 1);
    }
    return both("K", 1);
}

/**
 * @param next - The letter after `S`.
 * @param afterNext - The letter after that.
 * @param pair - The two letters after `S`.
 * @param isStart - `true` when `S` is the first letter.
 * @returns The encoding of `S`. A leading plain `S` uses secondary `X`.
 */
function encodeDualS(
    next: string,
    afterNext: string,
    pair: string,
    isStart: boolean,
): DualStep {
    if (next === "C" && afterNext === "H") {
        return { primary: "X", secondary: "S", advance: 3 };
    }
    if (next === "H" || pair === "IO" || pair === "IA") {
        return both("X", next === "H" ? 2 : 1);
    }
    if (isStart) {
        return { primary: "S", secondary: "X", advance: 1 };
    }
    return both("S", 1);
}

/**
 * @param next - The letter after `T`.
 * @param afterNext - The letter after that.
 * @param pair - The two letters after `T`.
 * @returns The encoding of `T`. `TH` is primary `0` and secondary `T`.
 */
function encodeDualT(next: string, afterNext: string, pair: string): DualStep {
    if (next === "C" && afterNext === "H") {
        return { primary: "", secondary: "", advance: 1 };
    }
    if (pair === "IA" || pair === "IO") {
        return both("X", 1);
    }
    if (next === "H") {
        return { primary: "0", secondary: "T", advance: 2 };
    }
    return both("T", 1);
}

/**
 * @param next - The letter after `W`.
 * @param isStart - `true` when `W` is the first letter.
 * @returns The encoding of `W`.
 */
function encodeDualW(next: string, isStart: boolean): DualStep {
    if (isStart && next === "H") {
        return both("W", 2);
    }
    if (isVowel(next)) {
        return both("W", 1);
    }
    return { primary: "", secondary: "", advance: 1 };
}

/**
 * Appends `symbol` when the code has room and the symbol is not a repeat.
 *
 * @param code - The code so far.
 * @param symbol - The symbol to append. An empty symbol appends nothing.
 * @returns The next code, still at most four characters.
 */
function appendSymbol(code: string, symbol: string): string {
    if (symbol.length === 0 || code.length >= maximumCodeLength) {
        return code;
    }
    if (code.endsWith(symbol)) {
        return code;
    }
    return `${code}${symbol}`.slice(0, maximumCodeLength);
}

/**
 * @param letter - One letter.
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
