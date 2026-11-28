import { expect, it } from "vitest";
import { all } from "../index.js";

it("is true when every entry is true, including an empty list", () => {
    expect(all([])).toBe(true);
    expect(all([true])).toBe(true);
    expect(all([true, true])).toBe(true);
    expect(all([true, false])).toBe(false);
    expect(all([false])).toBe(false);
});

it("returns undefined for a non-boolean, including a hole, and does not mutate", () => {
    const values = [true, false];
    expect(all([true, 1])).toBeUndefined();
    expect(all([new Boolean(true)])).toBeUndefined();
    const sparse = [true, false, false];
    delete sparse[1];
    expect(all(sparse)).toBeUndefined();
    all(values);
    expect(values).toEqual([true, false]);
});

it("throws when values is not an array", () => {
    expect(() => all(null as never)).toThrow(/all requires an array/);
    expect(() => all(undefined as never)).toThrow(TypeError);
    expect(() => all("true" as never)).toThrow(TypeError);
    expect(() => all({ length: 1, 0: true } as never)).toThrow(TypeError);
});
