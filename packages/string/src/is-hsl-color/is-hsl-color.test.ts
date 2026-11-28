import { describe, expect, it } from "vitest";
import { isHSLColor } from "./is-hsl-color.js";
describe("isHSLColor", () => {
    it("accepts function syntax", () => {
        expect(isHSLColor("hsl(120, 50%, 40%)")).toBe(true);
        expect(isHSLColor("hsl(120 50% 40% / 50%)")).toBe(true);
        expect(isHSLColor("red")).toBe(false);
    });
});
