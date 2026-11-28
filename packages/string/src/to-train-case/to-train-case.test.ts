import { describe, expect, it } from "vitest";
import { toTrainCase } from "./to-train-case.js";

describe("toTrainCase", () => {
    it("converts separators and camel boundaries", () => {
        expect(toTrainCase("foo bar")).toBe(toTrainCase("fooBar"));
        expect(toTrainCase("XMLHttpRequest")).toBeTypeOf("string");
        expect(toTrainCase("")).toBe("");
        expect(toTrainCase(null as never)).toBeUndefined();
    });

    it("honors consecutive uppercase and merged digits", () => {
        const plain = toTrainCase("userID");
        const kept = toTrainCase({
            value: "userID",
            keepConsecutiveUppercase: true,
        });
        expect(typeof plain).toBe("string");
        expect(typeof kept).toBe("string");
        expect(
            toTrainCase({ value: "V1.2", mergeAmbiguousCharacters: true }),
        ).toBeTypeOf("string");
    });

    it("rejects a bad locale", () => {
        expect(() => toTrainCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
        expect(() =>
            toTrainCase({ value: "a", locale: 1 as unknown as string }),
        ).toThrow(TypeError);
    });
});
