import { describe, expect, it } from "vitest";
import { formatScientificNotation } from "../index.js";

describe("formatScientificNotation", () => {
    it("covers the documented behavior", () => {
        expect(
            formatScientificNotation({
                value: 12345,
                locale: "en-US",
                maximumSignificantDigits: 3,
            }),
        ).toBe(
            new Intl.NumberFormat("en-US", {
                notation: "scientific",
                maximumSignificantDigits: 3,
            }).format(12345),
        );
    });
});
