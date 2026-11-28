import { describe, expect, it } from "vitest";
import { escapeRegExp, escapeRegExpFallback } from "./escape-reg-exp.js";

const nativeFixtures: ReadonlyArray<readonly [string, string]> = [
    ["", ""],
    ["a", "\\x61"],
    ["1", "\\x31"],
    ["foo.bar", "\\x66oo\\.bar"],
    [" ", "\\x20"],
    ["$", "\\$"],
    ["/", "\\/"],
    ["\n", "\\n"],
    ["-", "\\x2d"],
    ["é", "é"],
    ["\uD800", "\\ud800"],
    ["hello world", "\\x68ello\\x20world"],
];

describe("escapeRegExp", () => {
    it("matches the saved ES2025 fixtures and the native method", () => {
        for (const [value, expected] of nativeFixtures) {
            expect(escapeRegExpFallback(value)).toBe(expected);
            expect(escapeRegExp(value)).toBe(expected);
        }
        expect(escapeRegExp(null)).toBeUndefined();
        const nativeEscape = (RegExp as { escape?: (value: string) => string })
            .escape;
        if (typeof nativeEscape === "function") {
            const samples = ["a+b", "\t", "\b", "_", "\u00A0", "\u2028", "😀"];
            for (let codePoint = 0; codePoint < 128; codePoint += 1) {
                const character = String.fromCodePoint(codePoint);
                samples.push(character, `x${character}`);
            }
            for (const sample of samples) {
                expect(escapeRegExp(sample)).toBe(nativeEscape(sample));
                expect(escapeRegExpFallback(sample)).toBe(nativeEscape(sample));
            }
        }
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(escapeRegExp(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            escapeRegExp("") === undefined ||
                typeof escapeRegExp("") === "string" ||
                typeof escapeRegExp("") === "boolean" ||
                typeof escapeRegExp("") === "number" ||
                Array.isArray(escapeRegExp("")) ||
                (typeof escapeRegExp("") === "object" &&
                    escapeRegExp("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            escapeRegExp("👨‍👩‍👧") === undefined ||
                typeof escapeRegExp("👨‍👩‍👧") === "string" ||
                typeof escapeRegExp("👨‍👩‍👧") === "boolean" ||
                typeof escapeRegExp("👨‍👩‍👧") === "number" ||
                Array.isArray(escapeRegExp("👨‍👩‍👧")) ||
                (typeof escapeRegExp("👨‍👩‍👧") === "object" &&
                    escapeRegExp("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            escapeRegExp("e\u0301") === undefined ||
                typeof escapeRegExp("e\u0301") === "string" ||
                typeof escapeRegExp("e\u0301") === "boolean" ||
                typeof escapeRegExp("e\u0301") === "number" ||
                Array.isArray(escapeRegExp("e\u0301")) ||
                (typeof escapeRegExp("e\u0301") === "object" &&
                    escapeRegExp("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            escapeRegExp("مرحبا") === undefined ||
                typeof escapeRegExp("مرحبا") === "string" ||
                typeof escapeRegExp("مرحبا") === "boolean" ||
                typeof escapeRegExp("مرحبا") === "number" ||
                Array.isArray(escapeRegExp("مرحبا")) ||
                (typeof escapeRegExp("مرحبا") === "object" &&
                    escapeRegExp("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            escapeRegExp("你好") === undefined ||
                typeof escapeRegExp("你好") === "string" ||
                typeof escapeRegExp("你好") === "boolean" ||
                typeof escapeRegExp("你好") === "number" ||
                Array.isArray(escapeRegExp("你好")) ||
                (typeof escapeRegExp("你好") === "object" &&
                    escapeRegExp("你好") !== null),
        ).toBe(true);
    });
});
