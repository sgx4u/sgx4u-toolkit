import { expect, it } from "vitest";
import { areEqual, xnor } from "../index.js";

it("is even parity, which is not the same as every entry matching", () => {
    expect(xnor([])).toBe(true);
    expect(xnor([true, true])).toBe(true);
    expect(xnor([true, false])).toBe(false);
    expect(xnor([true, true, true])).toBe(false);
    expect(areEqual([true, true, true])).toBe(true);
    expect(xnor([false, false, false])).toBe(true);
});

it("returns undefined for a non-boolean and throws for a non-array", () => {
    expect(xnor([false, 0])).toBeUndefined();
    expect(() => xnor(null as never)).toThrow(TypeError);
});
