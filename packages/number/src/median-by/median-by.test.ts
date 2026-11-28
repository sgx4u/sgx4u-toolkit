import { describe, expect, it } from "vitest";
import { medianBy } from "../index.js";

describe("medianBy", () => {
    it("covers the documented behavior", () => {
        expect(medianBy({ values: [3, 1, 2], iteratee: (item) => item })).toBe(
            2,
        );
    });
});
