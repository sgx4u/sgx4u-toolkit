import { describe, expect, it } from "vitest";
import { formatEngineeringNotation } from "../index.js";

describe("formatEngineeringNotation", () => {
    it("covers the documented behavior", () => {
        expect(
            formatEngineeringNotation({ value: 12345, locale: "en-US" }),
        ).toBe(
            new Intl.NumberFormat("en-US", {
                notation: "engineering",
                maximumSignificantDigits: 3,
            }).format(12345),
        );
        expect(
            formatEngineeringNotation({ value: Number.NaN }),
        ).toBeUndefined();
    });
});
