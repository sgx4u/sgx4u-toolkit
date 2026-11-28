import { describe, expect, it } from "vitest";
import { getAbsolute } from "../index.js";

describe("getAbsolute", () => {
    it("covers the documented behavior", () => {
        expect(getAbsolute(-4)).toBe(4);
        expect(getAbsolute(-0)).toBe(0);
        expect(getAbsolute(Number.NaN)).toBeUndefined();
    });
});
