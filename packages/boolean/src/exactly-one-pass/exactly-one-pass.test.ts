import { expect, it } from "vitest";
import { exactlyOnePass } from "../index.js";

it("returns true only when one predicate returns true", () => {
    const passes = exactlyOnePass([
        (value: number) => value > 0,
        (value: number) => value > 10,
    ]);
    expect(passes(4)).toBe(true);
    expect(passes(12)).toBe(false);
    expect(passes(-1)).toBe(false);
    expect(exactlyOnePass<number>([])(1)).toBe(false);
});

it("stops once a second predicate returns true", () => {
    const calls: string[] = [];
    const passes = exactlyOnePass<number>([
        () => {
            calls.push("first");
            return true;
        },
        () => {
            calls.push("second");
            return true;
        },
        () => {
            calls.push("third");
            return true;
        },
    ]);
    expect(passes(1)).toBe(false);
    expect(calls).toEqual(["first", "second"]);
});

it("throws when an entry is not a function", () => {
    expect(() => exactlyOnePass([() => true, "no" as never])).toThrow(
        /Entry 1/,
    );
});
