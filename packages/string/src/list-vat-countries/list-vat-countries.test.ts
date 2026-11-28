import { describe, expect, it } from "vitest";
import { listVATCountries } from "./list-vat-countries.js";

describe("listVATCountries", () => {
    it("returns the checksum countries and the pattern countries", () => {
        const countries = listVATCountries();
        expect(countries).toEqual([...countries].sort());
        expect(countries).toContain("BE");
        expect(countries).toContain("GB");
        expect(countries).toContain("NL");
        expect(countries).toContain("EL");
        expect(countries).toContain("XI");
    });
});

describe("unicode and invalid input", () => {
    it("returns a list", () => {
        expect(Array.isArray(listVATCountries())).toBe(true);
    });
});
