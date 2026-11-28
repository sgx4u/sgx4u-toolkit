import { describe, expect, it } from "vitest";
import { dividePrecise } from "../index.js";

describe("dividePrecise", () => {
    it("covers the documented behavior", () => {
        expect(dividePrecise({ first: 1, second: 2 })).toBe(0.5);
        expect(dividePrecise({ first: 0.3, second: 0.1 })).toBe(3);
        expect(dividePrecise({ first: 1, second: 0 })).toBeUndefined();
        expect(dividePrecise({ first: 1, second: -0 })).toBeUndefined();
    });
});
