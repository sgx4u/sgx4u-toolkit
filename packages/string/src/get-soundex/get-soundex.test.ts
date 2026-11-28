import { describe, expect, it } from "vitest";
import { getSoundex } from "./get-soundex.js";
describe("getSoundex", () => {
    it("encodes the classic examples", () => {
        expect(getSoundex("Robert")).toBe("R163");
        expect(getSoundex("Rupert")).toBe("R163");
        expect(getSoundex("Ashcraft")).toBe("A261");
        expect(getSoundex("123")).toBeUndefined();
        expect(getSoundex(null)).toBeUndefined();
    });
});
