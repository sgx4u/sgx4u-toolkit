import { describe, expect, it } from "vitest";
import { includesAny } from "./includes-any.js";
describe("includesAny", () => {
    it("accepts one match", () => {
        expect(includesAny({ value: "hello", searches: ["x", "ell"] })).toBe(
            true,
        );
        expect(includesAny({ value: "hello", searches: [] })).toBe(false);
        expect(
            includesAny({ value: 1 as unknown as string, searches: ["a"] }),
        ).toBe(false);
    });
});
