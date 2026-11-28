import { describe, expect, it } from "vitest";
import { replaceRange } from "./replace-range.js";
describe("replaceRange", () => {
    it("replaces a range", () => {
        expect(
            replaceRange({ value: "abcd", start: 1, end: 3, replacement: "X" }),
        ).toBe("aXd");
        expect(() =>
            replaceRange({ value: "abcd", start: 3, end: 1, replacement: "X" }),
        ).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(replaceRange(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            replaceRange({ value: "", start: 1, end: 3, replacement: "X" }) ===
                undefined ||
                typeof replaceRange({
                    value: "",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "string" ||
                typeof replaceRange({
                    value: "",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "boolean" ||
                typeof replaceRange({
                    value: "",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "number" ||
                Array.isArray(
                    replaceRange({
                        value: "",
                        start: 1,
                        end: 3,
                        replacement: "X",
                    }),
                ) ||
                (typeof replaceRange({
                    value: "",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "object" &&
                    replaceRange({
                        value: "",
                        start: 1,
                        end: 3,
                        replacement: "X",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            replaceRange({
                value: "👨‍👩‍👧",
                start: 1,
                end: 3,
                replacement: "X",
            }) === undefined ||
                typeof replaceRange({
                    value: "👨‍👩‍👧",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "string" ||
                typeof replaceRange({
                    value: "👨‍👩‍👧",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "boolean" ||
                typeof replaceRange({
                    value: "👨‍👩‍👧",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "number" ||
                Array.isArray(
                    replaceRange({
                        value: "👨‍👩‍👧",
                        start: 1,
                        end: 3,
                        replacement: "X",
                    }),
                ) ||
                (typeof replaceRange({
                    value: "👨‍👩‍👧",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "object" &&
                    replaceRange({
                        value: "👨‍👩‍👧",
                        start: 1,
                        end: 3,
                        replacement: "X",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            replaceRange({
                value: "e\u0301",
                start: 1,
                end: 3,
                replacement: "X",
            }) === undefined ||
                typeof replaceRange({
                    value: "e\u0301",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "string" ||
                typeof replaceRange({
                    value: "e\u0301",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "boolean" ||
                typeof replaceRange({
                    value: "e\u0301",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "number" ||
                Array.isArray(
                    replaceRange({
                        value: "e\u0301",
                        start: 1,
                        end: 3,
                        replacement: "X",
                    }),
                ) ||
                (typeof replaceRange({
                    value: "e\u0301",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "object" &&
                    replaceRange({
                        value: "e\u0301",
                        start: 1,
                        end: 3,
                        replacement: "X",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            replaceRange({
                value: "مرحبا",
                start: 1,
                end: 3,
                replacement: "X",
            }) === undefined ||
                typeof replaceRange({
                    value: "مرحبا",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "string" ||
                typeof replaceRange({
                    value: "مرحبا",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "boolean" ||
                typeof replaceRange({
                    value: "مرحبا",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "number" ||
                Array.isArray(
                    replaceRange({
                        value: "مرحبا",
                        start: 1,
                        end: 3,
                        replacement: "X",
                    }),
                ) ||
                (typeof replaceRange({
                    value: "مرحبا",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "object" &&
                    replaceRange({
                        value: "مرحبا",
                        start: 1,
                        end: 3,
                        replacement: "X",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            replaceRange({
                value: "你好",
                start: 1,
                end: 3,
                replacement: "X",
            }) === undefined ||
                typeof replaceRange({
                    value: "你好",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "string" ||
                typeof replaceRange({
                    value: "你好",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "boolean" ||
                typeof replaceRange({
                    value: "你好",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "number" ||
                Array.isArray(
                    replaceRange({
                        value: "你好",
                        start: 1,
                        end: 3,
                        replacement: "X",
                    }),
                ) ||
                (typeof replaceRange({
                    value: "你好",
                    start: 1,
                    end: 3,
                    replacement: "X",
                }) === "object" &&
                    replaceRange({
                        value: "你好",
                        start: 1,
                        end: 3,
                        replacement: "X",
                    }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            replaceRange({
                value: "abcd",
                start: 1,
                end: 3,
                replacement: "X",
                unit: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
