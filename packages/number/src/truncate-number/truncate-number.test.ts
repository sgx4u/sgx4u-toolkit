import { describe, expect, it } from "vitest";
import { truncateNumber } from "../index.js";

describe("truncateNumber", () => {
    it("covers the documented behavior", () => {
        expect(truncateNumber({ value: -1.8 })).toBe(-1);
        expect(truncateNumber({ value: 1.8 })).toBe(1);
        expect(Object.is(truncateNumber({ value: -0.2 }), -0)).toBe(true);
    });
});
