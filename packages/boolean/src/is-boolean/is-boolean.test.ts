import { expect, expectTypeOf, it } from "vitest";
import { isBoolean } from "../index.js";

it("accepts only primitive booleans", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    const value: unknown = true;
    if (isBoolean(value)) {
        expectTypeOf(value).toEqualTypeOf<boolean>();
    }
});

it("rejects boxed booleans and other values", () => {
    const rejected: readonly unknown[] = [
        new Boolean(true),
        new Boolean(false),
        "true",
        "false",
        0,
        1,
        null,
        undefined,
        Number.NaN,
        {},
        [],
        0n,
        Symbol("true"),
    ];
    for (const value of rejected) {
        expect(isBoolean(value)).toBe(false);
    }
});
