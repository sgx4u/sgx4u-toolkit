import { describe, expect, it } from "vitest";
import { toCapitalCase } from "./to-capital-case.js";

describe("toCapitalCase", () => {
    it("converts words", () => {
        expect(toCapitalCase("fooBar")).toBe("Foo Bar");
        expect(toCapitalCase("")).toBe("");
        expect(toCapitalCase(null as unknown as string)).toBeUndefined();
    });
});
