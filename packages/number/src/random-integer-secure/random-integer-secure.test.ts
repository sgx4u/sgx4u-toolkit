import { describe, expect, it } from "vitest";
import { randomIntegerSecure } from "../index.js";

describe("randomIntegerSecure", () => {
    it("covers the documented behavior", () => {
        const value = randomIntegerSecure({ lower: 1, upper: 3 });
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(3);
        expect(() => randomIntegerSecure({ lower: 4, upper: 1 })).toThrow(
            RangeError,
        );
    });
});
