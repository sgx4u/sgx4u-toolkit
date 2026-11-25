import { describe, expect, it } from "vitest";
import { isBefore } from "../index.js";

describe("isBefore", () => {
    it("is true only when the date is strictly earlier", () => {
        expect(isBefore("2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z")).toBe(
            true,
        );
        expect(isBefore("2024-01-01T00:00:00Z", "2024-01-01T00:00:00Z")).toBe(
            false,
        );
        expect(() => isBefore("nope", "2024-01-01T00:00:00Z")).toThrow(
            RangeError,
        );
    });
});
