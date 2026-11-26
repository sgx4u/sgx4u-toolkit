import { describe, expect, it } from "vitest";
import { sortDates } from "../index.js";

describe("sortDates", () => {
    it("returns a new array and leaves the input in place", () => {
        const dates = ["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"];
        expect(
            sortDates({ dates })?.map((date) => date.toISOString()),
        ).toEqual(["2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z"]);
        expect(dates[0]).toBe("2024-01-02T00:00:00Z");
        expect(
            sortDates({ dates, order: "descending" })?.[0]?.toISOString(),
        ).toBe("2024-01-02T00:00:00.000Z");
        expect(sortDates({ dates: "not-array" as unknown as string[] })).toBe(
            undefined,
        );
    });
});