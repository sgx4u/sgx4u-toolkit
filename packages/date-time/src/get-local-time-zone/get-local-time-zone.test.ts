import { describe, expect, it } from "vitest";
import { getLocalTimeZone } from "../index.js";

describe("getLocalTimeZone", () => {
    it("returns the zone Intl reports on this call", () => {
        expect(getLocalTimeZone()).toBe(
            new Intl.DateTimeFormat().resolvedOptions().timeZone,
        );
    });

    it("returns a non-empty string", () => {
        expect(getLocalTimeZone().length).toBeGreaterThan(0);
    });
});
