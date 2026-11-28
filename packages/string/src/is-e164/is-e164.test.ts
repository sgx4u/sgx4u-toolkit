import { describe, expect, it } from "vitest";
import { isE164 } from "./is-e164.js";
describe("isE164", () => {
    it("checks the shape", () => {
        expect(isE164("+14155552671")).toBe(true);
        expect(isE164("123")).toBe(false);
        expect(isE164(null)).toBe(false);
    });
});
