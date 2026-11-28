import { describe, expect, it } from "vitest";
import { formatCreditCardNumber } from "./format-credit-card-number.js";
describe("formatCreditCardNumber", () => {
    it("groups digits", () => {
        expect(formatCreditCardNumber("4242424242424242")).toBe(
            "4242 4242 4242 4242",
        );
        expect(formatCreditCardNumber("no")).toBeUndefined();
    });
});
