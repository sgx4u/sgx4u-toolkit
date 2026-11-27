import { describe, expect, it } from "vitest";
import { getTail } from "./get-tail.js";

function* oneNumber(): Generator<number> {
    yield 1;
}

describe("getTail", () => {
    it("returns every item except the first", () => {
        const input = Object.freeze([1, 2, 3]);
        const result = getTail(input);

        expect(result).toEqual([2, 3]);
        expect(result).not.toBe(input);
        expect(getTail([1])).toEqual([]);
        expect(getTail([])).toEqual([]);
        expect(input).toEqual([1, 2, 3]);
    });

    it("copies a hole as undefined", () => {
        const sparse: number[] = [];
        sparse[0] = 1;
        sparse[2] = 3;
        expect(getTail(sparse)).toEqual([undefined, 3]);
    });

    it("returns undefined for invalid input", () => {
        expect(getTail(null)).toBeUndefined();
        expect(getTail({})).toBeUndefined();
        expect(getTail("text")).toBeUndefined();
        expect(getTail(new Uint8Array([1]))).toBeUndefined();
        expect(getTail(new Set([1]))).toBeUndefined();
        expect(getTail(oneNumber())).toBeUndefined();
    });
});
