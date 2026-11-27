import fc from "fast-check";
import { expect, it } from "vitest";
import { all, any, not } from "../index.js";

it("negates a primitive boolean and rejects anything else", () => {
    expect(not(true)).toBe(false);
    expect(not(false)).toBe(true);
    expect(not("true")).toBeUndefined();
    expect(not(1)).toBeUndefined();
    expect(not(null)).toBeUndefined();
    expect(not(new Boolean(true))).toBeUndefined();
});

it("satisfies De Morgan for lists of booleans", () => {
    fc.assert(
        fc.property(fc.array(fc.boolean(), { maxLength: 16 }), (values) => {
            const negated = values.map((value) => not(value));
            return not(all(values)) === any(negated);
        }),
    );
});
