import { describe, expect, it } from "vitest";
import { parseIsoDateTime } from "../index.js";

describe("parseIsoDateTime", () => {
    it("places an offset, including a basic offset and truncated fractions", () => {
        expect(
            parseIsoDateTime("2026-11-26T03:30:00+05:30")?.toISOString(),
        ).toBe("2026-11-25T22:00:00.000Z");
        expect(
            parseIsoDateTime("2026-11-26T03:30:00+0530")?.toISOString(),
        ).toBe("2026-11-25T22:00:00.000Z");
        expect(parseIsoDateTime("2024-02-29T00:00:00Z")?.toISOString()).toBe(
            "2024-02-29T00:00:00.000Z",
        );
        expect(parseIsoDateTime("2024-02-29t00:00:00z")?.toISOString()).toBe(
            "2024-02-29T00:00:00.000Z",
        );
        expect(
            parseIsoDateTime("2026-11-26T00:00:00.123456Z")?.toISOString(),
        ).toBe("2026-11-26T00:00:00.123Z");
        expect(parseIsoDateTime("2026-11-26T00:00:00.1Z")?.toISOString()).toBe(
            "2026-11-26T00:00:00.100Z",
        );
        expect(
            parseIsoDateTime("0000-01-01T00:00:00.000Z")?.toISOString(),
        ).toBe("0000-01-01T00:00:00.000Z");
        expect(
            parseIsoDateTime("9999-12-31T23:59:59.999Z")?.toISOString(),
        ).toBe("9999-12-31T23:59:59.999Z");
        expect(parseIsoDateTime("2026-01-31T23:59:59Z")?.toISOString()).toBe(
            "2026-01-31T23:59:59.000Z",
        );
    });

    it("requires an offset unless a default zone or a bracketed zone is set", () => {
        expect(parseIsoDateTime("2026-11-26T03:30:00")).toBeUndefined();
        expect(
            parseIsoDateTime("2026-11-26T03:30:00", {
                defaultTimeZone: "Asia/Kolkata",
            })?.toISOString(),
        ).toBe("2026-11-25T22:00:00.000Z");
        expect(
            parseIsoDateTime(
                "2026-11-26T03:30:00+05:30[Asia/Kolkata]",
            )?.toISOString(),
        ).toBe("2026-11-25T22:00:00.000Z");
        expect(
            parseIsoDateTime(
                "2026-11-26T03:30:00[Asia/Kolkata]",
            )?.toISOString(),
        ).toBe("2026-11-25T22:00:00.000Z");
        expect(
            parseIsoDateTime("2026-11-26T03:30:00+00:00[Asia/Kolkata]"),
        ).toBeUndefined();
        expect(
            parseIsoDateTime("2026-11-26T03:30:00", {
                defaultTimeZone: "Mars/Base",
            }),
        ).toBeUndefined();
    });

    it("resolves a New York gap and overlap", () => {
        const zone = { defaultTimeZone: "America/New_York" };

        expect(
            parseIsoDateTime("2024-03-10T02:30:00", {
                ...zone,
                disambiguation: "compatible",
            })?.toISOString(),
        ).toBe("2024-03-10T07:30:00.000Z");
        expect(
            parseIsoDateTime("2024-03-10T02:30:00", {
                ...zone,
                disambiguation: "earlier",
            })?.toISOString(),
        ).toBe("2024-03-10T06:30:00.000Z");
        expect(
            parseIsoDateTime("2024-03-10T02:30:00", {
                ...zone,
                disambiguation: "reject",
            }),
        ).toBeUndefined();
        expect(
            parseIsoDateTime("2024-11-03T01:30:00", zone)?.toISOString(),
        ).toBe("2024-11-03T05:30:00.000Z");
        expect(
            parseIsoDateTime("2024-11-03T01:30:00", {
                ...zone,
                disambiguation: "later",
            })?.toISOString(),
        ).toBe("2024-11-03T06:30:00.000Z");
        expect(
            parseIsoDateTime("2024-09-08T00:00:00", {
                defaultTimeZone: "America/Santiago",
            })?.toISOString(),
        ).toBe("2024-09-08T04:00:00.000Z");
    });

    it("returns undefined for an impossible day or malformed text", () => {
        const rejected = [
            "",
            "2024-02-30T00:00:00Z",
            "2023-02-29T00:00:00Z",
            "1900-02-29T00:00:00Z",
            "2026-04-31T00:00:00Z",
            "2026-11-26T24:00:00Z",
            "2026-11-26 03:30:00Z",
            "2026-11-26T03:30:00+24:00",
            "not a date",
        ];

        for (const value of rejected) {
            expect(parseIsoDateTime(value)).toBeUndefined();
        }
    });

    it("throws when the text is not a string or disambiguation is unknown", () => {
        expect(() => parseIsoDateTime(1 as unknown as string)).toThrow(
            TypeError,
        );
        expect(() =>
            parseIsoDateTime("2026-11-26T00:00:00Z", {
                disambiguation: "soon" as "reject",
            }),
        ).toThrow(RangeError);
    });
});
