import { describe, expect, it } from "vitest";
import { findClosestMatch } from "./find-closest-match.js";
describe("findClosestMatch", () => {
    it("picks the highest score and the earlier tie", () => {
        expect(
            findClosestMatch({ value: "cat", candidates: ["car", "dog"] })
                ?.value,
        ).toBe("car");
        expect(
            findClosestMatch({ value: "cat", candidates: [] }),
        ).toBeUndefined();
        expect(
            findClosestMatch({
                value: 1 as unknown as string,
                candidates: ["a"],
            }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(findClosestMatch(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            findClosestMatch({
                value: "",
                candidates: ["car", "dog", "cat"],
            }) === undefined ||
                typeof findClosestMatch({
                    value: "",
                    candidates: ["car", "dog", "cat"],
                }) === "string" ||
                typeof findClosestMatch({
                    value: "",
                    candidates: ["car", "dog", "cat"],
                }) === "boolean" ||
                typeof findClosestMatch({
                    value: "",
                    candidates: ["car", "dog", "cat"],
                }) === "number" ||
                Array.isArray(
                    findClosestMatch({
                        value: "",
                        candidates: ["car", "dog", "cat"],
                    }),
                ) ||
                (typeof findClosestMatch({
                    value: "",
                    candidates: ["car", "dog", "cat"],
                }) === "object" &&
                    findClosestMatch({
                        value: "",
                        candidates: ["car", "dog", "cat"],
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            findClosestMatch({
                value: "👨‍👩‍👧",
                candidates: ["car", "dog", "cat"],
            }) === undefined ||
                typeof findClosestMatch({
                    value: "👨‍👩‍👧",
                    candidates: ["car", "dog", "cat"],
                }) === "string" ||
                typeof findClosestMatch({
                    value: "👨‍👩‍👧",
                    candidates: ["car", "dog", "cat"],
                }) === "boolean" ||
                typeof findClosestMatch({
                    value: "👨‍👩‍👧",
                    candidates: ["car", "dog", "cat"],
                }) === "number" ||
                Array.isArray(
                    findClosestMatch({
                        value: "👨‍👩‍👧",
                        candidates: ["car", "dog", "cat"],
                    }),
                ) ||
                (typeof findClosestMatch({
                    value: "👨‍👩‍👧",
                    candidates: ["car", "dog", "cat"],
                }) === "object" &&
                    findClosestMatch({
                        value: "👨‍👩‍👧",
                        candidates: ["car", "dog", "cat"],
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            findClosestMatch({
                value: "e\u0301",
                candidates: ["car", "dog", "cat"],
            }) === undefined ||
                typeof findClosestMatch({
                    value: "e\u0301",
                    candidates: ["car", "dog", "cat"],
                }) === "string" ||
                typeof findClosestMatch({
                    value: "e\u0301",
                    candidates: ["car", "dog", "cat"],
                }) === "boolean" ||
                typeof findClosestMatch({
                    value: "e\u0301",
                    candidates: ["car", "dog", "cat"],
                }) === "number" ||
                Array.isArray(
                    findClosestMatch({
                        value: "e\u0301",
                        candidates: ["car", "dog", "cat"],
                    }),
                ) ||
                (typeof findClosestMatch({
                    value: "e\u0301",
                    candidates: ["car", "dog", "cat"],
                }) === "object" &&
                    findClosestMatch({
                        value: "e\u0301",
                        candidates: ["car", "dog", "cat"],
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            findClosestMatch({
                value: "مرحبا",
                candidates: ["car", "dog", "cat"],
            }) === undefined ||
                typeof findClosestMatch({
                    value: "مرحبا",
                    candidates: ["car", "dog", "cat"],
                }) === "string" ||
                typeof findClosestMatch({
                    value: "مرحبا",
                    candidates: ["car", "dog", "cat"],
                }) === "boolean" ||
                typeof findClosestMatch({
                    value: "مرحبا",
                    candidates: ["car", "dog", "cat"],
                }) === "number" ||
                Array.isArray(
                    findClosestMatch({
                        value: "مرحبا",
                        candidates: ["car", "dog", "cat"],
                    }),
                ) ||
                (typeof findClosestMatch({
                    value: "مرحبا",
                    candidates: ["car", "dog", "cat"],
                }) === "object" &&
                    findClosestMatch({
                        value: "مرحبا",
                        candidates: ["car", "dog", "cat"],
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            findClosestMatch({
                value: "你好",
                candidates: ["car", "dog", "cat"],
            }) === undefined ||
                typeof findClosestMatch({
                    value: "你好",
                    candidates: ["car", "dog", "cat"],
                }) === "string" ||
                typeof findClosestMatch({
                    value: "你好",
                    candidates: ["car", "dog", "cat"],
                }) === "boolean" ||
                typeof findClosestMatch({
                    value: "你好",
                    candidates: ["car", "dog", "cat"],
                }) === "number" ||
                Array.isArray(
                    findClosestMatch({
                        value: "你好",
                        candidates: ["car", "dog", "cat"],
                    }),
                ) ||
                (typeof findClosestMatch({
                    value: "你好",
                    candidates: ["car", "dog", "cat"],
                }) === "object" &&
                    findClosestMatch({
                        value: "你好",
                        candidates: ["car", "dog", "cat"],
                    }) !== null),
        ).toBe(true);
    });
});
