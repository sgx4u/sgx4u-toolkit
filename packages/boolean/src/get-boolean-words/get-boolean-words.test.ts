import { expect, it } from "vitest";
import { getBooleanWords } from "../index.js";

const englishTruthy = ["true", "t", "yes", "y", "on", "1", "enable", "enabled"];
const englishFalsy = [
    "false",
    "f",
    "no",
    "n",
    "off",
    "0",
    "disable",
    "disabled",
];

it("returns the full English lists for en and for a missing argument", () => {
    expect(getBooleanWords()).toEqual({
        truthy: englishTruthy,
        falsy: englishFalsy,
    });
    expect(getBooleanWords({ locale: "en", category: "all" })).toEqual({
        truthy: englishTruthy,
        falsy: englishFalsy,
    });
});

it("appends locale yes/no words after the English tokens", () => {
    const french = getBooleanWords({ locale: "fr" });
    expect(french.truthy).toEqual([...englishTruthy, "oui"]);
    expect(french.falsy).toEqual([...englishFalsy, "non"]);
    expect(getBooleanWords({ locale: "hi-IN" }).truthy).toEqual([
        ...englishTruthy,
        "हाँ",
        "हां",
        "जी",
    ]);
});

it("clears the side that was not requested", () => {
    expect(getBooleanWords({ locale: "fr", category: "truthy" })).toEqual({
        truthy: [...englishTruthy, "oui"],
        falsy: [],
    });
    expect(getBooleanWords({ locale: "fr", category: "falsy" })).toEqual({
        truthy: [],
        falsy: [...englishFalsy, "non"],
    });
});

it("returns only English tokens for an unknown language", () => {
    expect(getBooleanWords({ locale: "xx" })).toEqual({
        truthy: englishTruthy,
        falsy: englishFalsy,
    });
});

it("returns new arrays each call", () => {
    const first = getBooleanWords();
    first.truthy.push("extra");
    expect(getBooleanWords().truthy).toEqual(englishTruthy);
});

it("throws when the argument or an option has the wrong type", () => {
    expect(() => getBooleanWords(null as never)).toThrow(TypeError);
    expect(() => getBooleanWords("fr" as never)).toThrow(/requires an object/);
    expect(() => getBooleanWords([] as never)).toThrow(TypeError);
    expect(() => getBooleanWords({ locale: 1 as never })).toThrow(/locale/);
    expect(() => getBooleanWords({ category: "both" as never })).toThrow(
        /category/,
    );
});
