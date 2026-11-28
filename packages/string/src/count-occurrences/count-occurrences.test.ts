import { describe, expect, it } from "vitest";
import { countOccurrences } from "./count-occurrences.js";
describe("countOccurrences", () => {
    it("counts with and without overlap", () => {
        expect(countOccurrences({ value: "aaa", search: "aa" })).toBe(1);
        expect(
            countOccurrences({ value: "aaa", search: "aa", overlap: true }),
        ).toBe(2);
        expect(countOccurrences({ value: "aaa", search: "" })).toBe(0);
        expect(
            countOccurrences({ value: 1 as unknown as string, search: "a" }),
        ).toBeUndefined();
    });
});
