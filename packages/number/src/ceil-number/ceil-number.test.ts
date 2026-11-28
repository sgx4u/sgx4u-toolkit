import { describe, expect, it } from "vitest";
import { ceilNumber } from "../index.js";

describe("ceilNumber", () => {
    it("covers the documented behavior", () => {
        expect(ceilNumber({ value: 1.2 })).toBe(2);
        expect(ceilNumber({ value: -1.2 })).toBe(-1);
        expect(ceilNumber({ value: Number.NaN })).toBeUndefined();
    });
});
