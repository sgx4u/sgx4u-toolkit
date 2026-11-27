import { describe, expect, it } from "vitest";
import { sumBy } from "../index.js";

describe("sumBy", () => {
    it("covers the documented behavior", () => {
        expect(
            sumBy({ values: [{ n: 1 }, { n: 2 }], iteratee: (item) => item.n }),
        ).toBe(3);
        expect(
            sumBy({ values: [1], iteratee: () => Number.NaN }),
        ).toBeUndefined();
    });
});
