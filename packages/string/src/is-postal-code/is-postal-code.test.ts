import { describe, expect, it } from "vitest";
import { isPostalCode } from "./is-postal-code.js";

describe("isPostalCode", () => {
    it("matches known country patterns", () => {
        expect(isPostalCode({ value: "90210", country: "US" })).toBe(true);
        expect(isPostalCode({ value: "90210-1234", country: "us" })).toBe(true);
        expect(isPostalCode({ value: "12345", country: "DE" })).toBe(true);
        expect(isPostalCode({ value: "SW1A 1AA", country: "GB" })).toBe(true);
        expect(isPostalCode({ value: "12", country: "US" })).toBe(false);
        expect(
            isPostalCode({ value: 1 as unknown as string, country: "US" }),
        ).toBe(false);
        expect(isPostalCode(null)).toBe(false);
    });

    it("requires a known country", () => {
        expect(() => isPostalCode("90210")).toThrow(RangeError);
        expect(() => isPostalCode({ value: "1", country: "ZZ" })).toThrow(
            RangeError,
        );
    });
});
