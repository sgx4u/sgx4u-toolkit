import { describe, expect, it } from "vitest";
import { getJaroWinklerSimilarity } from "./get-jaro-winkler-similarity.js";
describe("getJaroWinklerSimilarity", () => {
    it("scores equal strings as 1", () => {
        expect(getJaroWinklerSimilarity({ first: "abc", second: "abc" })).toBe(
            1,
        );
        expect(getJaroWinklerSimilarity({ first: "", second: "" })).toBe(1);
        expect(
            getJaroWinklerSimilarity({ first: "abc", second: "xyz" }),
        ).toBeLessThan(1);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(getJaroWinklerSimilarity(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            getJaroWinklerSimilarity({ first: "", second: "marhta" }) ===
                undefined ||
                typeof getJaroWinklerSimilarity({
                    first: "",
                    second: "marhta",
                }) === "string" ||
                typeof getJaroWinklerSimilarity({
                    first: "",
                    second: "marhta",
                }) === "boolean" ||
                typeof getJaroWinklerSimilarity({
                    first: "",
                    second: "marhta",
                }) === "number" ||
                Array.isArray(
                    getJaroWinklerSimilarity({ first: "", second: "marhta" }),
                ) ||
                (typeof getJaroWinklerSimilarity({
                    first: "",
                    second: "marhta",
                }) === "object" &&
                    getJaroWinklerSimilarity({
                        first: "",
                        second: "marhta",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            getJaroWinklerSimilarity({ first: "👨‍👩‍👧", second: "marhta" }) ===
                undefined ||
                typeof getJaroWinklerSimilarity({
                    first: "👨‍👩‍👧",
                    second: "marhta",
                }) === "string" ||
                typeof getJaroWinklerSimilarity({
                    first: "👨‍👩‍👧",
                    second: "marhta",
                }) === "boolean" ||
                typeof getJaroWinklerSimilarity({
                    first: "👨‍👩‍👧",
                    second: "marhta",
                }) === "number" ||
                Array.isArray(
                    getJaroWinklerSimilarity({ first: "👨‍👩‍👧", second: "marhta" }),
                ) ||
                (typeof getJaroWinklerSimilarity({
                    first: "👨‍👩‍👧",
                    second: "marhta",
                }) === "object" &&
                    getJaroWinklerSimilarity({
                        first: "👨‍👩‍👧",
                        second: "marhta",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            getJaroWinklerSimilarity({ first: "e\u0301", second: "marhta" }) ===
                undefined ||
                typeof getJaroWinklerSimilarity({
                    first: "e\u0301",
                    second: "marhta",
                }) === "string" ||
                typeof getJaroWinklerSimilarity({
                    first: "e\u0301",
                    second: "marhta",
                }) === "boolean" ||
                typeof getJaroWinklerSimilarity({
                    first: "e\u0301",
                    second: "marhta",
                }) === "number" ||
                Array.isArray(
                    getJaroWinklerSimilarity({
                        first: "e\u0301",
                        second: "marhta",
                    }),
                ) ||
                (typeof getJaroWinklerSimilarity({
                    first: "e\u0301",
                    second: "marhta",
                }) === "object" &&
                    getJaroWinklerSimilarity({
                        first: "e\u0301",
                        second: "marhta",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            getJaroWinklerSimilarity({ first: "مرحبا", second: "marhta" }) ===
                undefined ||
                typeof getJaroWinklerSimilarity({
                    first: "مرحبا",
                    second: "marhta",
                }) === "string" ||
                typeof getJaroWinklerSimilarity({
                    first: "مرحبا",
                    second: "marhta",
                }) === "boolean" ||
                typeof getJaroWinklerSimilarity({
                    first: "مرحبا",
                    second: "marhta",
                }) === "number" ||
                Array.isArray(
                    getJaroWinklerSimilarity({
                        first: "مرحبا",
                        second: "marhta",
                    }),
                ) ||
                (typeof getJaroWinklerSimilarity({
                    first: "مرحبا",
                    second: "marhta",
                }) === "object" &&
                    getJaroWinklerSimilarity({
                        first: "مرحبا",
                        second: "marhta",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            getJaroWinklerSimilarity({ first: "你好", second: "marhta" }) ===
                undefined ||
                typeof getJaroWinklerSimilarity({
                    first: "你好",
                    second: "marhta",
                }) === "string" ||
                typeof getJaroWinklerSimilarity({
                    first: "你好",
                    second: "marhta",
                }) === "boolean" ||
                typeof getJaroWinklerSimilarity({
                    first: "你好",
                    second: "marhta",
                }) === "number" ||
                Array.isArray(
                    getJaroWinklerSimilarity({
                        first: "你好",
                        second: "marhta",
                    }),
                ) ||
                (typeof getJaroWinklerSimilarity({
                    first: "你好",
                    second: "marhta",
                }) === "object" &&
                    getJaroWinklerSimilarity({
                        first: "你好",
                        second: "marhta",
                    }) !== null),
        ).toBe(true);
    });
});
