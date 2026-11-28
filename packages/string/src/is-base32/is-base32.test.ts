import { describe, expect, it } from "vitest";
import { isBase32 } from "./is-base32.js";
describe("isBase32", () => {
    it("accepts the alphabet", () => {
        expect(isBase32("MZXW6===")).toBe(true);
        expect(isBase32("018")).toBe(false);
    });
});
