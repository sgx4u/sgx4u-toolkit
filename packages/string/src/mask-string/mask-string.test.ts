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
