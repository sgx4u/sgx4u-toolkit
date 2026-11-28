import { expect, it } from "vitest";
import { listBooleanLocales } from "../index.js";

const expectedLocales = [
    "ar",
    "bn",
    "cs",
    "da",
    "de",
    "el",
    "en",
    "es",
    "fi",
    "fr",
    "gu",
    "he",
    "hi",
    "hu",
    "id",
    "it",
    "ja",
    "ko",
    "mr",
    "nb",
    "nl",
    "pa",
    "pl",
    "pt",
    "ro",
    "ru",
    "sv",
    "sw",
    "ta",
    "te",
    "th",
    "tr",
    "uk",
    "ur",
    "vi",
    "zh",
];

it("returns the language subtags, sorted, including English", () => {
    expect(listBooleanLocales()).toEqual(expectedLocales);
});

it("returns a new array each call", () => {
    const first = listBooleanLocales();
    first.push("zz");
    expect(listBooleanLocales()).toEqual(expectedLocales);
});
