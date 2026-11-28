import { describe, expect, it } from "vitest";
import { toTitleCase } from "./to-title-case.js";

describe("toTitleCase", () => {
    it("capitalizes words and keeps APA small words down", () => {
        expect(toTitleCase("the lord of the rings")).toBe(
            "The Lord Of The Rings",
        );
        expect(
            toTitleCase({ value: "the lord of the rings", style: "apa" }),
        ).toBe("The Lord of the Rings");
        expect(
            toTitleCase({ value: "a tale of two cities", style: "apa" }),
        ).toBe("A Tale of Two Cities");
        expect(
            toTitleCase({ value: "war and peace", style: "chicago" }),
        ).toContain("and");
        expect(toTitleCase("")).toBe("");
        expect(toTitleCase(null as unknown as string)).toBeUndefined();
        expect(() =>
            toTitleCase({ value: "a", style: "nope" as "apa" }),
        ).toThrow(RangeError);
    });
});
