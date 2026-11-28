import { expect, it } from "vitest";
import { nonePass } from "../index.js";

it("returns true when no predicate returns true", () => {
    const passes = nonePass([(value: number) => value < 0]);
    expect(passes(4)).toBe(true);
    expect(passes(-1)).toBe(false);
    expect(nonePass<number>([])(1)).toBe(true);
});

it("stops at the first true", () => {
    const calls: string[] = [];
    const passes = nonePass<number>([
        () => {
            calls.push("first");
            return true;
        },
        () => {
            calls.push("second");
            return false;
        },
    ]);
    expect(passes(1)).toBe(false);
    expect(calls).toEqual(["first"]);
});

it("throws when the list is not an array of functions", () => {
    expect(() => nonePass(null as never)).toThrow(/nonePass requires an array/);
});
