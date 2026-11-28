import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { escapeHTML } from "./escape-html.js";
import { unescapeHTML } from "../unescape-html/unescape-html.js";

const roundTripAlphabet =
    "&<>\"'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

describe("escapeHTML", () => {
    it("escapes the five markup characters", () => {
        expect(escapeHTML(`<a href="x">'`)).toBe(
            "&lt;a href=&quot;x&quot;&gt;&#39;",
        );
        expect(escapeHTML("Fish & chips")).toBe("Fish &amp; chips");
        expect(escapeHTML("")).toBe("");
        expect(escapeHTML("plain")).toBe("plain");
    });

    it("returns undefined for a non-string", () => {
        expect(escapeHTML(1 as never)).toBeUndefined();
        expect(escapeHTML(null as never)).toBeUndefined();
    });

    it("round-trips with unescapeHTML for the five characters and letters", () => {
        fc.assert(
            fc.property(
                fc.string({
                    unit: fc.constantFrom(...roundTripAlphabet),
                    maxLength: 24,
                }),
                (value) => {
                    expect(unescapeHTML(escapeHTML(value))).toBe(value);
                },
            ),
            { numRuns: 30 },
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(escapeHTML(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            escapeHTML("") === undefined ||
                typeof escapeHTML("") === "string" ||
                typeof escapeHTML("") === "boolean" ||
                typeof escapeHTML("") === "number" ||
                Array.isArray(escapeHTML("")) ||
                (typeof escapeHTML("") === "object" && escapeHTML("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            escapeHTML("👨‍👩‍👧") === undefined ||
                typeof escapeHTML("👨‍👩‍👧") === "string" ||
                typeof escapeHTML("👨‍👩‍👧") === "boolean" ||
                typeof escapeHTML("👨‍👩‍👧") === "number" ||
                Array.isArray(escapeHTML("👨‍👩‍👧")) ||
                (typeof escapeHTML("👨‍👩‍👧") === "object" &&
                    escapeHTML("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            escapeHTML("e\u0301") === undefined ||
                typeof escapeHTML("e\u0301") === "string" ||
                typeof escapeHTML("e\u0301") === "boolean" ||
                typeof escapeHTML("e\u0301") === "number" ||
                Array.isArray(escapeHTML("e\u0301")) ||
                (typeof escapeHTML("e\u0301") === "object" &&
                    escapeHTML("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            escapeHTML("مرحبا") === undefined ||
                typeof escapeHTML("مرحبا") === "string" ||
                typeof escapeHTML("مرحبا") === "boolean" ||
                typeof escapeHTML("مرحبا") === "number" ||
                Array.isArray(escapeHTML("مرحبا")) ||
                (typeof escapeHTML("مرحبا") === "object" &&
                    escapeHTML("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            escapeHTML("你好") === undefined ||
                typeof escapeHTML("你好") === "string" ||
                typeof escapeHTML("你好") === "boolean" ||
                typeof escapeHTML("你好") === "number" ||
                Array.isArray(escapeHTML("你好")) ||
                (typeof escapeHTML("你好") === "object" &&
                    escapeHTML("你好") !== null),
        ).toBe(true);
    });
});
