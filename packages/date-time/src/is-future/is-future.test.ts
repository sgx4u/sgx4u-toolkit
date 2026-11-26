import { describe, expect, it } from "vitest";
import { isFuture } from "../index.js";

const now = "2026-11-26T12:00:00.000Z";

describe("isFuture", () => {
    it("is true when the date is later than now", () => {
        expect(isFuture("2027-01-01T00:00:00Z", { now })).toBe(true);
        expect(isFuture("2020-01-01T00:00:00Z", { now })).toBe(false);
    });

    it("is false at the same instant and true one millisecond later", () => {
        expect(isFuture(now, { now })).toBe(false);
        expect(isFuture("2026-11-26T12:00:00.001Z", { now })).toBe(true);
        expect(isFuture("2026-11-26T11:59:59.999Z", { now })).toBe(false);
    });

    it("rejects a date that is not real", () => {
        expect(() => isFuture("nope", { now })).toThrow(RangeError);
        expect(() => isFuture("nope", { now })).toThrow("`date`");
        expect(() => isFuture(null, { now })).toThrow(TypeError);
        expect(() => isFuture(null, { now })).toThrow("`date`");
        expect(() => isFuture("2027-01-01T00:00:00Z", { now: "nope" })).toThrow(
            "`now`",
        );
    });

    it("compares instants with the supplied now", () => {
        expect(isFuture(new Date(now).getTime() + 1, { now })).toBe(true);
        expect(isFuture(new Date(now), { now })).toBe(false);
    });
});
