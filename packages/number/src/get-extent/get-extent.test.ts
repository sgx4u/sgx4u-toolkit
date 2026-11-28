import { describe, expect, it } from "vitest";
import { getExtent } from "../index.js";

describe("getExtent", () => {
    it("covers the documented behavior", () => {
        expect(getExtent([3, 1, 2])).toEqual({ minimum: 1, maximum: 3 });
        expect(getExtent([])).toBeUndefined();
    });
});
