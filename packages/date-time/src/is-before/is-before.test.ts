import { describe, expect, it } from "vitest";
import { isBefore } from "../index.js";

describe("isBefore", () => {
    it("is true only when the date is strictly earlier", () => {
        expect(
            isBefore({
                date: "2024-01-01T00:00:00Z",
                reference: "2024-01-02T00:00:00Z",
            }),
        ).toBe(true);
        expect(
            isBefore({
                date: "2024-01-01T00:00:00Z",
                reference: "2024-01-01T00:00:00Z",
            }),
        ).toBe(false);
        expect(
            isBefore({ date: "nope", reference: "2024-01-01T00:00:00Z" }),
        ).toBe(false);
    });
});