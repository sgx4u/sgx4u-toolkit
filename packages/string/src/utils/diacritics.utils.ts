/**
 * Letters whose NFD form does not split into a base letter plus marks.
 *
 * The values are the ASCII spellings this package uses. Upper and lower
 * case are both listed so the original case of the rest of the string can
 * stay put until a later lowercase step.
 */
const latinLetterMap: Readonly<Record<string, string>> = {
    ß: "ss",
    ẞ: "SS",
    Æ: "AE",
    æ: "ae",
    Ø: "O",
    ø: "o",
    Ð: "D",
    ð: "d",
    Þ: "TH",
    þ: "th",
    Ł: "L",
    ł: "l",
    Œ: "OE",
    œ: "oe",
};

/**
 * Removes diacritics and maps a small set of Latin letters to ASCII.
 *
 * The string is mapped, then normalized to NFD, then combining marks are
 * removed. `Å` becomes `A` because NFD splits it. Sharp s becomes `ss`
 * because NFD leaves it in one character. The input is not changed.
 *
 * @param value - Text that may contain accents.
 * @returns A new string without combining marks.
 */
export function stripDiacritics(value: string): string {
    let mapped = "";
    for (const character of value) {
        mapped += latinLetterMap[character] ?? character;
    }
    return mapped.normalize("NFD").replace(/\p{M}+/gu, "");
}
