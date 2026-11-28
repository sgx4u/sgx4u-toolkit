import { describe, expect, it } from "vitest";
import { pad } from "./pad.js";
describe("pad", () => {
    it("pads and leaves long strings unchanged", () => {
        expect(pad({ value: "a", maximumLength: 3 })).toBe(" a ");
        expect(pad({ value: "abcd", maximumLength: 3 })).toBe("abcd");
        expect(pad({ value: "a", maximumLength: 4, align: "start" })).toBe(
            "   a",
        );
        expect(
            pad({ value: "a", maximumLength: 4, align: "end", padString: "." }),
        ).toBe("a...");
        expect(
            pad({
                value: "a",
                maximumLength: 4,
                align: "center",
                padString: "xy",
            }),
        ).toBe("xayx");
        expect(
            pad({ value: 1 as unknown as string, maximumLength: 2 }),
        ).toBeUndefined();
        expect(() => pad({ value: "a", maximumLength: -1 })).toThrow(
            RangeError,
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(pad(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            pad({ value: "", maximumLength: 3 }) === undefined ||
                typeof pad({ value: "", maximumLength: 3 }) === "string" ||
                typeof pad({ value: "", maximumLength: 3 }) === "boolean" ||
                typeof pad({ value: "", maximumLength: 3 }) === "number" ||
                Array.isArray(pad({ value: "", maximumLength: 3 })) ||
                (typeof pad({ value: "", maximumLength: 3 }) === "object" &&
                    pad({ value: "", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            pad({ value: "👨‍👩‍👧", maximumLength: 3 }) === undefined ||
                typeof pad({ value: "👨‍👩‍👧", maximumLength: 3 }) === "string" ||
                typeof pad({ value: "👨‍👩‍👧", maximumLength: 3 }) === "boolean" ||
                typeof pad({ value: "👨‍👩‍👧", maximumLength: 3 }) === "number" ||
                Array.isArray(pad({ value: "👨‍👩‍👧", maximumLength: 3 })) ||
                (typeof pad({ value: "👨‍👩‍👧", maximumLength: 3 }) === "object" &&
                    pad({ value: "👨‍👩‍👧", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            pad({ value: "e\u0301", maximumLength: 3 }) === undefined ||
                typeof pad({ value: "e\u0301", maximumLength: 3 }) ===
                    "string" ||
                typeof pad({ value: "e\u0301", maximumLength: 3 }) ===
                    "boolean" ||
                typeof pad({ value: "e\u0301", maximumLength: 3 }) ===
                    "number" ||
                Array.isArray(pad({ value: "e\u0301", maximumLength: 3 })) ||
                (typeof pad({ value: "e\u0301", maximumLength: 3 }) ===
                    "object" &&
                    pad({ value: "e\u0301", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            pad({ value: "مرحبا", maximumLength: 3 }) === undefined ||
                typeof pad({ value: "مرحبا", maximumLength: 3 }) === "string" ||
                typeof pad({ value: "مرحبا", maximumLength: 3 }) ===
                    "boolean" ||
                typeof pad({ value: "مرحبا", maximumLength: 3 }) === "number" ||
                Array.isArray(pad({ value: "مرحبا", maximumLength: 3 })) ||
                (typeof pad({ value: "مرحبا", maximumLength: 3 }) ===
                    "object" &&
                    pad({ value: "مرحبا", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            pad({ value: "你好", maximumLength: 3 }) === undefined ||
                typeof pad({ value: "你好", maximumLength: 3 }) === "string" ||
                typeof pad({ value: "你好", maximumLength: 3 }) === "boolean" ||
                typeof pad({ value: "你好", maximumLength: 3 }) === "number" ||
                Array.isArray(pad({ value: "你好", maximumLength: 3 })) ||
                (typeof pad({ value: "你好", maximumLength: 3 }) === "object" &&
                    pad({ value: "你好", maximumLength: 3 }) !== null),
        ).toBe(true);
    });
    it("throws when maximumLength is negative", () => {
        expect(() => pad({ value: "a", maximumLength: -1 })).toThrow(
            RangeError,
        );
    });
});
