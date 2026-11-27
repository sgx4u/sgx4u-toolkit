import { expect, it } from "vitest";
import { nor } from "../index.js";

it("is the negation of any", () => {
    expect(nor([])).toBe(true);
    expect(nor([false, false])).toBe(true);
    expect(nor([false, true])).toBe(false);
});

it("returns undefined for a non-boolean and throws for a non-array", () => {
    expect(nor([false, ""])).toBeUndefined();
    expect(() => nor([] as never)).not.toThrow();
    expect(() => nor("" as never)).toThrow(/nor requires an array/);
});
