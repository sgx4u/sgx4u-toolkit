import { describe, expect, it } from "vitest";
import { getLeastCommonMultiple } from "../index.js";

describe("getLeastCommonMultiple", () => {
    it("covers the documented behavior", () => {
        expect(getLeastCommonMultiple({ values: [4, 6] })).toBe(12);
        expect(getLeastCommonMultiple({ values: [0, 5] })).toBe(0);
        expect(getLeastCommonMultiple({ values: [3] })).toBeUndefined();
    });
});
