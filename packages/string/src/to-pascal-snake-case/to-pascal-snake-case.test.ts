import { describe, expect, it } from "vitest";
import { toPascalSnakeCase } from "./to-pascal-snake-case.js";

describe("toPascalSnakeCase", () => {
    it("converts separators and camel boundaries", () => {
        expect(toPascalSnakeCase("foo bar")).toBe(toPascalSnakeCase("fooBar"));
        expect(toPascalSnakeCase("XMLHttpRequest")).toBeTypeOf("string");
        expect(toPascalSnakeCase("")).toBe("");
        expect(toPascalSnakeCase(null as never)).toBeUndefined();
    });

    it("honors consecutive uppercase and merged digits", () => {
        const plain = toPascalSnakeCase("userID");
        const kept = toPascalSnakeCase({
            value: "userID",
            keepConsecutiveUppercase: true,
        });
        expect(typeof plain).toBe("string");
        expect(typeof kept).toBe("string");
        expect(
            toPascalSnakeCase({
                value: "V1.2",
                mergeAmbiguousCharacters: true,
            }),
        ).toBeTypeOf("string");
    });

    it("rejects a bad locale", () => {
        expect(() => toPascalSnakeCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toPascalSnakeCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});
