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
