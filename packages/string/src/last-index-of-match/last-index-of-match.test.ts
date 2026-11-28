import { describe, expect, it } from "vitest";
import { lastIndexOfMatch } from "./last-index-of-match.js";
describe("lastIndexOfMatch", () => {
    it("returns the last index", () => {
        expect(lastIndexOfMatch({ value: "ababa", search: "ba" })).toBe(3);
        expect(lastIndexOfMatch({ value: "ababa", search: "z" })).toBe(-1);
        expect(lastIndexOfMatch({ value: "hello", search: "" })).toBe(5);
        expect(
            lastIndexOfMatch({ value: "hello", search: "l", fromIndex: -1 }),
        ).toBe(-1);
        expect(
            lastIndexOfMatch({ value: "hello", search: "h", fromIndex: -1 }),
        ).toBe(0);
        expect(
            lastIndexOfMatch({ value: 1 as unknown as string, search: "a" }),
        ).toBeUndefined();
    });
});
