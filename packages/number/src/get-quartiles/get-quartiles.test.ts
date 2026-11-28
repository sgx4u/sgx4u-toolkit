import { describe, expect, it } from "vitest";
import { getQuartiles } from "../index.js";

describe("getQuartiles", () => {
    it("covers the documented behavior", () => {
        const quartiles = getQuartiles([1, 2, 3, 4, 5]);
        expect(quartiles?.median).toBe(3);
        expect(getQuartiles([])).toBeUndefined();
    });
});
