import { describe, expect, it } from "vitest";
import { multiplyPrecise } from "../index.js";

describe("multiplyPrecise", () => {
    it("covers the documented behavior", () => {
        expect(multiplyPrecise({ first: 0.1, second: 0.2 })).toBe(0.02);
    });
});
