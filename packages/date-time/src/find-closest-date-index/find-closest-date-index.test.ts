import { describe, expect, it } from "vitest";
import { findClosestDateIndex } from "../index.js";

describe("findClosestDateIndex", () => {
    it("returns -1 for an empty list", () => {
        expect(
            findClosestDateIndex({
                target: "2024-01-01T12:00:00Z",
                candidates: [],
            }),
        ).toBe(-1);
        expect(
            findClosestDateIndex({
                target: "2024-01-01T12:00:00Z",
                candidates: ["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"],
            }),
        ).toBe(1);
    });

    it("returns undefined for invalid input", () => {
        expect(
            findClosestDateIndex({
                target: "nope",
                candidates: ["2024-01-01T00:00:00Z"],
            }),
        ).toBeUndefined();
        expect(
            findClosestDateIndex({
                target: "2024-01-01T12:00:00Z",
                candidates: "x" as unknown as string[],
            }),
        ).toBeUndefined();
    });
});
