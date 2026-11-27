import { expect, it } from "vitest";
import { allPass } from "../index.js";

it("returns true only when every predicate returns true", () => {
    const passes = allPass([
        (value: number) => value > 0,
        (value: number) => value < 10,
    ]);
    expect(passes(4)).toBe(true);
    expect(passes(12)).toBe(false);
    expect(allPass<number>([])(1)).toBe(true);
});

it("stops at the first false and lets a predicate throw", () => {
    const calls: string[] = [];
    const passes = allPass<number>([
        (value) => {
            calls.push(`first:${value}`);
            return false;
        },
        () => {
            calls.push("second");
            return true;
        },
    ]);
    expect(passes(1)).toBe(false);
    expect(calls).toEqual(["first:1"]);
    const exploding = allPass([
        () => {
            throw new Error("boom");
        },
    ]);
    expect(() => exploding(1)).toThrow("boom");
});

it("throws when the list or an entry is not a function", () => {
    expect(() => allPass(undefined as never)).toThrow(
        /allPass requires an array/,
    );
    expect(() =>
        allPass([((value: number) => value > 0) as never, true as never]),
    ).toThrow(/Entry 1/);
});
