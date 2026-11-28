import { describe, expect, it } from "vitest";
import { toCamelCase } from "./to-camel-case.js";

describe("toCamelCase", () => {
    it("converts words to camel case", () => {
        expect(toCamelCase("foo bar")).toBe("fooBar");
        expect(toCamelCase("fooBar")).toBe("fooBar");
        expect(toCamelCase("XMLHttpRequest")).toBe("xmlHttpRequest");
        expect(toCamelCase("userID")).toBe("userId");
        expect(toCamelCase("__typename")).toBe("typename");
        expect(toCamelCase("version2Beta")).toBe("version2Beta");
        expect(toCamelCase("")).toBe("");
        expect(toCamelCase(null as never)).toBeUndefined();
        expect(toCamelCase(new String("a") as never)).toBeUndefined();
    });

    it("keeps acronyms and merges digits when asked", () => {
        expect(
            toCamelCase({
                value: "userID",
                keepConsecutiveUppercase: true,
            }),
        ).toBe("userID");
        expect(
            toCamelCase({
                value: "foo-BAR",
                keepConsecutiveUppercase: true,
            }),
        ).toBe("fooBAR");
        expect(
            toCamelCase({
                value: "XMLHttpRequest",
                keepConsecutiveUppercase: true,
            }),
        ).toBe("xmlHttpRequest");
        expect(
            toCamelCase({
                value: "V1.2",
                mergeAmbiguousCharacters: true,
            }),
        ).toBe("v12");
        expect(toCamelCase({ value: "I", locale: "tr-TR" })).toBe("ı");
    });

    it("rejects a bad option", () => {
        expect(() => toCamelCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toCamelCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});
