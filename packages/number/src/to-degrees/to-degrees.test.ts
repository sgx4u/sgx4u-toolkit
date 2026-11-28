import { describe, expect, it } from "vitest";
import { toDegrees } from "../index.js";

describe("toDegrees", () => {
    it("covers the documented behavior", () => {
        expect(toDegrees(Math.PI)).toBe(180);
        expect(toDegrees(0)).toBe(0);
        expect(toDegrees(Number.NaN)).toBeUndefined();
    });
});
