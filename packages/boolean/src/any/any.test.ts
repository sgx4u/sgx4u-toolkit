import { expect, it } from "vitest";
import { any } from "../index.js";

it("is true when any entry is true", () => {
    expect(any([])).toBe(false);
    expect(any([false, false])).toBe(false);
    expect(any([false, true])).toBe(true);
});

it("returns undefined for a non-boolean and throws for a non-array", () => {
    expect(any([false, "true"])).toBeUndefined();
    const values = [false];
    any(values);
    expect(values).toEqual([false]);
    expect(() => any(1 as never)).toThrow(/any requires an array/);
});
