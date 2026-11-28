import { describe, expect, it } from "vitest";
import { formatUTCOffset } from "../index.js";

describe("formatUTCOffset", () => {
    it("writes an extended offset and keeps zero as +00:00", () => {
        expect(formatUTCOffset({ offsetMinutes: 330 })).toBe("+05:30");
        expect(formatUTCOffset({ offsetMinutes: 0 })).toBe("+00:00");
        expect(formatUTCOffset({ offsetMinutes: 0, style: "extended" })).toBe(
            "+00:00",
        );
        expect(formatUTCOffset({ offsetMinutes: 0, useZForZero: false })).toBe(
            "+00:00",
        );
        expect(formatUTCOffset({ offsetMinutes: 0, useZForZero: true })).toBe(
            "Z",
        );
        expect(formatUTCOffset({ offsetMinutes: -332.4 })).toBe("-05:32");
    });

    it("writes basic and short forms, dropping a zero minute part", () => {
        expect(formatUTCOffset({ offsetMinutes: 330, style: "basic" })).toBe(
            "+0530",
        );
        expect(formatUTCOffset({ offsetMinutes: -90, style: "short" })).toBe(
            "-1:30",
        );
        expect(formatUTCOffset({ offsetMinutes: 300, style: "short" })).toBe(
            "+5",
        );
        expect(formatUTCOffset({ offsetMinutes: -300, style: "short" })).toBe(
            "-5",
        );
    });

    it("returns undefined for a non-number offset and throws for an unknown style", () => {
        expect(
            formatUTCOffset({ offsetMinutes: "5" as never }),
        ).toBeUndefined();
        expect(formatUTCOffset({ offsetMinutes: Number.NaN })).toBeUndefined();
        expect(() =>
            formatUTCOffset({ offsetMinutes: 0, style: "wide" as never }),
        ).toThrow(RangeError);
    });
});
