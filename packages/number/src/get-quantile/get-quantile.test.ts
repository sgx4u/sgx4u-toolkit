import { describe, expect, it } from "vitest";
import { getQuantile } from "../index.js";

describe("getQuantile", () => {
    it("covers the documented behavior", () => {
        expect(getQuantile({ values: [1, 2, 3, 4], probability: 0.5 })).toBe(
            2.5,
        );
        expect(
            getQuantile({
                values: [1, 2, 3, 4],
                probability: 0.5,
                method: "inclusive",
            }),
        ).toBe(2.5);
        expect(
            getQuantile({
                values: [1, 2, 3, 4],
                probability: 0,
                method: "exclusive",
            }),
        ).toBeUndefined();
        expect(
            getQuantile({
                values: [10, 20, 30],
                probability: 0.5,
                method: "lower",
            }),
        ).toBe(20);
        expect(
            getQuantile({
                values: [10, 20, 30],
                probability: 0.5,
                method: "higher",
            }),
        ).toBe(20);
        expect(() => getQuantile({ values: [1], probability: 2 })).toThrow(
            RangeError,
        );
    });
});
