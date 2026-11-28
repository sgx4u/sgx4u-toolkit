import { describe, expect, it } from "vitest";
import { getMin } from "./get-min.js";

describe("getMin", () => {
    it("returns undefined for an empty array or a non-array", () => {
        expect(getMin([])).toBeUndefined();
        expect(getMin({ array: [] })).toBeUndefined();
        expect(getMin("no" as never)).toBeUndefined();
    });

    it("keeps the first item on a tie", () => {
        const first = { n: 1, id: "a" };
        const second = { n: 1, id: "b" };
        const third = { n: 2, id: "c" };
        expect(getMin([3, 1, 2, 1])).toBe(1);
        expect(getMin({ array: [first, second, third], by: "n" })).toBe(first);
    });

    it("compares non-numbers with < and does not throw", () => {
        const values = Object.freeze(["b", "a", "c"]);
        expect(getMin(values)).toBe("a");
        expect(values).toEqual(["b", "a", "c"]);
    });

    it("throws when by is set and a value is not finite", () => {
        expect(() => getMin({ array: ["a"], by: "n" })).toThrow(TypeError);
    });
});
