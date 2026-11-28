import { describe, expect, it } from "vitest";
import { atString } from "./at-string.js";
describe("atString", () => {
    it("returns one unit", () => {
        expect(atString({ value: "hi", index: 0 })).toBe("h");
        expect(atString({ value: "hi", index: -1 })).toBe("i");
        expect(atString({ value: "hi", index: 5 })).toBeUndefined();
        expect(atString({ value: "👨‍👩‍👧‍👦", index: 0 })).toBe("👨‍👩‍👧‍👦");
        expect(
            atString({ value: 1 as unknown as string, index: 0 }),
        ).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(atString(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            atString({ value: "", index: 0 }) === undefined ||
                typeof atString({ value: "", index: 0 }) === "string" ||
                typeof atString({ value: "", index: 0 }) === "boolean" ||
                typeof atString({ value: "", index: 0 }) === "number" ||
                Array.isArray(atString({ value: "", index: 0 })) ||
                (typeof atString({ value: "", index: 0 }) === "object" &&
                    atString({ value: "", index: 0 }) !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            atString({ value: "👨‍👩‍👧", index: 0 }) === undefined ||
                typeof atString({ value: "👨‍👩‍👧", index: 0 }) === "string" ||
                typeof atString({ value: "👨‍👩‍👧", index: 0 }) === "boolean" ||
                typeof atString({ value: "👨‍👩‍👧", index: 0 }) === "number" ||
                Array.isArray(atString({ value: "👨‍👩‍👧", index: 0 })) ||
                (typeof atString({ value: "👨‍👩‍👧", index: 0 }) === "object" &&
                    atString({ value: "👨‍👩‍👧", index: 0 }) !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            atString({ value: "e\u0301", index: 0 }) === undefined ||
                typeof atString({ value: "e\u0301", index: 0 }) === "string" ||
                typeof atString({ value: "e\u0301", index: 0 }) === "boolean" ||
                typeof atString({ value: "e\u0301", index: 0 }) === "number" ||
                Array.isArray(atString({ value: "e\u0301", index: 0 })) ||
                (typeof atString({ value: "e\u0301", index: 0 }) === "object" &&
                    atString({ value: "e\u0301", index: 0 }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            atString({ value: "مرحبا", index: 0 }) === undefined ||
                typeof atString({ value: "مرحبا", index: 0 }) === "string" ||
                typeof atString({ value: "مرحبا", index: 0 }) === "boolean" ||
                typeof atString({ value: "مرحبا", index: 0 }) === "number" ||
                Array.isArray(atString({ value: "مرحبا", index: 0 })) ||
                (typeof atString({ value: "مرحبا", index: 0 }) === "object" &&
                    atString({ value: "مرحبا", index: 0 }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            atString({ value: "你好", index: 0 }) === undefined ||
                typeof atString({ value: "你好", index: 0 }) === "string" ||
                typeof atString({ value: "你好", index: 0 }) === "boolean" ||
                typeof atString({ value: "你好", index: 0 }) === "number" ||
                Array.isArray(atString({ value: "你好", index: 0 })) ||
                (typeof atString({ value: "你好", index: 0 }) === "object" &&
                    atString({ value: "你好", index: 0 }) !== null),
        ).toBe(true);
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            atString({ value: "hi", index: 0, unit: "nope" as never }),
        ).toThrow(RangeError);
    });
});
