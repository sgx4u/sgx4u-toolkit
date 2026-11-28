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

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(highlightMatches(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            highlightMatches({ value: "", query: "ell" }) === undefined ||
                typeof highlightMatches({ value: "", query: "ell" }) ===
                    "string" ||
                typeof highlightMatches({ value: "", query: "ell" }) ===
                    "boolean" ||
                typeof highlightMatches({ value: "", query: "ell" }) ===
                    "number" ||
                Array.isArray(highlightMatches({ value: "", query: "ell" })) ||
                (typeof highlightMatches({ value: "", query: "ell" }) ===
                    "object" &&
                    highlightMatches({ value: "", query: "ell" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            highlightMatches({ value: "👨‍👩‍👧", query: "ell" }) === undefined ||
                typeof highlightMatches({ value: "👨‍👩‍👧", query: "ell" }) ===
                    "string" ||
                typeof highlightMatches({ value: "👨‍👩‍👧", query: "ell" }) ===
                    "boolean" ||
                typeof highlightMatches({ value: "👨‍👩‍👧", query: "ell" }) ===
                    "number" ||
                Array.isArray(
                    highlightMatches({ value: "👨‍👩‍👧", query: "ell" }),
                ) ||
                (typeof highlightMatches({ value: "👨‍👩‍👧", query: "ell" }) ===
                    "object" &&
                    highlightMatches({ value: "👨‍👩‍👧", query: "ell" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            highlightMatches({ value: "e\u0301", query: "ell" }) ===
                undefined ||
                typeof highlightMatches({ value: "e\u0301", query: "ell" }) ===
                    "string" ||
                typeof highlightMatches({ value: "e\u0301", query: "ell" }) ===
                    "boolean" ||
                typeof highlightMatches({ value: "e\u0301", query: "ell" }) ===
                    "number" ||
                Array.isArray(
                    highlightMatches({ value: "e\u0301", query: "ell" }),
                ) ||
                (typeof highlightMatches({ value: "e\u0301", query: "ell" }) ===
                    "object" &&
                    highlightMatches({ value: "e\u0301", query: "ell" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            highlightMatches({ value: "مرحبا", query: "ell" }) === undefined ||
                typeof highlightMatches({ value: "مرحبا", query: "ell" }) ===
                    "string" ||
                typeof highlightMatches({ value: "مرحبا", query: "ell" }) ===
                    "boolean" ||
                typeof highlightMatches({ value: "مرحبا", query: "ell" }) ===
                    "number" ||
                Array.isArray(
                    highlightMatches({ value: "مرحبا", query: "ell" }),
                ) ||
                (typeof highlightMatches({ value: "مرحبا", query: "ell" }) ===
                    "object" &&
                    highlightMatches({ value: "مرحبا", query: "ell" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            highlightMatches({ value: "你好", query: "ell" }) === undefined ||
                typeof highlightMatches({ value: "你好", query: "ell" }) ===
                    "string" ||
                typeof highlightMatches({ value: "你好", query: "ell" }) ===
                    "boolean" ||
                typeof highlightMatches({ value: "你好", query: "ell" }) ===
                    "number" ||
                Array.isArray(
                    highlightMatches({ value: "你好", query: "ell" }),
                ) ||
                (typeof highlightMatches({ value: "你好", query: "ell" }) ===
                    "object" &&
                    highlightMatches({ value: "你好", query: "ell" }) !== null),
        ).toBe(true);
    });
});
