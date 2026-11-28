import { describe, expect, it } from "vitest";
import { listPostalCodeCountries } from "./list-postal-code-countries.js";

describe("listPostalCodeCountries", () => {
    it("returns sorted country codes", () => {
        const countries = listPostalCodeCountries();
        expect(countries).toContain("US");
        expect(countries).toContain("DE");
        expect(countries).toContain("GB");
        expect(countries).toEqual([...countries].sort());
    });
});

describe("unicode and invalid input", () => {
    it("returns a list", () => {
        expect(Array.isArray(listPostalCodeCountries())).toBe(true);
    });
});
