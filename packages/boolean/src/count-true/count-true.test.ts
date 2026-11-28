import { expect, it } from "vitest";
import { countTrue } from "../index.js";

it("counts true entries", () => {
    expect(countTrue([])).toBe(0);
    expect(countTrue([false, false])).toBe(0);
    expect(countTrue([true, false, true])).toBe(2);
});

it("returns undefined for a non-boolean and throws for a non-array", () => {
    expect(countTrue([true, 1])).toBeUndefined();
    expect(() => countTrue(new Set([true]) as never)).toThrow(
        /countTrue requires an array/,
    );
});
