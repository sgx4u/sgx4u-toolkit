import { describe, expect, it } from "vitest";
import { getSunTimes } from "../astronomy.js";

describe("getSunTimes", () => {
    it("puts sunrise before solar noon and sunset after it on the equator", () => {
        const times = getSunTimes(
            "2024-03-20T12:00:00Z",
            { latitude: 0, longitude: 0 },
            { timeZone: "UTC" },
        );
        expect(times.sunrise).toBeDefined();
        expect(times.sunset).toBeDefined();
        expect(times.civilDawn).toBeDefined();
        expect(times.civilDusk).toBeDefined();
        const sunrise = times.sunrise?.getTime() ?? 0;
        const sunset = times.sunset?.getTime() ?? 0;
        expect(sunrise).toBeLessThan(times.solarNoon.getTime());
        expect(sunset).toBeGreaterThan(times.solarNoon.getTime());
        expect(times.civilDawn?.getTime() ?? 0).toBeLessThan(sunrise);
        expect(
            Math.abs(sunrise - Date.parse("2024-03-20T06:04:00Z")),
        ).toBeLessThan(60_000);
        expect(
            Math.abs(
                times.solarNoon.getTime() - Date.parse("2024-03-20T12:07:27Z"),
            ),
        ).toBeLessThan(60_000);
    });

    it("omits sunrise during polar night", () => {
        const times = getSunTimes(
            "2024-12-21T12:00:00Z",
            { latitude: 80, longitude: 0 },
            { timeZone: "UTC" },
        );
        expect(times.sunrise).toBeUndefined();
        expect(times.sunset).toBeUndefined();
        expect(times.solarNoon).toBeInstanceOf(Date);
    });
});
