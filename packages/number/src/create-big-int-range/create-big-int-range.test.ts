import { describe, expect, it } from "vitest";
import { createBigIntRange } from "../index.js";

describe("createBigIntRange", () => {
    it("covers the documented behavior", () => {
        expect(createBigIntRange({ start: 0n, end: 3n })).toEqual([0n, 1n, 2n]);
        expect(createBigIntRange({ start: 3n, end: 0n, step: -1n })).toEqual([
            3n,
            2n,
            1n,
        ]);
        expect(() =>
            createBigIntRange({ start: 0n, end: 2n, step: 0n }),
        ).toThrow(RangeError);
        expect(() =>
            createBigIntRange({ start: 0n, end: 2n, step: -1n }),
        ).toThrow(RangeError);
    });
});
