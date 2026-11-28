import { describe, expect, it } from "vitest";
import { getMax } from "./get-max.js";

describe("getMax", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(getMax([])).toBeUndefined();
        expect(getMax({ array: [] })).toBeUndefined();
        expect(getMax(null as never)).toBeUndefined();
    });

    it("keeps the first item on a tie", () => {
        const first = { n: 2, id: "a" };
        const second = { n: 2, id: "b" };
        expect(getMax([1, 3, 2, 3])).toBe(3);
        expect(
            getMax({ array: [first, second, { n: 1, id: "c" }], by: "n" }),
        ).toBe(first);
    });

    it("compares non-numbers with >", () => {
        expect(getMax(["b", "a", "c"])).toBe("c");
    });
});
