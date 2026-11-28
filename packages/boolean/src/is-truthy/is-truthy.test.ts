import { expect, it } from "vitest";
import { isFalsy, isTruthy } from "../index.js";

it("is the opposite of isFalsy", () => {
    const values: readonly unknown[] = [
        false,
        true,
        0,
        -0,
        0n,
        1n,
        "",
        "false",
        null,
        undefined,
        Number.NaN,
        [],
        {},
        new Boolean(false),
        Symbol("value"),
    ];
    for (const value of values) {
        expect(isTruthy(value)).toBe(!isFalsy(value));
    }
});
