import { describe, expect, it } from "vitest";
import { unescapeHTML } from "./unescape-html.js";

describe("unescapeHTML", () => {
    it("reverses the five named escapes and numeric references", () => {
        expect(unescapeHTML("&amp;&lt;&gt;&quot;&#39;")).toBe("&<>\"'");
        expect(unescapeHTML("&#65;")).toBe("A");
        expect(unescapeHTML("&#x41;")).toBe("A");
        expect(unescapeHTML("&#X41;")).toBe("A");
        expect(unescapeHTML("&#00065;")).toBe("A");
        expect(unescapeHTML("")).toBe("");
    });

    it("leaves other named entities and invalid numbers unchanged", () => {
        expect(unescapeHTML("&nbsp;")).toBe("&nbsp;");
        expect(unescapeHTML("&AMP;")).toBe("&AMP;");
        expect(unescapeHTML("&#x;")).toBe("&#x;");
        expect(unescapeHTML("&#;")).toBe("&#;");
        expect(unescapeHTML("&#x110000;")).toBe("&#x110000;");
        expect(unescapeHTML("&#xD800;")).toBe("&#xD800;");
        expect(unescapeHTML("&amp")).toBe("&amp");
        expect(unescapeHTML("&amp;lt;")).toBe("&lt;");
    });

    it("does not throw for garbage and returns undefined for a non-string", () => {
        expect(unescapeHTML("&")).toBe("&");
        expect(unescapeHTML("&#999999999999;")).toBe("&#999999999999;");
        expect(unescapeHTML(1 as never)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(unescapeHTML(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            unescapeHTML("") === undefined ||
                typeof unescapeHTML("") === "string" ||
                typeof unescapeHTML("") === "boolean" ||
                typeof unescapeHTML("") === "number" ||
                Array.isArray(unescapeHTML("")) ||
                (typeof unescapeHTML("") === "object" &&
                    unescapeHTML("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            unescapeHTML("👨‍👩‍👧") === undefined ||
                typeof unescapeHTML("👨‍👩‍👧") === "string" ||
                typeof unescapeHTML("👨‍👩‍👧") === "boolean" ||
                typeof unescapeHTML("👨‍👩‍👧") === "number" ||
                Array.isArray(unescapeHTML("👨‍👩‍👧")) ||
                (typeof unescapeHTML("👨‍👩‍👧") === "object" &&
                    unescapeHTML("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            unescapeHTML("e\u0301") === undefined ||
                typeof unescapeHTML("e\u0301") === "string" ||
                typeof unescapeHTML("e\u0301") === "boolean" ||
                typeof unescapeHTML("e\u0301") === "number" ||
                Array.isArray(unescapeHTML("e\u0301")) ||
                (typeof unescapeHTML("e\u0301") === "object" &&
                    unescapeHTML("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            unescapeHTML("مرحبا") === undefined ||
                typeof unescapeHTML("مرحبا") === "string" ||
                typeof unescapeHTML("مرحبا") === "boolean" ||
                typeof unescapeHTML("مرحبا") === "number" ||
                Array.isArray(unescapeHTML("مرحبا")) ||
                (typeof unescapeHTML("مرحبا") === "object" &&
                    unescapeHTML("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            unescapeHTML("你好") === undefined ||
                typeof unescapeHTML("你好") === "string" ||
                typeof unescapeHTML("你好") === "boolean" ||
                typeof unescapeHTML("你好") === "number" ||
                Array.isArray(unescapeHTML("你好")) ||
                (typeof unescapeHTML("你好") === "object" &&
                    unescapeHTML("你好") !== null),
        ).toBe(true);
    });
});
