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
