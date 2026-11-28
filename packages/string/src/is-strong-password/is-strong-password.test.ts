import { describe, expect, it } from "vitest";
import { isStrongPassword } from "./is-strong-password.js";
describe("isStrongPassword", () => {
    it("checks the default policy", () => {
        expect(isStrongPassword("Abcdef1!")).toBe(true);
        expect(isStrongPassword("abcdef")).toBe(false);
        expect(
            isStrongPassword({
                value: "abcdefgh",
                requireUppercase: false,
                requireNumber: false,
                requireSymbol: false,
            }),
        ).toBe(true);
    });
});
