import { describe, expect, it } from "vitest";
import { randomNumberSecure } from "../index.js";

describe("randomNumberSecure", () => {
    it("covers the documented behavior", () => {
        const value = randomNumberSecure({ lower: 0, upper: 1 });
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
        expect(() => randomNumberSecure({ lower: 2, upper: 1 })).toThrow(
            RangeError,
        );
    });
});
