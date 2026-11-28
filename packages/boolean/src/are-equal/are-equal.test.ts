import { expect, it } from "vitest";
import { areEqual } from "../index.js";

it("is true when every entry is the same boolean", () => {
    expect(areEqual([])).toBe(true);
    expect(areEqual([true])).toBe(true);
    expect(areEqual([false])).toBe(true);
    expect(areEqual([true, true, true])).toBe(true);
    expect(areEqual([false, false])).toBe(true);
    expect(areEqual([true, false])).toBe(false);
});

it("returns undefined for a non-boolean and throws for a non-array", () => {
    expect(areEqual([true, "true"])).toBeUndefined();
    expect(() => areEqual(new Boolean(true) as never)).toThrow(TypeError);
});
