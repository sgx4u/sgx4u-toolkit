import { expect, it } from "vitest";
import { isParseableBoolean } from "../index.js";

it("is true only when the value would parse to a boolean", () => {
    expect(isParseableBoolean(true)).toBe(true);
    expect(isParseableBoolean(false)).toBe(true);
    expect(isParseableBoolean(0)).toBe(true);
    expect(isParseableBoolean(-0)).toBe(true);
    expect(isParseableBoolean(" YES ")).toBe(true);
    expect(isParseableBoolean({ value: "oui", locale: "fr" })).toBe(true);
    expect(isParseableBoolean("maybe")).toBe(false);
    expect(isParseableBoolean(2)).toBe(false);
    expect(isParseableBoolean(new Boolean(true))).toBe(false);
    expect(isParseableBoolean(null)).toBe(false);
});

it("ignores fallback and still throws for a bad option", () => {
    expect(
        isParseableBoolean({ value: "maybe", fallback: true } as never),
    ).toBe(false);
    expect(() =>
        isParseableBoolean({ value: "yes", lenient: "yes" as never }),
    ).toThrow(TypeError);
    expect(() =>
        isParseableBoolean({ value: "yes", truthyWords: ["no"] }),
    ).toThrow(RangeError);
});
