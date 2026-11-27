import { describe, expect, it } from "vitest";
import { getNumberFormatParts } from "../index.js";

describe("getNumberFormatParts", () => {
    it("covers the documented behavior", () => {
        const parts = getNumberFormatParts({ value: 1.5, locale: "en-US" });
        expect(parts?.some((part) => part.type === "decimal")).toBe(true);
        expect(getNumberFormatParts({ value: Number.NaN })).toBeUndefined();
    });
});
