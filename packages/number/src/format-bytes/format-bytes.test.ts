import { describe, expect, it } from "vitest";
import { formatBytes } from "../index.js";

describe("formatBytes", () => {
    it("covers the documented behavior", () => {
        expect(formatBytes({ value: 1340, locale: "en-US" })).toContain("1.34");
        expect(
            formatBytes({ value: 1024, standard: "IEC", locale: "en-US" }),
        ).toMatch(/KiB|kibibyte/i);
        expect(
            formatBytes({ value: 1000, bits: true, locale: "en-US" }),
        ).toMatch(/kbit|kb/i);
        expect(
            formatBytes({
                value: 1024,
                bits: true,
                standard: "IEC",
                locale: "en-US",
            }),
        ).toBe("1 Kibit");
        expect(
            formatBytes({ value: 5, signed: true, locale: "en-US" }),
        ).toContain("+");
        expect(formatBytes({ value: Number.NaN })).toBeUndefined();
    });
});
