import { describe, expect, it } from "vitest";
import { isIBAN } from "./is-iban.js";
describe("isIBAN", () => {
    it("checks published examples", () => {
        expect(isIBAN("GB82WEST12345698765432")).toBe(true);
        expect(isIBAN("DE89370400440532013000")).toBe(true);
        expect(isIBAN("GB82WEST12345698765433")).toBe(false);
        expect(isIBAN("XX00")).toBe(false);
    });
});
