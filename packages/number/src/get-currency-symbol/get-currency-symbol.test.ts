import { describe, expect, it } from "vitest";
import { getCurrencySymbol } from "../index.js";

describe("getCurrencySymbol", () => {
    it("covers the documented behavior", () => {
        expect(getCurrencySymbol({ currency: "USD", locale: "en-US" })).toBe(
            "$",
        );
        expect(getCurrencySymbol({ currency: "INR", locale: "en-IN" })).toBe(
            "₹",
        );
        expect(
            getCurrencySymbol({
                currency: "USD",
                locale: "en-US",
                currencyDisplay: "code",
            }),
        ).toBe("USD");
        expect(() => getCurrencySymbol({ currency: "US" })).toThrow(RangeError);
    });
});
