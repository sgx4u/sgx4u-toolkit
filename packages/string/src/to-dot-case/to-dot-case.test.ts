import { describe, expect, it } from "vitest";
import { toDotCase } from "./to-dot-case.js";

describe("toDotCase", () => {
    it("converts separators and camel boundaries", () => {
        expect(toDotCase("foo bar")).toBe(toDotCase("fooBar"));
        expect(toDotCase("XMLHttpRequest")).toBeTypeOf("string");
        expect(toDotCase("")).toBe("");
        expect(toDotCase(null as never)).toBeUndefined();
    });

    it("honors consecutive uppercase and merged digits", () => {
        const plain = toDotCase("userID");
        const kept = toDotCase({
            value: "userID",
            keepConsecutiveUppercase: true,
        });
        expect(typeof plain).toBe("string");
        expect(typeof kept).toBe("string");
        expect(
            toDotCase({ value: "V1.2", mergeAmbiguousCharacters: true }),
        ).toBeTypeOf("string");
    });

    it("rejects a bad locale", () => {
        expect(() => toDotCase({ value: "a", locale: "" })).toThrow(RangeError);
        expect(() =>
            toDotCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});
