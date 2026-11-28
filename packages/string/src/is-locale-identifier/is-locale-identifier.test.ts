import { describe, expect, it } from "vitest";
import { isLocaleIdentifier } from "./is-locale-identifier.js";
describe("isLocaleIdentifier", () => {
    it("accepts BCP 47", () => {
        expect(isLocaleIdentifier("en-US")).toBe(true);
        expect(isLocaleIdentifier("en_US")).toBe(false);
        expect(isLocaleIdentifier("")).toBe(false);
        expect(isLocaleIdentifier("not a locale !!!")).toBe(false);
    });
});
