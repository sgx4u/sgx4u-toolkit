import { expect, it } from "vitest";
import { negate } from "../index.js";

it("returns the opposite of the predicate", () => {
    const negative = negate((value: number) => value > 0);
    expect(negative(-1)).toBe(true);
    expect(negative(2)).toBe(false);
});

it("propagates a throw and rejects a non-function", () => {
    const exploding = negate(() => {
        throw new Error("boom");
    });
    expect(() => exploding(1)).toThrow("boom");
    expect(() => negate(true as never)).toThrow(/predicate must be a function/);
});
