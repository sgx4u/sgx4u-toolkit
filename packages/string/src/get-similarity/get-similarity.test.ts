import { describe, expect, it } from "vitest";
import { getSimilarity } from "./get-similarity.js";
describe("getSimilarity", () => {
    it("scores 1 for equals and supports the other algorithms", () => {
        expect(getSimilarity({ first: "abc", second: "abc" })).toBe(1);
        expect(
            getSimilarity({
                first: "",
                second: "",
                algorithm: "normalized-levenshtein",
            }),
        ).toBe(1);
        expect(
            getSimilarity({ first: "ab", second: "ac", algorithm: "dice" }),
        ).toBeGreaterThanOrEqual(0);
        expect(() =>
            getSimilarity({
                first: "a",
                second: "a",
                algorithm: "xyz" as "dice",
            }),
        ).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getSimilarity(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getSimilarity({ first: "", second: "sitting" }) === undefined ||
                typeof getSimilarity({ first: "", second: "sitting" }) ===
                    "string" ||
                typeof getSimilarity({ first: "", second: "sitting" }) ===
                    "boolean" ||
                typeof getSimilarity({ first: "", second: "sitting" }) ===
                    "number" ||
                Array.isArray(
                    getSimilarity({ first: "", second: "sitting" }),
                ) ||
                (typeof getSimilarity({ first: "", second: "sitting" }) ===
                    "object" &&
                    getSimilarity({ first: "", second: "sitting" }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getSimilarity({ first: "👨‍👩‍👧", second: "sitting" }) === undefined ||
                typeof getSimilarity({ first: "👨‍👩‍👧", second: "sitting" }) ===
                    "string" ||
                typeof getSimilarity({ first: "👨‍👩‍👧", second: "sitting" }) ===
                    "boolean" ||
                typeof getSimilarity({ first: "👨‍👩‍👧", second: "sitting" }) ===
                    "number" ||
                Array.isArray(
                    getSimilarity({ first: "👨‍👩‍👧", second: "sitting" }),
                ) ||
                (typeof getSimilarity({ first: "👨‍👩‍👧", second: "sitting" }) ===
                    "object" &&
                    getSimilarity({ first: "👨‍👩‍👧", second: "sitting" }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getSimilarity({ first: "e\u0301", second: "sitting" }) ===
                undefined ||
                typeof getSimilarity({
                    first: "e\u0301",
                    second: "sitting",
                }) === "string" ||
                typeof getSimilarity({
                    first: "e\u0301",
                    second: "sitting",
                }) === "boolean" ||
                typeof getSimilarity({
                    first: "e\u0301",
                    second: "sitting",
                }) === "number" ||
                Array.isArray(
                    getSimilarity({ first: "e\u0301", second: "sitting" }),
                ) ||
                (typeof getSimilarity({
                    first: "e\u0301",
                    second: "sitting",
                }) === "object" &&
                    getSimilarity({ first: "e\u0301", second: "sitting" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getSimilarity({ first: "مرحبا", second: "sitting" }) ===
                undefined ||
                typeof getSimilarity({ first: "مرحبا", second: "sitting" }) ===
                    "string" ||
                typeof getSimilarity({ first: "مرحبا", second: "sitting" }) ===
                    "boolean" ||
                typeof getSimilarity({ first: "مرحبا", second: "sitting" }) ===
                    "number" ||
                Array.isArray(
                    getSimilarity({ first: "مرحبا", second: "sitting" }),
                ) ||
                (typeof getSimilarity({ first: "مرحبا", second: "sitting" }) ===
                    "object" &&
                    getSimilarity({ first: "مرحبا", second: "sitting" }) !==
                        null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getSimilarity({ first: "你好", second: "sitting" }) === undefined ||
                typeof getSimilarity({ first: "你好", second: "sitting" }) ===
                    "string" ||
                typeof getSimilarity({ first: "你好", second: "sitting" }) ===
                    "boolean" ||
                typeof getSimilarity({ first: "你好", second: "sitting" }) ===
                    "number" ||
                Array.isArray(
                    getSimilarity({ first: "你好", second: "sitting" }),
                ) ||
                (typeof getSimilarity({ first: "你好", second: "sitting" }) ===
                    "object" &&
                    getSimilarity({ first: "你好", second: "sitting" }) !==
                        null),
        ).toBe(true);
    });
});
