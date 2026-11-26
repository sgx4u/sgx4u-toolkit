import { describe, expect, it } from "vitest";
import { isPast } from "../index.js";

const now = "2026-11-26T12:00:00.000Z";

describe("isPast", () => {
    it("is true when the date is earlier than now", () => {
        expect(isPast({ date: "2020-01-01T00:00:00Z", now })).toBe(true);
        expect(isPast({ date: "2027-01-01T00:00:00Z", now })).toBe(false);
    });

    it("is false at the same instant and true one millisecond earlier", () => {
        expect(isPast({ date: now, now })).toBe(false);
        expect(isPast({ date: "2026-11-26T11:59:59.999Z", now })).toBe(true);
        expect(isPast({ date: "2026-11-26T12:00:00.001Z", now })).toBe(false);
    });

    it("rejects a date that is not real", () => {
        expect(isPast({ date: "nope", now })).toBe(false);
        expect(isPast({ date: null as never, now })).toBe(false);
        expect(isPast({ date: "2020-01-01T00:00:00Z", now: "nope" })).toBe(
            false,
        );
    });

    it("compares instants with the supplied now", () => {
        expect(isPast({ date: new Date(now)?.getTime() - 1, now })).toBe(true);
        expect(isPast({ date: new Date(now), now })).toBe(false);
    });
});
