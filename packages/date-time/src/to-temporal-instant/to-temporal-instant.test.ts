import { describe, expect, it } from "vitest";
import { toTemporalInstant } from "../index.js";

interface TemporalHost {
    Temporal?:
        | {
              Instant?: {
                  fromEpochMilliseconds: (milliseconds: number) => {
                      epochMilliseconds: number;
                  };
              };
          }
        | undefined;
}

describe("toTemporalInstant", () => {
    it("uses Temporal.Instant when it is present", () => {
        const host = globalThis as TemporalHost;
        const original = host.Temporal;

        host.Temporal = {
            Instant: {
                fromEpochMilliseconds: (milliseconds) => ({
                    epochMilliseconds: milliseconds,
                }),
            },
        };
        try {
            expect(toTemporalInstant(0).epochMilliseconds).toBe(0);
            expect(toTemporalInstant(-1_500).epochMilliseconds).toBe(-1_500);
            expect(
                toTemporalInstant("1970-01-01T00:00:01.900Z").epochMilliseconds,
            ).toBe(1_900);
            expect(
                toTemporalInstant("2024-02-29T00:00:00Z").epochMilliseconds,
            ).toBe(Date.parse("2024-02-29T00:00:00Z"));
            expect(() => toTemporalInstant(Number.NaN)).toThrow(RangeError);
            expect(() => toTemporalInstant("2024-02-30")).toThrow(RangeError);
        } finally {
            host.Temporal = original;
        }
    });

    it("matches a real Temporal instant when the runtime provides one", () => {
        const host = globalThis as TemporalHost;
        const fromEpoch = host.Temporal?.Instant?.fromEpochMilliseconds;
        if (fromEpoch === undefined) {
            expect(host.Temporal).toBeUndefined();
            return;
        }

        expect(toTemporalInstant(1_500).epochMilliseconds).toBe(1_500);
        expect(toTemporalInstant(-1_500).epochMilliseconds).toBe(-1_500);
    });

    it("throws TypeError when Temporal is missing", () => {
        const host = globalThis as TemporalHost;
        const original = host.Temporal;

        host.Temporal = undefined;
        try {
            expect(() => toTemporalInstant(0)).toThrow(TypeError);
            expect(() => toTemporalInstant(0)).toThrow(
                "`Temporal` is not available on the global object; received undefined.",
            );
            expect(() => toTemporalInstant("not-a-date")).toThrow(TypeError);
        } finally {
            host.Temporal = original;
        }
    });
});
