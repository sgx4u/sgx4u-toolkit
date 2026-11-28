import { describe, expect, it } from "vitest";
import { takeLast } from "./take-last.js";
describe("takeLast", () => {
    it("uses the count", () => {
        expect(takeLast({ value: "hello", count: 2 })).toBe("lo");
        expect(takeLast({ value: "hello", count: 0 })).toBe("");
        expect(
            takeLast({ value: 1 as unknown as string, count: 1 }),
        ).toBeUndefined();
        expect(() => takeLast({ value: "a", count: -1 })).toThrow(RangeError);
    });
});
