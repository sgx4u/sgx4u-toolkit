const soundexMap = "01230120022455012623010202";

/**
 * English Soundex code, four characters, padded with zeros.
 *
 * @param value - A word. Non-letters are ignored.
 * @returns The code, or `undefined` when there is no letter.
 */
export function soundexCode(value: string): string | undefined {
    const letters = value.toUpperCase().replace(/[^A-Z]/gu, "");
    if (letters.length === 0) {
        return undefined;
    }
    let code = letters[0] ?? "";
    let previous = soundexDigit(letters[0] ?? "");
    for (const letter of letters.slice(1)) {
        const digit = soundexDigit(letter);
        if (digit !== "0" && digit !== previous) {
            code += digit;
        }
        if (digit !== "0") {
            previous = digit;
        }
        if (code.length === 4) {
            break;
        }
    }
    return code.padEnd(4, "0");
}

/**
 * @param letter - One A-Z letter.
 * @returns The Soundex digit, or `0` for a vowel or H, W, Y.
 */
function soundexDigit(letter: string): string {
    const index = letter.charCodeAt(0) - 65;
    return soundexMap[index] ?? "0";
}

/**
 * Original Metaphone code from the published 1990 rule summary.
 *
 * @param value - A word.
 * @returns The code, or `undefined` when there is no letter.
 */
export function metaphoneCode(value: string): string | undefined {
    let word = value.toUpperCase().replace(/[^A-Z]/gu, "");
    if (word.length === 0) {
        return undefined;
    }
    word = word.replace(/(.)\1+/gu, "$1").replace(/CC/gu, "CC");
    if (/^(KN|GN|PN|AE|WR)/u.test(word)) {
        word = word.slice(1);
    }
    let code = "";
    for (let index = 0; index < word.length; index += 1) {
        const letter = word[index] ?? "";
        const next = word[index + 1] ?? "";
        const after = word.slice(index + 1, index + 3);
        if ("AEIOU".includes(letter)) {
            if (code.length === 0) {
                code += letter;
            }
            continue;
        }
        if (letter === "B") {
            if (!(index === word.length - 1 && word[index - 1] === "M")) {
                code += "B";
            }
        } else if (letter === "C") {
            if (
                after === "IA" ||
                (next === "H" && word.slice(index - 1, index + 2) !== "SCH")
            ) {
                code +=
                    next === "H" &&
                    word.slice(Math.max(0, index - 1), index + 2) === "SCH"
                        ? "K"
                        : "X";
            } else if ("IEY".includes(next)) {
                code += "S";
            } else {
                code += "K";
            }
        } else if (letter === "D") {
            code += "GE GY GI".includes(word.slice(index + 1, index + 3))
                ? "J"
                : "T";
        } else if (letter === "G") {
            if (
                next === "H" &&
                index < word.length - 2 &&
                !"AEIOU".includes(word[index + 2] ?? "")
            ) {
                continue;
            }
            if (next === "N" && index >= word.length - 2) {
                continue;
            }
            code += "IEY".includes(next) && word[index - 1] !== "G" ? "J" : "K";
        } else if (letter === "H") {
            if (
                "AEIOU".includes(word[index - 1] ?? "") &&
                !"AEIOU".includes(next)
            ) {
                continue;
            }
            if ("AEIOU".includes(next)) {
                code += "H";
            }
        } else if (letter === "K") {
            if (word[index - 1] !== "C") {
                code += "K";
            }
        } else if (letter === "P") {
            code += next === "H" ? "F" : "P";
            if (next === "H") {
                index += 1;
            }
        } else if (letter === "Q") {
            code += "K";
        } else if (letter === "S") {
            code +=
                next === "H" || after === "IO" || after === "IA" ? "X" : "S";
        } else if (letter === "T") {
            if (next === "H") {
                code += "0";
                index += 1;
            } else if (after === "IA" || after === "IO") {
                code += "X";
            } else if (next !== "C" || word[index + 2] !== "H") {
                code += "T";
            }
        } else if (letter === "V") {
            code += "F";
        } else if (letter === "W") {
            if (index === 0 && next === "H") {
                code += "W";
            } else if ("AEIOU".includes(next)) {
                code += "W";
            }
        } else if (letter === "X") {
            code += index === 0 ? "S" : "KS";
        } else if (letter === "Y") {
            if ("AEIOU".includes(next)) {
                code += "Y";
            }
        } else if (letter === "Z") {
            code += "S";
        } else if ("FJLMRN".includes(letter)) {
            code += letter;
        }
    }
    return code;
}

/**
 * A compact dual phonetic code.
 *
 * `Smith` is `SM0` / `XMT`. `Schmidt` is `XMT` / `SMT`. When there is no
 * alternate, both codes are the same. Codes are four characters.
 *
 * @param value - A word.
 * @returns The two codes, or `undefined` when there is no letter.
 */
export function doubleMetaphoneCode(
    value: string,
): { primary: string; secondary: string } | undefined {
    const word = value.toUpperCase().replace(/[^A-Z]/gu, "");
    if (word.length === 0) {
        return undefined;
    }
    let primary = "";
    let secondary = "";
    const push = (main: string, alternate: string = main) => {
        primary += main;
        secondary += alternate;
    };
    for (let index = 0; index < word.length && primary.length < 4; index += 1) {
        const letter = word[index] ?? "";
        const next = word[index + 1] ?? "";
        if ("AEIOU".includes(letter)) {
            if (primary.length === 0) {
                push("A");
            }
            continue;
        }
        if (letter === "S" && word.startsWith("SCH", index)) {
            push("X", "S");
            index += 2;
        } else if (letter === "S" && next === "H") {
            push("X");
            index += 1;
        } else if (letter === "T" && next === "H") {
            push("0", "T");
            index += 1;
        } else if (letter === "S" && index === 0) {
            push("S", "X");
        } else if ("BFPV".includes(letter)) {
            push(
                letter === "V"
                    ? "F"
                    : letter === "P" && next === "H"
                      ? "F"
                      : letter === "B"
                        ? "P"
                        : letter,
            );
        } else if ("CGKQ".includes(letter)) {
            push(letter === "C" && "EIY".includes(next) ? "S" : "K");
        } else if (letter === "D") {
            push("T");
        } else if (letter === "Z") {
            push("S");
        } else if ("LMNR".includes(letter)) {
            push(letter);
        } else if (letter === "X") {
            push("KS");
        }
    }
    return {
        primary: primary.slice(0, 4),
        secondary: (secondary || primary).slice(0, 4),
    };
}
