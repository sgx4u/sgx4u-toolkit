import { describe, expect, it } from "vitest";
import { convertCase } from "./convert-case/convert-case.js";
import { createHTMLEntities } from "./create-html-entities/create-html-entities.js";
import { createString } from "./create-string/create-string.js";
import { createTransliterate } from "./create-transliterate/create-transliterate.js";
import { escapeHTMLEntities } from "./escape-html-entities/escape-html-entities.js";
import { extractEmails } from "./extract-emails/extract-emails.js";
import { getDoubleMetaphone } from "./get-double-metaphone/get-double-metaphone.js";
import { getExcerpt } from "./get-excerpt/get-excerpt.js";
import { getMetaphone } from "./get-metaphone/get-metaphone.js";
import { getSoundex } from "./get-soundex/get-soundex.js";
import { isBase32 } from "./is-base32/is-base32.js";
import { isCreditCard } from "./is-credit-card/is-credit-card.js";
import { isDataURI } from "./is-data-uri/is-data-uri.js";
import { isEmail } from "./is-email/is-email.js";
import { isFQDN } from "./is-fqdn/is-fqdn.js";
import { isHSLColor } from "./is-hsl-color/is-hsl-color.js";
import { isIP } from "./is-ip/is-ip.js";
import { isRGBColor } from "./is-rgb-color/is-rgb-color.js";
import { isURL } from "./is-url/is-url.js";
import { isVAT } from "./is-vat/is-vat.js";
import { pluralize } from "./pluralize/pluralize.js";
import { singularize } from "./singularize/singularize.js";
import { slugify } from "./slugify/slugify.js";
import { stripHTMLTags } from "./strip-html-tags/strip-html-tags.js";
import { toFilename } from "./to-filename/to-filename.js";
import { toKebabCase } from "./to-kebab-case/to-kebab-case.js";
import { toTitleCase } from "./to-title-case/to-title-case.js";
import { unescapeHTMLEntities } from "./unescape-html-entities/unescape-html-entities.js";
import { wrapText } from "./wrap-text/wrap-text.js";
import {
    damerauLevenshteinDistance,
    diceCoefficient,
    hammingDistance,
    jaroWinklerSimilarity,
    levenshteinDistance,
    longestCommonSubsequence,
    normalizedLevenshteinSimilarity,
} from "./utils/distance.utils.js";
import {
    decodeBase64Bytes,
    decodeHexString,
    decodeUtf8,
    domainFromPunycode,
    domainToPunycode,
    encodeBase64Bytes,
    encodeHexString,
} from "./utils/encoding.utils.js";
import { describeReceived } from "./utils/describe-received.utils.js";
import {
    englishArticle,
    englishOrdinal,
    firstGrapheme,
    formatEnglishCount,
    pluralForm,
    readCount,
    readEnglishLocale,
    readOrdinalCount,
    singularForm,
} from "./utils/inflection.utils.js";
import { localeForIntl, readLocale } from "./utils/locale.utils.js";
import { foldSearchText, unitIndexToCodeUnit } from "./utils/search.utils.js";
import {
    metaphoneCode,
    doubleMetaphoneCode,
    soundexCode,
} from "./utils/phonetics.utils.js";

/**
 * Builds a Luhn number from a body that does not yet include the check digit.
 *
 * @param body - Digits without the check digit.
 * @returns The body plus one check digit.
 */
function withLuhnDigit(body: string): string {
    let sum = 0;
    const reversed = [...body].reverse();
    reversed.forEach((character, index) => {
        let digit = Number(character);
        if (index % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
    });
    return body + String((10 - (sum % 10)) % 10);
}

describe("edge cases", () => {
    it("covers phonetic letter rules", () => {
        const words = [
            "",
            "123",
            "Robert",
            "Rupert",
            "Ashcraft",
            "Smith",
            "Schmidt",
            "Knight",
            "Gnome",
            "Pneumonia",
            "Aerial",
            "Write",
            "School",
            "Cheese",
            "Celt",
            "Dodge",
            "Ghost",
            "Sign",
            "Laugh",
            "Photo",
            "Shell",
            "Thumb",
            "Match",
            "What",
            "Xavier",
            "Yellow",
            "Zebra",
            "Queen",
            "Joke",
            "Lamp",
            "Lamb",
            "Back",
            "Ratio",
            "Spatial",
            "Phone",
            "Ship",
            "This",
            "Chat",
            "Edge",
            "Comb",
            "Why",
            "Xylophone",
            "Whisper",
            "Accent",
            "Science",
            "Tchaikovsky",
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        ];
        for (const word of words) {
            expect(
                getSoundex(word) === undefined ||
                    typeof getSoundex(word) === "string",
            ).toBe(true);
            expect(
                getMetaphone(word) === undefined ||
                    typeof getMetaphone(word) === "string",
            ).toBe(true);
            const pair = getDoubleMetaphone(word);
            expect(pair === undefined || typeof pair.primary === "string").toBe(
                true,
            );
            soundexCode(word);
            metaphoneCode(word);
            doubleMetaphoneCode(word);
        }
        expect(getSoundex("Robert")).toBe("R163");
    });

    it("covers locale, search, and received descriptions", () => {
        expect(readLocale(undefined)).toBeUndefined();
        expect(readLocale("en-US")).toBe("en-US");
        expect(readLocale(["ja-JP", "en"])).toEqual(["ja-JP", "en"]);
        expect(() => readLocale("")).toThrow(RangeError);
        expect(() => readLocale([])).toThrow(RangeError);
        expect(() => readLocale([""])).toThrow(RangeError);
        expect(() => readLocale([1])).toThrow(TypeError);
        expect(() => readLocale(1)).toThrow(TypeError);
        expect(localeForIntl(["en"])).toEqual(["en"]);
        expect(localeForIntl("en")).toBe("en");
        expect(foldSearchText("A", true, ["tr-TR"])).toBe("a");
        expect(foldSearchText("A", false, undefined)).toBe("A");
        expect(unitIndexToCodeUnit("é", 1, "codeUnit")).toBe(1);
        expect(unitIndexToCodeUnit("é", 1, "grapheme")).toBe(1);
        expect(unitIndexToCodeUnit("é", 5, "codePoint")).toBe(1);
        expect(describeReceived(null)).toBe("null");
        expect(describeReceived(undefined)).toBe("undefined");
        expect(describeReceived("a")).toBe('"a"');
        expect(describeReceived(1)).toBe("1");
        expect(describeReceived(true)).toBe("true");
        expect(describeReceived(1n)).toBe("1");
        expect(describeReceived(Symbol("s"))).toContain("Symbol");
        expect(describeReceived(() => undefined)).toBe("a function");
        expect(describeReceived([])).toBe("an array");
        expect(describeReceived({})).toBe("an object");
    });

    it("covers encoding failures and punycode", () => {
        expect(decodeHexString("zz")).toBeUndefined();
        expect(decodeHexString("abc")).toBeUndefined();
        expect(decodeHexString("41")).toBe("A");
        expect(encodeHexString("A")).toBe("41");
        expect(decodeUtf8(new Uint8Array([0xff]))).toBeUndefined();
        expect(decodeUtf8("nope" as unknown as Uint8Array)).toBeUndefined();
        expect(decodeBase64Bytes("@@@@", false)).toBeUndefined();
        expect(decodeBase64Bytes("YQ", true)?.length).toBe(1);
        expect(encodeBase64Bytes(new Uint8Array([0, 1, 2, 3]), true)).toContain(
            "AA",
        );
        expect(domainToPunycode("münchen.de")).toBe("xn--mnchen-3ya.de");
        expect(domainFromPunycode("xn--mnchen-3ya.de")).toBe("münchen.de");
        expect(domainToPunycode("not a domain")).toBeUndefined();
        expect(domainFromPunycode("xn--")).toBeUndefined();
    });

    it("covers inflection tables", () => {
        const words = [
            "child",
            "children",
            "person",
            "people",
            "man",
            "men",
            "woman",
            "women",
            "index",
            "indexes",
            "octopus",
            "octopuses",
            "bus",
            "buses",
            "city",
            "cities",
            "knife",
            "knives",
            "sheep",
            "data",
            "datum",
            "analysis",
            "analyses",
            "mouse",
            "mice",
            "leaf",
            "leaves",
            "quiz",
            "quizzes",
            "box",
            "boxes",
            "church",
            "churches",
            "day",
            "days",
            "wife",
            "wives",
            "criterion",
            "criteria",
            "phenomenon",
            "phenomena",
        ];
        for (const word of words) {
            pluralForm(word);
            singularForm(word);
            pluralize(word);
            singularize(word);
        }
        expect(englishOrdinal(1)).toBe("1st");
        expect(englishOrdinal(2)).toBe("2nd");
        expect(englishOrdinal(3)).toBe("3rd");
        expect(englishOrdinal(11)).toBe("11th");
        expect(englishOrdinal(21)).toBe("21st");
        expect(englishArticle("apple")).toBe("an");
        expect(englishArticle("honour")).toBe("an");
        expect(englishArticle("unicorn")).toBe("a");
        expect(englishArticle("8")).toBe("an");
        expect(englishArticle("FBI")).toBe("an");
        expect(englishArticle("cat")).toBe("a");
        expect(firstGrapheme("")).toBe("");
        expect(firstGrapheme("👨‍👩‍👧")).toBe("👨‍👩‍👧");
        expect(readCount(undefined, 1)).toBe(1);
        expect(readCount(2)).toBe(2);
        expect(() => readCount("2")).toThrow(TypeError);
        expect(readOrdinalCount(-1)).toBe(-1);
        expect(() => readOrdinalCount(1.5)).toThrow(RangeError);
        expect(formatEnglishCount("cat", 1, "en")).toContain("cat");
        expect(formatEnglishCount("cat", 2, "en")).toContain("cats");
        expect(() => readEnglishLocale("fr")).toThrow(RangeError);
        expect(readEnglishLocale(undefined)).toBe("en");
    });

    it("covers distance algorithms", () => {
        expect(levenshteinDistance([], [])).toBe(0);
        expect(levenshteinDistance([..."kitten"], [..."sitting"])).toBe(3);
        expect(levenshteinDistance([], [..."abc"])).toBe(3);
        expect(damerauLevenshteinDistance([..."ab"], [..."ba"])).toBe(1);
        expect(damerauLevenshteinDistance([..."abc"], [..."ab"])).toBe(1);
        expect(hammingDistance([..."abc"], [..."abc"])).toBe(0);
        expect(hammingDistance([..."abc"], [..."ab"])).toBeUndefined();
        expect(jaroWinklerSimilarity([], [])).toBe(1);
        expect(
            jaroWinklerSimilarity([..."martha"], [..."marhta"]),
        ).toBeGreaterThan(0.9);
        expect(diceCoefficient([], [..."a"])).toBe(0);
        expect(diceCoefficient([..."night"], [..."nacht"])).toBeGreaterThan(0);
        expect(longestCommonSubsequence([], [..."a"])).toBe("");
        expect(longestCommonSubsequence([..."abc"], [..."ac"])).toBe("ac");
        expect(normalizedLevenshteinSimilarity([], [])).toBe(1);
        expect(normalizedLevenshteinSimilarity([..."a"], [])).toBe(0);
    });

    it("covers card, color, url, email, and vat branches", () => {
        expect(isCreditCard(withLuhnDigit("4".padEnd(15, "0")))).toBe(true);
        expect(isCreditCard(withLuhnDigit("4".padEnd(12, "0")))).toBe(true);
        expect(isCreditCard(withLuhnDigit("4".padEnd(18, "0")))).toBe(true);
        expect(isCreditCard(withLuhnDigit("51".padEnd(15, "0")))).toBe(true);
        expect(isCreditCard(withLuhnDigit("2221".padEnd(15, "0")))).toBe(true);
        expect(isCreditCard(withLuhnDigit("34".padEnd(14, "0")))).toBe(true);
        expect(isCreditCard(withLuhnDigit("6011".padEnd(15, "0")))).toBe(true);
        expect(isCreditCard(withLuhnDigit("65".padEnd(15, "0")))).toBe(true);
        expect(isCreditCard(withLuhnDigit("644".padEnd(15, "0")))).toBe(true);
        expect(isCreditCard(withLuhnDigit("62".padEnd(15, "0")))).toBe(true);
        expect(isCreditCard(withLuhnDigit("62".padEnd(18, "0")))).toBe(true);
        expect(isCreditCard("123")).toBe(false);
        expect(isCreditCard(1)).toBe(false);
        expect(isCreditCard(withLuhnDigit("34".padEnd(15, "0")))).toBe(false);
        expect(isRGBColor("rgb(1, 2, 3)")).toBe(true);
        expect(isRGBColor("rgba(1, 2, 3, 0.5)")).toBe(true);
        expect(isRGBColor("rgb(1 2 3 / 50%)")).toBe(true);
        expect(isRGBColor("rgb(100%, 0%, 0%)")).toBe(true);
        expect(isRGBColor("rgb(1, 2%, 3)")).toBe(false);
        expect(isRGBColor("rgb()")).toBe(false);
        expect(isRGBColor("rgb(1, 2)")).toBe(false);
        expect(isRGBColor("hsl(1,2,3)")).toBe(false);
        expect(isRGBColor(1)).toBe(false);
        expect(isHSLColor("hsl(120, 50%, 40%)")).toBe(true);
        expect(isHSLColor("hsla(120, 50%, 40%, 0.5)")).toBe(true);
        expect(isHSLColor("hsl(120 50% 40% / 0.2)")).toBe(true);
        expect(isHSLColor("hsl(nope)")).toBe(false);
        expect(isHSLColor(1)).toBe(false);
        expect(isDataURI("data:text/plain,hi")).toBe(true);
        expect(isDataURI("data:text/plain;base64,YQ==")).toBe(true);
        expect(isDataURI("data:,")).toBe(true);
        expect(isDataURI("http://example.com")).toBe(false);
        expect(isDataURI(1)).toBe(false);
        expect(isURL("https://example.com/path?q=1#h")).toBe(true);
        expect(isURL("ftp://example.com")).toBe(false);
        expect(isURL({ value: "example.com", requireProtocol: false })).toBe(
            true,
        );
        expect(
            isURL({
                value: "http://127.0.0.1",
                allowIP: true,
                requireTopLevelDomain: false,
            }),
        ).toBe(true);
        expect(
            isURL({
                value: "http://[::1]",
                allowIP: true,
                requireTopLevelDomain: false,
            }),
        ).toBe(true);
        expect(
            isURL({
                value: "http://localhost",
                allowLocalhost: true,
                requireTopLevelDomain: false,
            }),
        ).toBe(true);
        expect(
            isURL({
                value: "https://user:pass@example.com",
                allowCredentials: true,
            }),
        ).toBe(true);
        expect(
            isURL({ value: "https://example.com.", protocols: ["HTTPS:"] }),
        ).toBe(true);
        expect(isURL("not a url")).toBe(false);
        expect(() =>
            isURL({
                value: "https://example.com",
                protocols: "http" as unknown as string[],
            }),
        ).toThrow(TypeError);
        expect(() =>
            isURL({ value: "https://example.com", protocols: [""] }),
        ).toThrow(RangeError);
        expect(isEmail("ada@example.com")).toBe(true);
        expect(
            isEmail({ value: "Ada <ada@example.com>", allowDisplayName: true }),
        ).toBe(true);
        expect(
            isEmail({ value: "ada@localhost", requireTopLevelDomain: false }),
        ).toBe(true);
        expect(
            isEmail({
                value: "ada@[127.0.0.1]",
                allowIPDomain: true,
                requireTopLevelDomain: false,
            }),
        ).toBe(true);
        expect(
            isEmail({ value: "adá@example.com", allowUTF8LocalPart: false }),
        ).toBe(false);
        expect(isEmail("<>")).toBe(false);
        expect(isEmail(1)).toBe(false);
        expect(isFQDN("example.com")).toBe(true);
        expect(
            isFQDN({ value: "localhost", requireTopLevelDomain: false }),
        ).toBe(true);
        expect(isIP({ value: "127.0.0.1", version: 4 })).toBe(true);
        expect(isIP({ value: "::1", version: 6 })).toBe(true);
        expect(isIP({ value: "127.0.0.1", version: "any" })).toBe(true);
        expect(isBase32("MFRGG")).toBe(true);
        expect(isBase32("!!!!")).toBe(false);
        expect(isVAT("BE0000000097")).toBe(true);
        expect(isVAT("GBGD123")).toBe(true);
        expect(isVAT({ value: "DE 123456789", country: "DE" })).toBe(true);
        expect(() => isVAT({ value: "1", country: "" })).toThrow(RangeError);
    });

    it("covers factories, case, wrap, slug, and entities", () => {
        const strings = createString({
            locale: ["en-US"],
            unit: "codePoint",
            keepConsecutiveUppercase: true,
            mergeAmbiguousCharacters: true,
            titleCaseStyle: "apa",
            smallWords: ["of"],
            slugifySeparator: "_",
            slugifyLowerCase: false,
            truncationOmission: "...",
            truncationLocation: "middle",
            maskCharacter: "#",
            unmaskedStartLength: 1,
            unmaskedEndLength: 1,
            collatorSensitivity: "base",
            numericCollation: true,
            normalizeForm: "NFD",
            wordsPerMinute: 100,
            templatePattern: "double-curly",
        });
        expect(strings.toPascalCase("XMLHttpRequest")).toBe("XMLHttpRequest");
        expect(strings.slugify({ value: "Hello World", separator: "-" })).toBe(
            "Hello-World",
        );
        expect(
            strings.truncate({ value: 1 as never, maximumLength: 4 }),
        ).toBeUndefined();
        expect(() => createString({ locale: "" })).toThrow(RangeError);
        expect(() => createString({ locale: [] })).toThrow(RangeError);
        expect(() => createString({ locale: 1 as never })).toThrow(TypeError);
        expect(() => createString({ unit: "nope" as never })).toThrow(
            RangeError,
        );
        expect(() => createString({ wordsPerMinute: 0 })).toThrow(RangeError);
        expect(() => createString({ wordsPerMinute: "fast" as never })).toThrow(
            RangeError,
        );
        expect(() => createString(null as never)).toThrow(TypeError);
        const text = createTransliterate({
            locale: "de",
            slugifySeparator: "_",
        });
        expect(text.transliterate("Ü")).toBe("Ue");
        expect(text.transliterate({ value: "Ü", locale: "en" })).toBe("U");
        expect(text.transliterate(1 as unknown as string)).toBeUndefined();
        expect(text.slugifyTransliterated("Über uns")).toBe("ueber_uns");
        expect(() => createTransliterate({ nope: true } as never)).toThrow(
            RangeError,
        );
        const html = createHTMLEntities({ level: "html4" });
        expect(html.escapeHTMLEntities("<")).toBe("&lt;");
        expect(html.escapeHTMLEntities({ value: "<", level: "xml" })).toBe(
            "&lt;",
        );
        expect(html.unescapeHTMLEntities("&amp;")).toBe("&");
        expect(() => createHTMLEntities({ level: "svg" as never })).toThrow(
            RangeError,
        );
        expect(escapeHTMLEntities("é")).toContain("&");
        expect(escapeHTMLEntities(1 as unknown as string)).toBeUndefined();
        expect(unescapeHTMLEntities("&#65;")).toBe("A");
        expect(unescapeHTMLEntities("&#x41;")).toBe("A");
        expect(unescapeHTMLEntities("&nbsp")).toBe("\u00A0");
        expect(unescapeHTMLEntities("&zzzz;")).toBe("&zzzz;");
        expect(unescapeHTMLEntities("&#x110000;")).toBe("&#x110000;");
        expect(unescapeHTMLEntities("&#;")).toBe("&#;");
        for (const caseName of [
            "camel",
            "pascal",
            "snake",
            "kebab",
            "constant",
            "dot",
            "path",
            "train",
            "pascal-snake",
            "sentence",
            "title",
            "capital",
            "no-case",
            "lower",
            "upper",
        ] as const) {
            expect(convertCase({ value: "foo bar", case: caseName })).toEqual(
                expect.any(String),
            );
        }
        expect(
            convertCase({ value: 1 as unknown as string, case: "camel" }),
        ).toBeUndefined();
        expect(() =>
            convertCase({ value: "a", case: "nope" as "camel" }),
        ).toThrow(RangeError);
        expect(
            toTitleCase({ value: "the lord of the rings", style: "chicago" }),
        ).toContain("of");
        expect(toKebabCase(1 as unknown as string)).toBeUndefined();
        expect(
            wrapText({
                value: "hello world\r\nnext",
                maximumWidth: 5,
                indent: " ",
                breakLongWords: true,
            }),
        ).toContain("\n");
        expect(
            wrapText({
                value: "supercalifragilistic",
                maximumWidth: 4,
                breakLongWords: false,
            }),
        ).toContain("super");
        expect(
            wrapText({ value: 1 as unknown as string, maximumWidth: 4 }),
        ).toBeUndefined();
        expect(
            slugify({
                value: "Hello",
                separator: "_",
                lowerCase: false,
                maximumLength: 3,
            }),
        ).toBe("Hel");
        expect(() => slugify({ value: "a", separator: "" })).toThrow(
            RangeError,
        );
        expect(toFilename({ value: "con.txt", replacement: "_" })).toContain(
            "con",
        );
        expect(
            stripHTMLTags({ value: "<b>hi</b>", allowedTags: ["b"] }),
        ).toContain("hi");
        expect(
            getExcerpt({
                value: "hello world",
                maximumLength: 8,
                breakOnWord: true,
            }),
        ).toContain("hello");
        expect(
            extractEmails("mail ada@example.com and bob@example.org"),
        ).toEqual(["ada@example.com", "bob@example.org"]);
    });
});
