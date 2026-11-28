import { describe, expect, it } from "vitest";
import { isBIC } from "./is-bic.js";
describe("isBIC", () => {
    it("accepts 8 or 11 characters", () => {
        expect(isBIC("DEUTDEFF")).toBe(true);
        expect(isBIC("DEUTDEFF500")).toBe(true);
        expect(isBIC("nope")).toBe(false);
    });
});
