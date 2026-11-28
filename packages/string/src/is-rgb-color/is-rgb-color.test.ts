import { describe, expect, it } from "vitest";
import { isRGBColor } from "./is-rgb-color.js";
describe("isRGBColor", () => {
    it("accepts function syntax", () => {
        expect(isRGBColor("rgb(1, 2, 3)")).toBe(true);
        expect(isRGBColor("rgb(1 2 3 / 0.5)")).toBe(true);
        expect(isRGBColor("red")).toBe(false);
    });
});
