import { describe, expect, it } from "vitest";
import { toConstantCase } from "./to-constant-case.js";

describe("toConstantCase", () => {
    it("converts separators and camel boundaries", () => {
        expect(toConstantCase("foo bar")).toBe(toConstantCase("fooBar"));
        expect(toConstantCase("XMLHttpRequest")).toBeTypeOf("string");
        expect(toConstantCase("")).toBe("");
        expect(toConstantCase(null as never)).toBeUndefined();
    });

    it("honors consecutive uppercase and merged digits", () => {
        const plain = toConstantCase("userID");
        const kept = toConstantCase({
            value: "userID",
            keepConsecutiveUppercase: true,
        });
        expect(typeof plain).toBe("string");
        expect(typeof kept).toBe("string");
        expect(
            toConstantCase({ value: "V1.2", mergeAmbiguousCharacters: true }),
        ).toBeTypeOf("string");
    });

    it("rejects a bad locale", () => {
        expect(() => toConstantCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toConstantCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});
