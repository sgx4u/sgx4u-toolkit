import fc from "fast-check";
import { expect, it } from "vitest";
import { countTrue, exactlyOne, xor } from "../index.js";

it("is true for an odd number of trues, which is not exactly one", () => {
    expect(xor([])).toBe(false);
    expect(xor([true])).toBe(true);
    expect(xor([true, false])).toBe(true);
    expect(xor([true, true])).toBe(false);
    expect(xor([true, true, true])).toBe(true);
    expect(exactlyOne([true, true, true])).toBe(false);
});

it("returns undefined for a non-boolean and throws for a non-array", () => {
    expect(xor([true, "true"])).toBeUndefined();
    expect(() => xor({} as never)).toThrow(/xor requires an array/);
});

it("matches the parity of countTrue", () => {
    fc.assert(
        fc.property(
            fc.array(
                fc.oneof(
                    fc.boolean(),
                    fc.string(),
                    fc.integer(),
                    fc.constant(null),
                ),
                { maxLength: 12 },
            ),
            (values) => {
                const count = countTrue(values);
                const parity = xor(values);
                if (count === undefined) {
                    return parity === undefined;
                }
                return parity === (count % 2 === 1);
            },
        ),
    );
});
