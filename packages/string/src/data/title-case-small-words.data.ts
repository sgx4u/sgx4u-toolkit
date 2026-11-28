/**
 * APA small words.
 *
 * Compared case-insensitively. A word in this list stays lowercase in
 * title case unless it is the first or last word.
 */
export const apaSmallWords: readonly string[] = [
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "for",
    "if",
    "in",
    "nor",
    "of",
    "off",
    "on",
    "or",
    "per",
    "the",
    "to",
    "up",
    "via",
];

/**
 * Chicago small words.
 *
 * The APA list plus `yet`, `so`, `vs`, `versus`, and `etc`.
 */
export const chicagoSmallWords: readonly string[] = [
    ...apaSmallWords,
    "yet",
    "so",
    "vs",
    "versus",
    "etc",
];
