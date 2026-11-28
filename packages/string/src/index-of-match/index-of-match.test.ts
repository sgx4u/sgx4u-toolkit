import { describe, expect, it } from "vitest";
import { indexOfMatch } from "./index-of-match.js";
describe("indexOfMatch", () => {
    it("returns the unit index or -1", () => {
        expect(indexOfMatch({ value: "hello", search: "ll" })).toBe(2);
        expect(indexOfMatch({ value: "hello", search: "x" })).toBe(-1);
        expect(
            indexOfMatch({ value: "hello", search: "LL", ignoreCase: true }),
        ).toBe(2);
        expect(indexOfMatch({ value: "hello", search: "" })).toBe(0);
        expect(indexOfMatch({ value: "hello", search: "", fromIndex: 9 })).toBe(
            5,
        );
        expect(indexOfMatch({ value: "a👨‍👩‍👧‍👦b", search: "👨‍👩‍👧‍👦" })).toBe(1);
        expect(
            indexOfMatch({ value: 1 as unknown as string, search: "a" }),
        ).toBeUndefined();
    });
});
