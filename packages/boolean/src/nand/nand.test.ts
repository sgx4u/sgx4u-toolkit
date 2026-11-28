import { expect, it } from "vitest";
import { nand } from "../index.js";

it("is the negation of all", () => {
    expect(nand([])).toBe(false);
    expect(nand([true, true])).toBe(false);
    expect(nand([true, false])).toBe(true);
    expect(nand([false])).toBe(true);
});

it("returns undefined for a non-boolean and throws for a non-array", () => {
    expect(nand([true, 0])).toBeUndefined();
    expect(() => nand(undefined as never)).toThrow(/nand requires an array/);
});
