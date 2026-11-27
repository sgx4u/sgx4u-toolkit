import { describe, expect, it } from "vitest";
import { formatPercent } from "../index.js";

describe("formatPercent", () => {
    it("covers the documented behavior", () => {
        expect(formatPercent({ value: 0.25, locale: "en-US" })).toBe(
            new Intl.NumberFormat("en-US", { style: "percent" }).format(0.25),
        );
        expect(
            formatPercent({ value: Number.POSITIVE_INFINITY }),
        ).toBeUndefined();
    });
});
