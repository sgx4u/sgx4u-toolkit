import { describe, expect, it } from "vitest";
import { getMoonPhase } from "../astronomy.js";

describe("getMoonPhase", () => {
    it("is a new moon at the reference instant and stays inside the cycle", () => {
        const phase = getMoonPhase("2000-01-06T18:14:00.000Z");
        expect(phase?.name).toBe("new-moon");
        expect(phase?.fraction).toBe(0);
        const later = getMoonPhase("2000-01-21T12:00:00.000Z");
        expect(later?.fraction).toBeGreaterThanOrEqual(0);
        expect(later?.fraction).toBeLessThan(1);
        expect(later?.name).toBe("full-moon");
    });
});
