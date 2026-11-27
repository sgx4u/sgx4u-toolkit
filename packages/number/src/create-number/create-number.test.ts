import { describe, expect, it } from "vitest";
import { createNumber, formatCurrency, roundNumber } from "../index.js";

describe("createNumber", () => {
    it("binds defaults and keeps instances separate", () => {
        const india = createNumber({
            locale: "en-IN",
            currency: "INR",
            roundingMode: "halfEven",
        });
        const unitedStates = createNumber({
            locale: "en-US",
            currency: "USD",
            roundingMode: "halfExpand",
        });

        expect(india.formatCurrency({ value: 1 })).toBe(
            formatCurrency({ value: 1, locale: "en-IN", currency: "INR" }),
        );
        expect(unitedStates.formatCurrency({ value: 1 })).toContain("$");
        expect(india.roundNumber({ value: 2.5 })).toBe(2);
        expect(unitedStates.roundNumber({ value: 2.5 })).toBe(3);
        expect(roundNumber({ value: 1.5 })).toBe(2);
        expect(Object.isFrozen(india)).toBe(true);
    });

    it("lets a call override the bound currency and rejects invalid config", () => {
        const numbers = createNumber({ currency: "USD", locale: "en-US" });
        expect(
            numbers.formatCurrency({
                value: 1,
                currency: "EUR",
                locale: "de-DE",
            }),
        ).toContain("€");
        expect(() => createNumber({ locale: "en-" })).toThrow(RangeError);
        expect(() => createNumber({ currency: "US" })).toThrow(RangeError);
        expect(() =>
            createNumber({ roundingMode: "bank" as "halfEven" }),
        ).toThrow(RangeError);
        expect(() =>
            createNumber({ random: "nope" as unknown as () => number }),
        ).toThrow(TypeError);
    });

    it("requires currency when the instance was not given one", () => {
        const numbers = createNumber({ locale: "en-US" });
        const formatCurrency = numbers.formatCurrency as (parameters: {
            value: number;
        }) => string | undefined;
        expect(() => formatCurrency({ value: 1 })).toThrow(RangeError);
    });
});
