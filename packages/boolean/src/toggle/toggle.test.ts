import { expect, it } from "vitest";
import { not, toggle } from "../index.js";

it("matches not for booleans and for other values", () => {
    const values: readonly unknown[] = [
        true,
        false,
        "true",
        0,
        null,
        undefined,
        new Boolean(false),
    ];
    for (const value of values) {
        expect(toggle(value)).toBe(not(value));
    }
});
