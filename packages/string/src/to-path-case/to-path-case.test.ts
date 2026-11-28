import { describe, expect, it } from "vitest";
import { toPathCase } from "./to-path-case.js";

describe("toPathCase", () => {
    it("converts separators and camel boundaries", () => {
        expect(toPathCase("foo bar")).toBe(toPathCase("fooBar"));
        expect(toPathCase("XMLHttpRequest")).toBeTypeOf("string");
        expect(toPathCase("")).toBe("");
        expect(toPathCase(null as never)).toBeUndefined();
    });

    it("honors consecutive uppercase and merged digits", () => {
        const plain = toPathCase("userID");
        const kept = toPathCase({
            value: "userID",
            keepConsecutiveUppercase: true,
        });
        expect(typeof plain).toBe("string");
        expect(typeof kept).toBe("string");
        expect(
            toPathCase({ value: "V1.2", mergeAmbiguousCharacters: true }),
        ).toBeTypeOf("string");
    });

    it("rejects a bad locale", () => {
        expect(() => toPathCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toPathCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});
