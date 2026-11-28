import { describe, expect, it } from "vitest";
import { isAfter } from "../index.js";

describe("isAfter", () => {
    it("is true only when the date is strictly later", () => {
        expect(
            isAfter({
                date: "2024-01-02T00:00:00Z",
                reference: "2024-01-01T00:00:00Z",
            }),
        ).toBe(true);
        expect(
            isAfter({
                date: "2024-01-01T00:00:00Z",
                reference: "2024-01-01T00:00:00Z",
            }),
        ).toBe(false);
    });

    it("returns false when either value is not a real date", () => {
        expect(
            isAfter({ date: "not-a-date", reference: "2024-01-01T00:00:00Z" }),
        ).toBe(false);
        expect(
            isAfter({ date: "2024-01-01T00:00:00Z", reference: Number.NaN }),
        ).toBe(false);
    });
});
