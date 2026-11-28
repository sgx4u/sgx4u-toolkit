import { describe, expect, it } from "vitest";
import { dropLast } from "./drop-last.js";
describe("dropLast", () => {
    it("uses the count", () => {
        expect(dropLast({ value: "hello", count: 2 })).toBe("hel");
        expect(dropLast({ value: "hello", count: 0 })).toBe("");
        expect(
            dropLast({ value: 1 as unknown as string, count: 1 }),
        ).toBeUndefined();
        expect(() => dropLast({ value: "a", count: -1 })).toThrow(RangeError);
    });
});
