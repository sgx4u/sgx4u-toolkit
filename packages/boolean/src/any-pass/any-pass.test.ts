import { expect, it } from "vitest";
import { anyPass } from "../index.js";

it("returns true when any predicate returns true", () => {
    const passes = anyPass([
        (value: number) => value < 0,
        (value: number) => value > 10,
    ]);
    expect(passes(12)).toBe(true);
    expect(passes(4)).toBe(false);
    expect(anyPass<number>([])(1)).toBe(false);
});

it("stops at the first true", () => {
    const calls: string[] = [];
    const passes = anyPass<number>([
        () => {
            calls.push("first");
            return true;
        },
        () => {
            calls.push("second");
            return false;
        },
    ]);
    expect(passes(1)).toBe(true);
    expect(calls).toEqual(["first"]);
});

it("throws when an entry is not a function", () => {
    expect(() => anyPass("no" as never)).toThrow(TypeError);
    expect(() => anyPass([1 as never])).toThrow(/Entry 0/);
});
