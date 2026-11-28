import { describe, expect, it } from "vitest";
import { isPlural } from "../is-plural/is-plural.js";
import { isSingular } from "../is-singular/is-singular.js";
import { singularize } from "../singularize/singularize.js";
import { pluralize } from "./pluralize.js";

const nounPairs = [
    ["cat", "cats"],
    ["city", "cities"],
    ["bus", "buses"],
    ["person", "people"],
    ["child", "children"],
    ["mouse", "mice"],
    ["goose", "geese"],
    ["foot", "feet"],
    ["tooth", "teeth"],
    ["man", "men"],
    ["woman", "women"],
    ["datum", "data"],
    ["index", "indexes"],
    ["octopus", "octopuses"],
] as const;

const uncountableNouns = [
    "sheep",
    "series",
    "species",
    "information",
    "rice",
    "money",
    "news",
] as const;

describe("pluralize", () => {
    it.each(nounPairs)(
        "inflects %s and %s and round-trips",
        (singular, plural) => {
            expect(pluralize(singular)).toBe(plural);
            expect(pluralize({ value: singular, count: 2 })).toBe(plural);
            expect(pluralize({ value: singular, count: 1 })).toBe(singular);
            expect(pluralize({ value: plural, count: 1 })).toBe(singular);
            expect(singularize(pluralize(singular))).toBe(singular);
            expect(pluralize(singularize(plural))).toBe(plural);
            expect(isPlural(plural)).toBe(true);
            expect(isSingular(plural)).toBe(false);
            expect(isPlural(singular)).toBe(false);
            expect(isSingular(singular)).toBe(true);
        },
    );

    it.each(uncountableNouns)(
        "keeps uncountable %s and treats it as both",
        (noun) => {
            expect(pluralize(noun)).toBe(noun);
            expect(pluralize({ value: noun, count: 1 })).toBe(noun);
            expect(singularize(pluralize(noun))).toBe(noun);
            expect(pluralize(singularize(noun))).toBe(noun);
            expect(isPlural(noun)).toBe(true);
            expect(isSingular(noun)).toBe(true);
        },
    );

    it("rejects a non-English locale and a bad count", () => {
        expect(() => pluralize({ value: "cat", locale: "fr" })).toThrow(
            RangeError,
        );
        expect(() => pluralize({ value: "cat", count: "2" as never })).toThrow(
            TypeError,
        );
        expect(() =>
            pluralize({ value: "cat", count: Number.POSITIVE_INFINITY }),
        ).toThrow(RangeError);
    });

    it("returns undefined for a non-string and keeps an empty string", () => {
        expect(pluralize("")).toBe("");
        expect(pluralize(1 as never)).toBeUndefined();
        expect(isPlural("")).toBe(false);
        expect(isSingular("")).toBe(false);
        expect(isPlural(1 as never)).toBe(false);
    });
});
