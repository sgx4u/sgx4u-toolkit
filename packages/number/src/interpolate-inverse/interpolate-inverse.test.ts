import { describe, expect, it } from "vitest";
import { interpolateInverse } from "../index.js";

describe("interpolateInverse", () => {
    it("covers the documented behavior", () => {
        expect(interpolateInverse({ start: 0, end: 10, value: 5 })).toBe(0.5);
        expect(interpolateInverse({ start: 2, end: 2, value: 2 })).toBe(0);
        expect(
            interpolateInverse({ start: 2, end: 2, value: 3 }),
        ).toBeUndefined();
    });
});
