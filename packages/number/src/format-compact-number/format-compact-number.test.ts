import { describe, expect, it } from "vitest";
import { formatCompactNumber } from "../index.js";

describe("formatCompactNumber", () => {
    it("covers the documented behavior", () => {
        expect(formatCompactNumber({ value: 1200000, locale: "en-IN" })).toBe(
            new Intl.NumberFormat("en-IN", {
                notation: "compact",
                compactDisplay: "short",
            }).format(1200000),
        );
        expect(
            formatCompactNumber({
                value: 1200000,
                locale: "en-US",
                compactDisplay: "long",
            }),
        ).toBe(
            new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "long",
            }).format(1200000),
        );
    });
});
