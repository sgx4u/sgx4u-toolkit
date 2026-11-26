import { describe, expect, it } from "vitest";
import { fromUnixSeconds } from "../index.js";

describe("fromUnixSeconds", () => {
    it("converts whole and fractional seconds from the Unix epoch", () => {
        expect(fromUnixSeconds(0).toISOString()).toBe(
            "1970-01-01T00:00:00.000Z",
        );
        expect(fromUnixSeconds(1.5).toISOString()).toBe(
            "1970-01-01T00:00:01.500Z",
        );
    });

    it("converts the leap day and the next New Year", () => {
        expect(fromUnixSeconds(1_709_164_800).toISOString()).toBe(
            "2024-02-29T00:00:00.000Z",
        );
        expect(fromUnixSeconds(1_767_225_600).toISOString()).toBe(
            "2026-01-01T00:00:00.000Z",
        );
    });

    it("throws when seconds is not a number or the instant cannot be stored", () => {
        expect(() => fromUnixSeconds(undefined as never)).toThrow(TypeError);
        expect(() => fromUnixSeconds(undefined as never)).toThrow(
            "`seconds` must be a number",
        );
        expect(() => fromUnixSeconds(Number.NaN)).toThrow(RangeError);
        expect(() => fromUnixSeconds(Number.NaN)).toThrow("finite number");
        expect(() => fromUnixSeconds(1e16)).toThrow(RangeError);
        expect(() => fromUnixSeconds(1e16)).toThrow("a time Date can store");
    });
});
