import { describe, expect, it } from "vitest";
import { subtractPrecise } from "../index.js";

describe("subtractPrecise", () => {
    it("covers the documented behavior", () => {
        expect(subtractPrecise({ first: 0.3, second: 0.1 })).toBe(0.2);
    });
});
