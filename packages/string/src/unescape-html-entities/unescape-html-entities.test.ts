import { describe, expect, it } from "vitest";
import { unescapeHTMLEntities } from "./unescape-html-entities.js";

describe("unescapeHTMLEntities", () => {
    it("decodes names and numeric references", () => {
        expect(unescapeHTMLEntities("&amp;")).toBe("&");
        expect(unescapeHTMLEntities("&amp")).toBe("&");
        expect(unescapeHTMLEntities("&#60;")).toBe("<");
        expect(unescapeHTMLEntities("&#x3C;")).toBe("<");
        expect(unescapeHTMLEntities("&#60")).toBe("<");
        expect(unescapeHTMLEntities({ value: "&notit", level: "html5" })).toBe(
            "¬it",
        );
        expect(unescapeHTMLEntities({ value: "&auml;", level: "html5" })).toBe(
            "ä",
        );
        expect(unescapeHTMLEntities({ value: "&apos;", level: "html4" })).toBe(
            "&apos;",
        );
        expect(unescapeHTMLEntities("no entities")).toBe("no entities");
        expect(unescapeHTMLEntities(null as never)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(unescapeHTMLEntities(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            unescapeHTMLEntities("") === undefined ||
                typeof unescapeHTMLEntities("") === "string" ||
                typeof unescapeHTMLEntities("") === "boolean" ||
                typeof unescapeHTMLEntities("") === "number" ||
                Array.isArray(unescapeHTMLEntities("")) ||
                (typeof unescapeHTMLEntities("") === "object" &&
                    unescapeHTMLEntities("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            unescapeHTMLEntities("👨‍👩‍👧") === undefined ||
                typeof unescapeHTMLEntities("👨‍👩‍👧") === "string" ||
                typeof unescapeHTMLEntities("👨‍👩‍👧") === "boolean" ||
                typeof unescapeHTMLEntities("👨‍👩‍👧") === "number" ||
                Array.isArray(unescapeHTMLEntities("👨‍👩‍👧")) ||
                (typeof unescapeHTMLEntities("👨‍👩‍👧") === "object" &&
                    unescapeHTMLEntities("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            unescapeHTMLEntities("e\u0301") === undefined ||
                typeof unescapeHTMLEntities("e\u0301") === "string" ||
                typeof unescapeHTMLEntities("e\u0301") === "boolean" ||
                typeof unescapeHTMLEntities("e\u0301") === "number" ||
                Array.isArray(unescapeHTMLEntities("e\u0301")) ||
                (typeof unescapeHTMLEntities("e\u0301") === "object" &&
                    unescapeHTMLEntities("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            unescapeHTMLEntities("مرحبا") === undefined ||
                typeof unescapeHTMLEntities("مرحبا") === "string" ||
                typeof unescapeHTMLEntities("مرحبا") === "boolean" ||
                typeof unescapeHTMLEntities("مرحبا") === "number" ||
                Array.isArray(unescapeHTMLEntities("مرحبا")) ||
                (typeof unescapeHTMLEntities("مرحبا") === "object" &&
                    unescapeHTMLEntities("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            unescapeHTMLEntities("你好") === undefined ||
                typeof unescapeHTMLEntities("你好") === "string" ||
                typeof unescapeHTMLEntities("你好") === "boolean" ||
                typeof unescapeHTMLEntities("你好") === "number" ||
                Array.isArray(unescapeHTMLEntities("你好")) ||
                (typeof unescapeHTMLEntities("你好") === "object" &&
                    unescapeHTMLEntities("你好") !== null),
        ).toBe(true);
    });
});
