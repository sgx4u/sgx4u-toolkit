import { expect, it } from "vitest";
import { none } from "../index.js";

it("is true when no entry is true", () => {
    expect(none([])).toBe(true);
    expect(none([false])).toBe(true);
    expect(none([false, true])).toBe(false);
});

it("returns undefined for a non-boolean and throws for a non-array", () => {
    expect(none([false, null])).toBeUndefined();
    expect(() => none(false as never)).toThrow(/none requires an array/);
});
