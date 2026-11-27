import { expect, it } from "vitest";
import { isFalsy } from "../index.js";

it("matches JavaScript falsy values", () => {
    const falsy: readonly unknown[] = [
        false,
        0,
        -0,
        0n,
        "",
        null,
        undefined,
        Number.NaN,
    ];
    for (const value of falsy) {
        expect(isFalsy(value)).toBe(true);
    }
});

it("rejects truthy values, including boxed booleans and the string false", () => {
    const truthy: readonly unknown[] = [
        true,
        1,
        "false",
        "0",
        [],
        {},
        new Boolean(false),
        Symbol("value"),
        1n,
    ];
    for (const value of truthy) {
        expect(isFalsy(value)).toBe(false);
    }
});
