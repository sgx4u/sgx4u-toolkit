const soundexDigits: Readonly<Record<string, string>> = {
    B: "1",
    F: "1",
    P: "1",
    V: "1",
    C: "2",
    G: "2",
    J: "2",
    K: "2",
    Q: "2",
    S: "2",
    X: "2",
    Z: "2",
    D: "3",
    T: "3",
    L: "4",
    M: "5",
    N: "5",
    R: "6",
};

/**
 * Returns the American Soundex code of an English name.
 *
 * The code is four characters: the first letter, then digits, padded with
 * zeros. `Robert` and `Rupert` are `R163`. `Ashcraft` is `A261`. Adjacent
 * letters with the same code collapse. `H` and `W` do not separate those
 * letters. Vowels and `Y` do. Characters that are not ASCII letters are
 * ignored, so a string of digits has nothing to encode and returns
 * `undefined`. A non-string returns `undefined`. The input is not changed.
 *
 * @param value - A name. A non-string returns `undefined`.
 * @returns The four-character code, or `undefined` when there is no letter to encode.
 * @example
 * getSoundex("Robert");
 */
export function getSoundex(value: unknown): string | undefined {
    if (typeof value !== "string") {
        return undefined;
    }
    const letters = asciiLetters(value);
    const first = letters[0];
    if (first === undefined) {
        return undefined;
    }
    let code = first;
    let previousDigit = soundexDigits[first] ?? "";
    for (let index = 1; index < letters.length && code.length < 4; index += 1) {
        const letter = letters[index] ?? "";
        const digit = soundexDigits[letter] ?? "";
        if (digit.length === 0) {
            if (isVowelSeparator(letter)) {
                previousDigit = "";
            }
            continue;
        }
        if (digit !== previousDigit) {
            code += digit;
        }
        previousDigit = digit;
    }
    return `${code}000`.slice(0, 4);
}

/**
 * @param value - The caller's text.
 * @returns Uppercase ASCII letters, in order. Other characters are ignored.
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
 * @param letter - One uppercase letter.
 * @returns `true` for a vowel or `Y`, which separate Soundex digits.
 */
function isVowelSeparator(letter: string): boolean {
    return (
        letter === "A" ||
        letter === "E" ||
        letter === "I" ||
        letter === "O" ||
        letter === "U" ||
        letter === "Y"
    );
}
