import { expect, it } from "vitest";
import { exactlyOne } from "../index.js";

it("is true only when one entry is true", () => {
    expect(exactlyOne([])).toBe(false);
    expect(exactlyOne([true])).toBe(true);
    expect(exactlyOne([true, false])).toBe(true);
    expect(exactlyOne([true, true])).toBe(false);
    expect(exactlyOne([true, true, true])).toBe(false);
    expect(exactlyOne([false, false])).toBe(false);
});

it("returns undefined for a non-boolean and throws for a non-array", () => {
    expect(exactlyOne([true, 1])).toBeUndefined();
    expect(() => exactlyOne({ 0: true } as never)).toThrow(
        /exactlyOne requires an array/,
    );
});
