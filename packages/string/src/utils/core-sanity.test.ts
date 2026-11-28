import { describe, expect, it } from "vitest";
import { joinCaseWords } from "./case-join.utils.js";
import { measureDisplayWidth } from "./display-width.utils.js";
import {
    decodeBase64Bytes,
    domainFromPunycode,
    domainToPunycode,
    encodeBase64Bytes,
    encodeUtf8,
    decodeUtf8,
} from "./encoding.utils.js";
import { pluralForm, singularForm } from "./inflection.utils.js";
import { splitIntoWords } from "./words.utils.js";

describe("core helpers", () => {
    it("round-trips base64 and punycode", () => {
        for (const sample of ["", "a", "hello", "😀", "münchen"]) {
            const bytes = encodeUtf8(sample);
            const standard = encodeBase64Bytes(bytes, false);
            const url = encodeBase64Bytes(bytes, true);
            expect(
                decodeUtf8(
                    decodeBase64Bytes(standard, false) ?? new Uint8Array(),
                ),
            ).toBe(sample);
            expect(
                decodeUtf8(decodeBase64Bytes(url, true) ?? new Uint8Array()),
            ).toBe(sample);
        }
        expect(domainToPunycode("münchen.de")).toBe("xn--mnchen-3ya.de");
        expect(domainFromPunycode("xn--mnchen-3ya.de")).toBe("münchen.de");
    });

    it("splits case words", () => {
        const split = (value: string, merge = false) =>
            splitIntoWords(value, { mergeAmbiguousCharacters: merge });
        expect(split("XMLHttpRequest")).toEqual(["XML", "Http", "Request"]);
        expect(
            joinCaseWords(split("XMLHttpRequest"), "kebab", undefined, false),
        ).toBe("xml-http-request");
        expect(
            joinCaseWords(split("XMLHttpRequest"), "pascal", undefined, false),
        ).toBe("XmlHttpRequest");
        expect(
            joinCaseWords(split("XMLHttpRequest"), "pascal", undefined, true),
        ).toBe("XMLHttpRequest");
        expect(joinCaseWords(split("userID"), "camel", undefined, false)).toBe(
            "userId",
        );
        expect(joinCaseWords(split("userID"), "camel", undefined, true)).toBe(
            "userID",
        );
        expect(joinCaseWords(split("v1.2"), "snake", undefined, false)).toBe(
            "v_1_2",
        );
        expect(
            joinCaseWords(split("V1.2", true), "camel", undefined, false),
        ).toBe("v12");
        expect(split("__typename")).toEqual(["typename"]);
        expect(measureDisplayWidth("あ", false)).toBe(2);
        expect(measureDisplayWidth("👨‍👩‍👧‍👦", false)).toBe(2);
        expect(pluralForm("city")).toBe("cities");
        expect(singularForm("buses")).toBe("bus");
        expect(singularForm("bus")).toBe("bus");
        expect(pluralForm("index")).toBe("indexes");
        expect(pluralForm("sheep")).toBe("sheep");
    });
});
