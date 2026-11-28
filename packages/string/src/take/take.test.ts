import { describe, expect, it } from "vitest";
import { take } from "./take.js";
describe("take", () => {
    it("uses the count", () => {
        expect(take({ value: "hello", count: 2 })).toBe("he");
        expect(take({ value: "👨‍👩‍👧‍👦ab", count: 1 })).toBe("👨‍👩‍👧‍👦");
        expect(take({ value: "hello", count: 0 })).toBe("");
        expect(
            take({ value: 1 as unknown as string, count: 1 }),
        ).toBeUndefined();
        expect(() => take({ value: "a", count: -1 })).toThrow(RangeError);
    });
});
