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
