import { describe, expect, it } from "vitest";
import { isISSN } from "./is-issn.js";
describe("isISSN", () => {
    it("checks the checksum", () => {
        expect(isISSN("0378-5955")).toBe(true);
        expect(isISSN("0378-5954")).toBe(false);
    });
});
