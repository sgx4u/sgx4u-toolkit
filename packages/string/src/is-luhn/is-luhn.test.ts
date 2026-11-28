import { describe, expect, it } from "vitest";
import { isLuhn } from "./is-luhn.js";
describe("isLuhn", () => {
    it("checks the Visa test number", () => {
        expect(isLuhn("4242424242424242")).toBe(true);
        expect(isLuhn("4242424242424243")).toBe(false);
        expect(isLuhn("abc")).toBe(false);
    });
});
