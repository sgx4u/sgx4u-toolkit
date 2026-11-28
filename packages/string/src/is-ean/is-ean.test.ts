import { describe, expect, it } from "vitest";
import { isEAN } from "./is-ean.js";
describe("isEAN", () => {
    it("checks EAN-13", () => {
        expect(isEAN("4006381333931")).toBe(true);
        expect(isEAN("4006381333932")).toBe(false);
    });
});
