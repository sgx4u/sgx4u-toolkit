import { describe, expect, it } from "vitest";
import { isHexColor } from "./is-hex-color.js";
describe("isHexColor", () => {
    it("accepts short and long forms", () => {
        expect(isHexColor("#fff")).toBe(true);
        expect(isHexColor("ffffff")).toBe(true);
        expect(isHexColor("#ffff")).toBe(true);
        expect(isHexColor("ggg")).toBe(false);
    });
});
