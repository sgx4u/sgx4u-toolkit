import { describe, expect, it } from "vitest";
import { parseUTCOffset } from "../index.js";

describe("parseUTCOffset", () => {
    it("parses Z and numeric offsets into minutes east of UTC", () => {
        expect(parseUTCOffset("Z")).toBe(0);
        expect(parseUTCOffset("z")).toBe(0);
        expect(parseUTCOffset("+05:30")).toBe(330);
        expect(parseUTCOffset("+0530")).toBe(330);
        expect(parseUTCOffset("+05")).toBe(300);
        expect(parseUTCOffset("-08:00")).toBe(-480);
        expect(parseUTCOffset("-0800")).toBe(-480);
        expect(parseUTCOffset("+00")).toBe(0);
        expect(parseUTCOffset("-00:00")).toBe(-0);
        expect(parseUTCOffset("+23:59")).toBe(23 * 60 + 59);
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
            expect(parseUTCOffset(value)).toBeUndefined();
        }
    });

    it("throws TypeError when the text is not a string", () => {
        expect(() => parseUTCOffset(330 as unknown as string)).toThrow(
            TypeError,
        );
        expect(() => parseUTCOffset(null as unknown as string)).toThrow(
            "`value` must be a string; received null.",
        );
    });
});
