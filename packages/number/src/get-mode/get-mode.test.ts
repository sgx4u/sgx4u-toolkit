import { describe, expect, it } from "vitest";
import { getMode } from "../index.js";

describe("getMode", () => {
    it("covers the documented behavior", () => {
        expect(getMode([1, 2, 2, 3])).toBe(2);
        expect(getMode([1, 1, 2, 2])).toBeUndefined();
        expect(getMode([])).toBeUndefined();
    });
});
