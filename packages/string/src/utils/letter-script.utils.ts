const latinLanguages = new Set([
    "af",
    "ca",
    "cs",
    "da",
    "de",
    "en",
    "es",
    "et",
    "fi",
    "fr",
    "hr",
    "hu",
    "id",
    "it",
    "nl",
    "no",
    "pl",
    "pt",
    "ro",
    "sk",
    "sl",
    "sv",
    "tr",
    "vi",
]);

const scriptByLanguage: Readonly<Record<string, string>> = {
    ar: "\\p{Script=Arabic}",
    bg: "\\p{Script=Cyrillic}",
    el: "\\p{Script=Greek}",
    fa: "\\p{Script=Arabic}",
    he: "\\p{Script=Hebrew}",
    hi: "\\p{Script=Devanagari}",
    ja: "\\p{Script=Han}|\\p{Script=Hiragana}|\\p{Script=Katakana}",
    ko: "\\p{Script=Hangul}",
    mr: "\\p{Script=Devanagari}",
    ru: "\\p{Script=Cyrillic}",
    th: "\\p{Script=Thai}",
    uk: "\\p{Script=Cyrillic}",
    zh: "\\p{Script=Han}",
};

/**
 * Pattern for one grapheme of letters, optionally with decimal digits.
 *
 * `"ascii"` is the Latin A-Z range. A known language uses that language's
 * usual script. An unknown language allows any letter, the same way `Intl`
 * falls back.
 *
 * @param locale - `"ascii"`, a BCP 47 tag, or `undefined`.
 * @param allowDigits - When `true`, decimal digits are letters for this check.
 * @returns A pattern that matches one whole grapheme.
 */
export function letterGraphemePattern(
    locale: string | undefined,
    allowDigits: boolean,
): RegExp {
    if (locale === "ascii") {
        return allowDigits ? /^[A-Za-z0-9]+$/u : /^[A-Za-z]+$/u;
    }
    const language = locale?.toLowerCase().split("-")[0];
    let letters = "\\p{L}";
    if (language !== undefined && scriptByLanguage[language] !== undefined) {
        const mapped = scriptByLanguage[language];
        letters = `(?:(?=\\p{L})(?:${mapped}))`;
    } else if (language !== undefined && latinLanguages.has(language)) {
        letters = "(?:(?=\\p{L})\\p{Script=Latin})";
    }
    const digitClass = allowDigits ? "|\\p{Nd}" : "";
    const lookahead = allowDigits ? "(?=.*(?:\\p{L}|\\p{Nd}))" : "(?=.*\\p{L})";
    return new RegExp(`^${lookahead}(?:${letters}${digitClass}|\\p{M})+$`, "u");
}
