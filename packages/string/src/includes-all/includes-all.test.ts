import { describe, expect, it } from "vitest";
import { includesAll } from "./includes-all.js";
describe("includesAll", () => {
    it("requires every search", () => {
        expect(includesAll({ value: "hello", searches: ["he", "lo"] })).toBe(
            true,
        );
        expect(includesAll({ value: "hello", searches: ["he", "x"] })).toBe(
            false,
        );
        expect(
            includesAll({ value: 1 as unknown as string, searches: ["a"] }),
        ).toBe(false);
    });
});
