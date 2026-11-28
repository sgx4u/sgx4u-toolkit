import { describe, expect, it } from "vitest";
import { drop } from "./drop.js";
describe("drop", () => {
    it("uses the count", () => {
        expect(drop({ value: "hello", count: 2 })).toBe("llo");
        expect(drop({ value: "hello", count: 0 })).toBe("");
        expect(
            drop({ value: 1 as unknown as string, count: 1 }),
        ).toBeUndefined();
        expect(() => drop({ value: "a", count: -1 })).toThrow(RangeError);
    });
});
