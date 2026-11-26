import { describe, expect, it } from "vitest";
import { listTimeZones } from "../index.js";

describe("listTimeZones", () => {
    it("returns the runtime's IANA zones, including Africa/Abidjan", () => {
        const zones = listTimeZones();

        expect(Array.isArray(zones)).toBe(true);
        expect(zones).toContain("Africa/Abidjan");
        expect(zones.every((zone) => typeof zone === "string")).toBe(true);
        expect(new Set(zones).size).toBe(zones.length);
    });

    it("returns an empty list when the runtime cannot enumerate zones", () => {
        const intl = Intl as unknown as {
            supportedValuesOf?: (key: "timeZone") => string[];
        };
        const original = intl.supportedValuesOf;

        intl.supportedValuesOf = undefined;
        try {
            expect(listTimeZones()).toEqual([]);
        } finally {
            intl.supportedValuesOf = original;
        }
    });
});
