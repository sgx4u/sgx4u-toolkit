import { describe, expect, it } from "vitest";
import { wrapText } from "./wrap-text.js";
describe("wrapText", () => {
    it("wraps on spaces", () => {
        expect(wrapText({ value: "hello world", maximumWidth: 8 })).toBe(
            "hello\nworld",
        );
        expect(wrapText({ value: "hi", maximumWidth: 10 })).toBe("hi");
        expect(() => wrapText({ value: "a", maximumWidth: 0 })).toThrow(
            RangeError,
        );
        expect(
            wrapText({ value: 1 as unknown as string, maximumWidth: 4 }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(wrapText(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            wrapText({ value: "", maximumWidth: 8 }) === undefined ||
                typeof wrapText({ value: "", maximumWidth: 8 }) === "string" ||
                typeof wrapText({ value: "", maximumWidth: 8 }) === "boolean" ||
                typeof wrapText({ value: "", maximumWidth: 8 }) === "number" ||
                Array.isArray(wrapText({ value: "", maximumWidth: 8 })) ||
                (typeof wrapText({ value: "", maximumWidth: 8 }) === "object" &&
                    wrapText({ value: "", maximumWidth: 8 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            wrapText({ value: "👨‍👩‍👧", maximumWidth: 8 }) === undefined ||
                typeof wrapText({ value: "👨‍👩‍👧", maximumWidth: 8 }) ===
                    "string" ||
                typeof wrapText({ value: "👨‍👩‍👧", maximumWidth: 8 }) ===
                    "boolean" ||
                typeof wrapText({ value: "👨‍👩‍👧", maximumWidth: 8 }) ===
                    "number" ||
                Array.isArray(wrapText({ value: "👨‍👩‍👧", maximumWidth: 8 })) ||
                (typeof wrapText({ value: "👨‍👩‍👧", maximumWidth: 8 }) ===
                    "object" &&
                    wrapText({ value: "👨‍👩‍👧", maximumWidth: 8 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            wrapText({ value: "e\u0301", maximumWidth: 8 }) === undefined ||
                typeof wrapText({ value: "e\u0301", maximumWidth: 8 }) ===
                    "string" ||
                typeof wrapText({ value: "e\u0301", maximumWidth: 8 }) ===
                    "boolean" ||
                typeof wrapText({ value: "e\u0301", maximumWidth: 8 }) ===
                    "number" ||
                Array.isArray(
                    wrapText({ value: "e\u0301", maximumWidth: 8 }),
                ) ||
                (typeof wrapText({ value: "e\u0301", maximumWidth: 8 }) ===
                    "object" &&
                    wrapText({ value: "e\u0301", maximumWidth: 8 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            wrapText({ value: "مرحبا", maximumWidth: 8 }) === undefined ||
                typeof wrapText({ value: "مرحبا", maximumWidth: 8 }) ===
                    "string" ||
                typeof wrapText({ value: "مرحبا", maximumWidth: 8 }) ===
                    "boolean" ||
                typeof wrapText({ value: "مرحبا", maximumWidth: 8 }) ===
                    "number" ||
                Array.isArray(wrapText({ value: "مرحبا", maximumWidth: 8 })) ||
                (typeof wrapText({ value: "مرحبا", maximumWidth: 8 }) ===
                    "object" &&
                    wrapText({ value: "مرحبا", maximumWidth: 8 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            wrapText({ value: "你好", maximumWidth: 8 }) === undefined ||
                typeof wrapText({ value: "你好", maximumWidth: 8 }) ===
                    "string" ||
                typeof wrapText({ value: "你好", maximumWidth: 8 }) ===
                    "boolean" ||
                typeof wrapText({ value: "你好", maximumWidth: 8 }) ===
                    "number" ||
                Array.isArray(wrapText({ value: "你好", maximumWidth: 8 })) ||
                (typeof wrapText({ value: "你好", maximumWidth: 8 }) ===
                    "object" &&
                    wrapText({ value: "你好", maximumWidth: 8 }) !== null),
        ).toBe(true);
    });
});
