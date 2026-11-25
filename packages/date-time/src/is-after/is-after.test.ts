import { describe, expect, it } from "vitest";
import { isAfter } from "../index.js";

describe("isAfter", () => {
    it("is true only when the date is strictly later", () => {
        expect(isAfter("2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z")).toBe(
            true,
        );
        expect(isAfter("2024-01-01T00:00:00Z", "2024-01-01T00:00:00Z")).toBe(
            false,
        );
    });
});
