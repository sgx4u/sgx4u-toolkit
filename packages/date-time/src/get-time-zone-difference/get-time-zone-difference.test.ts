import { describe, expect, it } from "vitest";
import { getTimeZoneDifference } from "../index.js";

describe("getTimeZoneDifference", () => {
    it("reports that Kolkata is 330 minutes ahead of UTC", () => {
        expect(
            getTimeZoneDifference("Asia/Kolkata", "UTC", {
                at: "2026-01-01T00:00:00Z",
            }),
        ).toBe(330);
    });

    it("is zero for one zone and changes New York at the spring-forward", () => {
        expect(
            getTimeZoneDifference("UTC", "UTC", { at: "2026-01-15T00:00:00Z" }),
        ).toBe(0);
        expect(
            getTimeZoneDifference("America/New_York", "UTC", {
                at: "2024-03-10T06:59:59.000Z",
            }),
        ).toBe(-300);
        expect(
            getTimeZoneDifference("America/New_York", "UTC", {
                at: "2024-03-10T07:00:00.000Z",
            }),
        ).toBe(-240);
        expect(
            getTimeZoneDifference("America/New_York", "Asia/Kolkata", {
                at: "2026-01-15T00:00:00Z",
            }),
        ).toBe(-630);
    });

    it("rejects an unknown zone or an instant that is not real", () => {
        expect(() =>
            getTimeZoneDifference("Mars/Base", "UTC", {
                at: "2026-01-15T00:00:00Z",
            }),
        ).toThrow(RangeError);
        expect(() =>
            getTimeZoneDifference("Mars/Base", "UTC", {
                at: "2026-01-15T00:00:00Z",
            }),
        ).toThrow("`firstTimeZone`");
        expect(() =>
            getTimeZoneDifference("UTC", "Mars/Base", {
                at: "2026-01-15T00:00:00Z",
            }),
        ).toThrow("`secondTimeZone`");
        expect(() => getTimeZoneDifference(5, "UTC")).toThrow(TypeError);
        expect(() => getTimeZoneDifference(5, "UTC")).toThrow(
            "`firstTimeZone`",
        );
        expect(() =>
            getTimeZoneDifference("UTC", "UTC", { at: "nope" }),
        ).toThrow("`at`");
    });

    it("reads the current offsets when at is omitted", () => {
        expect(getTimeZoneDifference("UTC", "UTC")).toBe(0);
        expect(getTimeZoneDifference("+05:30", "UTC")).toBe(330);
    });

    it("moves New York from 300 minutes behind UTC to 240 in July", () => {
        expect(
            getTimeZoneDifference("America/New_York", "UTC", {
                at: "2026-01-15T17:00:00Z",
            }),
        ).toBe(-300);
        expect(
            getTimeZoneDifference("America/New_York", "UTC", {
                at: "2026-07-15T16:00:00Z",
            }),
        ).toBe(-240);
        expect(
            getTimeZoneDifference("Asia/Kolkata", "UTC", {
                at: "2026-01-15T00:00:00Z",
            }),
        ).toBe(330);
        expect(
            getTimeZoneDifference("Asia/Kolkata", "UTC", {
                at: "2026-07-15T00:00:00Z",
            }),
        ).toBe(330);
    });
});
