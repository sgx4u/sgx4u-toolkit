import { describe, expect, it } from "vitest";
import { meanBy } from "../index.js";

describe("meanBy", () => {
    it("covers the documented behavior", () => {
        expect(meanBy({ values: [1, 3], iteratee: (item) => item })).toBe(2);
        expect(
            meanBy({ values: [], iteratee: (item: number) => item }),
        ).toBeUndefined();
    });
});
