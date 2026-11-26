import { describe, expect, it } from "vitest";
import { fromUnixSeconds } from "../index.js";

describe("fromUnixSeconds", () => {
    it("converts whole and fractional seconds from the Unix epoch", () => {
        expect(fromUnixSeconds(0)?.toISOString()).toBe(
            "1970-01-01T00:00:00.000Z",
        );
        expect(fromUnixSeconds(1.5)?.toISOString()).toBe(
            "1970-01-01T00:00:01.500Z",
        );
    });

    it("converts the leap day and the next New Year", () => {
        expect(fromUnixSeconds(1_709_164_800)?.toISOString()).toBe(
            "2024-02-29T00:00:00.000Z",
        );
        expect(fromUnixSeconds(1_767_225_600)?.toISOString()).toBe(
            "2026-01-01T00:00:00.000Z",
        );
    });

    it("returns undefined when seconds is not usable", () => {
        expect(fromUnixSeconds(undefined as never)).toBeUndefined();
        expect(fromUnixSeconds(Number.NaN)).toBeUndefined();
        expect(fromUnixSeconds(1e16)).toBeUndefined();
    });
});