import { describe, expect, it } from "vitest";
import { formatUnit } from "../index.js";

describe("formatUnit", () => {
    it("covers the documented behavior", () => {
        expect(
            formatUnit({ value: 3, unit: "kilometer", locale: "en-US" }),
        ).toBe(
            new Intl.NumberFormat("en-US", {
                style: "unit",
                unit: "kilometer",
                unitDisplay: "short",
            }).format(3),
        );
        expect(() => formatUnit({ value: 1, unit: "furlong" })).toThrow(
            RangeError,
        );
        expect(
            formatUnit({ value: Number.NaN, unit: "meter" }),
        ).toBeUndefined();
    });
});
