import fc from "fast-check";
import { expect, it } from "vitest";
import { implies } from "../index.js";

it("matches material implication", () => {
    expect(implies({ antecedent: true, consequent: true })).toBe(true);
    expect(implies({ antecedent: true, consequent: false })).toBe(false);
    expect(implies({ antecedent: false, consequent: true })).toBe(true);
    expect(implies({ antecedent: false, consequent: false })).toBe(true);
    fc.assert(
        fc.property(fc.boolean(), fc.boolean(), (antecedent, consequent) => {
            return (
                implies({ antecedent, consequent }) ===
                (!antecedent || consequent)
            );
        }),
    );
});

it("returns undefined when either value is not a primitive boolean", () => {
    expect(implies({ antecedent: true, consequent: 1 })).toBeUndefined();
    expect(implies({ antecedent: "true", consequent: false })).toBeUndefined();
    expect(implies({ antecedent: true } as never)).toBeUndefined();
    expect(implies([] as never)).toBeUndefined();
});

it("throws when the argument is not an object", () => {
    expect(() => implies(null as never)).toThrow(TypeError);
    expect(() => implies(undefined as never)).toThrow(/requires an object/);
    expect(() => implies(true as never)).toThrow(TypeError);
});
