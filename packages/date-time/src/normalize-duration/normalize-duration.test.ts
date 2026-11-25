import { describe, expect, it } from "vitest";
import { normalizeDuration } from "../index.js";

describe("normalizeDuration", () => {
    it("carries 90 minutes into 1 hour and 30 minutes", () => {
        expect(normalizeDuration({ minutes: 90 })).toEqual({
            hours: 1,
            minutes: 30,
        });
        expect(normalizeDuration({ hours: 26 })).toEqual({ days: 1, hours: 2 });
        expect(normalizeDuration({ months: 1, minutes: 90 }).months).toBe(1);
    });
});
