import { describe, expect, it } from "vitest";
import { highlightMatches } from "./highlight-matches.js";

describe("highlightMatches", () => {
    it("escapes HTML and wraps non-overlapping matches", () => {
        expect(highlightMatches({ value: "Hello", query: "ell" })).toBe(
            "H<mark>ell</mark>o",
        );
        expect(highlightMatches({ value: "<b>", query: "b" })).toBe(
            "&lt;<mark>b</mark>&gt;",
        );
        expect(highlightMatches({ value: "Hello", query: "h" })).toBe(
            "<mark>H</mark>ello",
        );
        expect(
            highlightMatches({ value: "Hello", query: "h", ignoreCase: false }),
        ).toBe("Hello");
        expect(highlightMatches({ value: "a & b", query: "" })).toBe(
            "a &amp; b",
        );
        expect(highlightMatches({ value: "aaa", query: "aa" })).toBe(
            "<mark>aa</mark>a",
        );
        expect(highlightMatches(null as never)).toBeUndefined();
    });
});
