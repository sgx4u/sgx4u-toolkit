import { describe, expect, it } from "vitest";
import { floorNumber } from "../index.js";

describe("floorNumber", () => {
    it("covers the documented behavior", () => {
        expect(floorNumber({ value: 1.8 })).toBe(1);
        expect(floorNumber({ value: -1.2 })).toBe(-2);
    });
});
