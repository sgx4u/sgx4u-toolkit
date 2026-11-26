import { describe, expect, it } from "vitest";
import { isFuture } from "../index.js";

const now = "2026-11-26T12:00:00.000Z";

describe("isFuture", () => {
    it("is true when the date is later than now", () => {
        expect(isFuture({ date: "2027-01-01T00:00:00Z", now })).toBe(true);
        expect(isFuture({ date: "2020-01-01T00:00:00Z", now })).toBe(false);
    });

    it("is false at the same instant and true one millisecond later", () => {
        expect(isFuture({ date: now, now })).toBe(false);
        expect(isFuture({ date: "2026-11-26T12:00:00.001Z", now })).toBe(true);
        expect(isFuture({ date: "2026-11-26T11:59:59.999Z", now })).toBe(false);
    });

    it("rejects a date that is not real", () => {
        expect(isFuture({ date: "nope", now })).toBe(false);
        expect(isFuture({ date: null as never, now })).toBe(false);
        expect(isFuture({ date: "2027-01-01T00:00:00Z", now: "nope" })).toBe(
            false,
        );
    });

    it("compares instants with the supplied now", () => {
        expect(isFuture({ date: new Date(now)?.getTime() + 1, now })).toBe(
            true,
        );
        expect(isFuture({ date: new Date(now), now })).toBe(false);
    });
});
