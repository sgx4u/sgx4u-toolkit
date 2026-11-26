import { describe, expect, it } from "vitest";
import { parseUtcOffset } from "../index.js";

describe("parseUtcOffset", () => {
    it("parses Z and numeric offsets into minutes east of UTC", () => {
        expect(parseUtcOffset("Z")).toBe(0);
        expect(parseUtcOffset("z")).toBe(0);
        expect(parseUtcOffset("+05:30")).toBe(330);
        expect(parseUtcOffset("+0530")).toBe(330);
        expect(parseUtcOffset("+05")).toBe(300);
        expect(parseUtcOffset("-08:00")).toBe(-480);
        expect(parseUtcOffset("-0800")).toBe(-480);
        expect(parseUtcOffset("+00")).toBe(0);
        expect(parseUtcOffset("-00:00")).toBe(-0);
        expect(parseUtcOffset("+23:59")).toBe(23 * 60 + 59);
    });

    it("returns undefined for text that is not an offset", () => {
        const rejected = [
            "",
            "UTC",
            "GMT",
            "+5:30",
            "05:30",
            "+24:00",
            "+00:60",
            "+2400",
            "+0060",
            "+05:30 ",
            " +05:30",
            "+05:3",
            "not an offset",
        ];

        for (const value of rejected) {
            expect(parseUtcOffset(value)).toBeUndefined();
        }
    });

    it("throws TypeError when the text is not a string", () => {
        expect(() => parseUtcOffset(330 as unknown as string)).toThrow(
            TypeError,
        );
        expect(() => parseUtcOffset(null as unknown as string)).toThrow(
            "`value` must be a string; received null.",
        );
    });
});
