import { expect, it } from "vitest";
import { impliesPass } from "../index.js";

it("skips the consequent when the antecedent is false", () => {
    const calls: string[] = [];
    const passes = impliesPass<number>({
        antecedent: (value) => {
            calls.push(`antecedent:${value}`);
            return value > 0;
        },
        consequent: (value) => {
            calls.push(`consequent:${value}`);
            return value < 10;
        },
    });
    expect(passes(4)).toBe(true);
    expect(passes(-1)).toBe(true);
    expect(passes(12)).toBe(false);
    expect(calls).toEqual([
        "antecedent:4",
        "consequent:4",
        "antecedent:-1",
        "antecedent:12",
        "consequent:12",
    ]);
});

it("throws when the argument or either predicate is not a function", () => {
    expect(() => impliesPass(null as never)).toThrow(/requires an object/);
    expect(() => impliesPass(true as never)).toThrow(TypeError);
    expect(() =>
        impliesPass({ antecedent: true, consequent: () => true } as never),
    ).toThrow(/antecedent must be a function/);
    expect(() =>
        impliesPass({ antecedent: () => true, consequent: false } as never),
    ).toThrow(/consequent must be a function/);
    expect(() => impliesPass([] as never)).toThrow(
        /antecedent must be a function/,
    );
});
