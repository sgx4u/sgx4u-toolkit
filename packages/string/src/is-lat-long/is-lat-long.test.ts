import { describe, expect, it } from "vitest";
import { isLatLong } from "./is-lat-long.js";
describe("isLatLong", () => {
    it("checks the ranges", () => {
        expect(isLatLong("12.5, 77.5")).toBe(true);
        expect(isLatLong("91, 0")).toBe(false);
    });
});
