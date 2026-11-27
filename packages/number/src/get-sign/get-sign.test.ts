import { describe, expect, it } from "vitest";
import { getSign } from "../index.js";

describe("getSign", () => {
    it("covers the documented behavior", () => {
        expect(getSign(-4)).toBe(-1);
        expect(getSign(4)).toBe(1);
        expect(Object.is(getSign(-0), -0)).toBe(true);
        expect(getSign(Number.POSITIVE_INFINITY)).toBeUndefined();
    });
});
