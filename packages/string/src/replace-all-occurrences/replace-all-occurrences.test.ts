import { describe, expect, it } from "vitest";
import { replaceAllOccurrences } from "./replace-all-occurrences.js";
describe("replaceAllOccurrences", () => {
    it("replaces literally and restores lastIndex", () => {
        expect(
            replaceAllOccurrences({
                value: "a-a",
                pattern: "-",
                replacement: "_",
            }),
        ).toBe("a_a");
        expect(
            replaceAllOccurrences({
                value: "a$b",
                pattern: "$",
                replacement: "x",
            }),
        ).toBe("axb");
        expect(
            replaceAllOccurrences({
                value: "ab",
                pattern: "",
                replacement: "x",
            }),
        ).toBe("ab");
        expect(
            replaceAllOccurrences({
                value: "a",
                pattern: "a",
                replacement: "$&",
            }),
        ).toBe("$&");
        const expression = /a/g;
        expression.lastIndex = 1;
        expect(
            replaceAllOccurrences({
                value: "aba",
                pattern: expression,
                replacement: "c",
            }),
        ).toBe("cbc");
        expect(expression.lastIndex).toBe(1);
        expect(
            replaceAllOccurrences({
                value: 1 as unknown as string,
                pattern: "a",
                replacement: "b",
            }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(replaceAllOccurrences(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            replaceAllOccurrences({
                value: "",
                pattern: "-",
                replacement: "_",
            }) === undefined ||
                typeof replaceAllOccurrences({
                    value: "",
                    pattern: "-",
                    replacement: "_",
                }) === "string" ||
                typeof replaceAllOccurrences({
                    value: "",
                    pattern: "-",
                    replacement: "_",
                }) === "boolean" ||
                typeof replaceAllOccurrences({
                    value: "",
                    pattern: "-",
                    replacement: "_",
                }) === "number" ||
                Array.isArray(
                    replaceAllOccurrences({
                        value: "",
                        pattern: "-",
                        replacement: "_",
                    }),
                ) ||
                (typeof replaceAllOccurrences({
                    value: "",
                    pattern: "-",
                    replacement: "_",
                }) === "object" &&
                    replaceAllOccurrences({
                        value: "",
                        pattern: "-",
                        replacement: "_",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            replaceAllOccurrences({
                value: "👨‍👩‍👧",
                pattern: "-",
                replacement: "_",
            }) === undefined ||
                typeof replaceAllOccurrences({
                    value: "👨‍👩‍👧",
                    pattern: "-",
                    replacement: "_",
                }) === "string" ||
                typeof replaceAllOccurrences({
                    value: "👨‍👩‍👧",
                    pattern: "-",
                    replacement: "_",
                }) === "boolean" ||
                typeof replaceAllOccurrences({
                    value: "👨‍👩‍👧",
                    pattern: "-",
                    replacement: "_",
                }) === "number" ||
                Array.isArray(
                    replaceAllOccurrences({
                        value: "👨‍👩‍👧",
                        pattern: "-",
                        replacement: "_",
                    }),
                ) ||
                (typeof replaceAllOccurrences({
                    value: "👨‍👩‍👧",
                    pattern: "-",
                    replacement: "_",
                }) === "object" &&
                    replaceAllOccurrences({
                        value: "👨‍👩‍👧",
                        pattern: "-",
                        replacement: "_",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            replaceAllOccurrences({
                value: "e\u0301",
                pattern: "-",
                replacement: "_",
            }) === undefined ||
                typeof replaceAllOccurrences({
                    value: "e\u0301",
                    pattern: "-",
                    replacement: "_",
                }) === "string" ||
                typeof replaceAllOccurrences({
                    value: "e\u0301",
                    pattern: "-",
                    replacement: "_",
                }) === "boolean" ||
                typeof replaceAllOccurrences({
                    value: "e\u0301",
                    pattern: "-",
                    replacement: "_",
                }) === "number" ||
                Array.isArray(
                    replaceAllOccurrences({
                        value: "e\u0301",
                        pattern: "-",
                        replacement: "_",
                    }),
                ) ||
                (typeof replaceAllOccurrences({
                    value: "e\u0301",
                    pattern: "-",
                    replacement: "_",
                }) === "object" &&
                    replaceAllOccurrences({
                        value: "e\u0301",
                        pattern: "-",
                        replacement: "_",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            replaceAllOccurrences({
                value: "مرحبا",
                pattern: "-",
                replacement: "_",
            }) === undefined ||
                typeof replaceAllOccurrences({
                    value: "مرحبا",
                    pattern: "-",
                    replacement: "_",
                }) === "string" ||
                typeof replaceAllOccurrences({
                    value: "مرحبا",
                    pattern: "-",
                    replacement: "_",
                }) === "boolean" ||
                typeof replaceAllOccurrences({
                    value: "مرحبا",
                    pattern: "-",
                    replacement: "_",
                }) === "number" ||
                Array.isArray(
                    replaceAllOccurrences({
                        value: "مرحبا",
                        pattern: "-",
                        replacement: "_",
                    }),
                ) ||
                (typeof replaceAllOccurrences({
                    value: "مرحبا",
                    pattern: "-",
                    replacement: "_",
                }) === "object" &&
                    replaceAllOccurrences({
                        value: "مرحبا",
                        pattern: "-",
                        replacement: "_",
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            replaceAllOccurrences({
                value: "你好",
                pattern: "-",
                replacement: "_",
            }) === undefined ||
                typeof replaceAllOccurrences({
                    value: "你好",
                    pattern: "-",
                    replacement: "_",
                }) === "string" ||
                typeof replaceAllOccurrences({
                    value: "你好",
                    pattern: "-",
                    replacement: "_",
                }) === "boolean" ||
                typeof replaceAllOccurrences({
                    value: "你好",
                    pattern: "-",
                    replacement: "_",
                }) === "number" ||
                Array.isArray(
                    replaceAllOccurrences({
                        value: "你好",
                        pattern: "-",
                        replacement: "_",
                    }),
                ) ||
                (typeof replaceAllOccurrences({
                    value: "你好",
                    pattern: "-",
                    replacement: "_",
                }) === "object" &&
                    replaceAllOccurrences({
                        value: "你好",
                        pattern: "-",
                        replacement: "_",
                    }) !== null),
        ).toBe(true);
    });
});
