import { describe, expect, it } from "vitest";
import { maskString } from "./mask-string.js";
describe("maskString", () => {
    it("masks the middle", () => {
        expect(
            maskString({
                value: "secret",
                unmaskedStartLength: 1,
                unmaskedEndLength: 1,
            }),
        ).toBe("s****t");
        expect(
            maskString({
                value: "ab",
                unmaskedStartLength: 1,
                unmaskedEndLength: 1,
            }),
        ).toBe("ab");
        expect(maskString("")).toBe("");
        expect(() => maskString({ value: "a", maskCharacter: "" })).toThrow(
            RangeError,
        );
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(maskString(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            typeof maskString({
                value: "",
                unmaskedStartLength: 1,
                unmaskedEndLength: 1,
            }),
        ).toBe("string");
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            typeof maskString({
                value: "👨‍👩‍👧",
                unmaskedStartLength: 1,
                unmaskedEndLength: 1,
            }),
        ).toBe("string");
    });
    it("accepts a combining mark", () => {
        expect(
            typeof maskString({
                value: "e\u0301",
                unmaskedStartLength: 1,
                unmaskedEndLength: 1,
            }),
        ).toBe("string");
    });
    it("accepts Arabic text", () => {
        expect(
            typeof maskString({
                value: "مرحبا",
                unmaskedStartLength: 1,
                unmaskedEndLength: 1,
            }),
        ).toBe("string");
    });
    it("accepts CJK text", () => {
        expect(
            typeof maskString({
                value: "你好",
                unmaskedStartLength: 1,
                unmaskedEndLength: 1,
            }),
        ).toBe("string");
    });
    it("throws when unit is unknown", () => {
        expect(() =>
            maskString({
                value: "secret",
                unmaskedStartLength: 1,
                unmaskedEndLength: 1,
                unit: "nope" as never,
            }),
        ).toThrow(RangeError);
    });
});
