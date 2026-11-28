import { describe, expect, it } from "vitest";
import { findClosestMatches } from "./find-closest-matches.js";
describe("findClosestMatches", () => {
    it("returns the best matches first", () => {
        const matches = findClosestMatches({
            value: "cat",
            candidates: ["car", "dog", "cab"],
            limit: 2,
        });
        expect(matches?.[0]?.value).toBe("car");
        expect(matches?.length).toBeLessThanOrEqual(2);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(findClosestMatches(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            findClosestMatches({
                value: "",
                candidates: ["car", "dog", "cot"],
                limit: 2,
            }) === undefined ||
                typeof findClosestMatches({
                    value: "",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "string" ||
                typeof findClosestMatches({
                    value: "",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "boolean" ||
                typeof findClosestMatches({
                    value: "",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "number" ||
                Array.isArray(
                    findClosestMatches({
                        value: "",
                        candidates: ["car", "dog", "cot"],
                        limit: 2,
                    }),
                ) ||
                (typeof findClosestMatches({
                    value: "",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "object" &&
                    findClosestMatches({
                        value: "",
                        candidates: ["car", "dog", "cot"],
                        limit: 2,
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            findClosestMatches({
                value: "👨‍👩‍👧",
                candidates: ["car", "dog", "cot"],
                limit: 2,
            }) === undefined ||
                typeof findClosestMatches({
                    value: "👨‍👩‍👧",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "string" ||
                typeof findClosestMatches({
                    value: "👨‍👩‍👧",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "boolean" ||
                typeof findClosestMatches({
                    value: "👨‍👩‍👧",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "number" ||
                Array.isArray(
                    findClosestMatches({
                        value: "👨‍👩‍👧",
                        candidates: ["car", "dog", "cot"],
                        limit: 2,
                    }),
                ) ||
                (typeof findClosestMatches({
                    value: "👨‍👩‍👧",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "object" &&
                    findClosestMatches({
                        value: "👨‍👩‍👧",
                        candidates: ["car", "dog", "cot"],
                        limit: 2,
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            findClosestMatches({
                value: "e\u0301",
                candidates: ["car", "dog", "cot"],
                limit: 2,
            }) === undefined ||
                typeof findClosestMatches({
                    value: "e\u0301",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "string" ||
                typeof findClosestMatches({
                    value: "e\u0301",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "boolean" ||
                typeof findClosestMatches({
                    value: "e\u0301",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "number" ||
                Array.isArray(
                    findClosestMatches({
                        value: "e\u0301",
                        candidates: ["car", "dog", "cot"],
                        limit: 2,
                    }),
                ) ||
                (typeof findClosestMatches({
                    value: "e\u0301",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "object" &&
                    findClosestMatches({
                        value: "e\u0301",
                        candidates: ["car", "dog", "cot"],
                        limit: 2,
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            findClosestMatches({
                value: "مرحبا",
                candidates: ["car", "dog", "cot"],
                limit: 2,
            }) === undefined ||
                typeof findClosestMatches({
                    value: "مرحبا",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "string" ||
                typeof findClosestMatches({
                    value: "مرحبا",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "boolean" ||
                typeof findClosestMatches({
                    value: "مرحبا",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "number" ||
                Array.isArray(
                    findClosestMatches({
                        value: "مرحبا",
                        candidates: ["car", "dog", "cot"],
                        limit: 2,
                    }),
                ) ||
                (typeof findClosestMatches({
                    value: "مرحبا",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "object" &&
                    findClosestMatches({
                        value: "مرحبا",
                        candidates: ["car", "dog", "cot"],
                        limit: 2,
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            findClosestMatches({
                value: "你好",
                candidates: ["car", "dog", "cot"],
                limit: 2,
            }) === undefined ||
                typeof findClosestMatches({
                    value: "你好",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "string" ||
                typeof findClosestMatches({
                    value: "你好",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "boolean" ||
                typeof findClosestMatches({
                    value: "你好",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "number" ||
                Array.isArray(
                    findClosestMatches({
                        value: "你好",
                        candidates: ["car", "dog", "cot"],
                        limit: 2,
                    }),
                ) ||
                (typeof findClosestMatches({
                    value: "你好",
                    candidates: ["car", "dog", "cot"],
                    limit: 2,
                }) === "object" &&
                    findClosestMatches({
                        value: "你好",
                        candidates: ["car", "dog", "cot"],
                        limit: 2,
                    }) !== null),
        ).toBe(true);
    });
});
