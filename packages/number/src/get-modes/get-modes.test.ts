import { describe, expect, it } from "vitest";
import { getModes } from "../index.js";

describe("getModes", () => {
    it("covers the documented behavior", () => {
        expect(getModes([1, 1, 2, 2, 3])).toEqual([1, 2]);
        expect(getModes([])).toEqual([]);
        expect(getModes([1, Number.NaN])).toEqual([]);
    });
});
