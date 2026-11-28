import { describe, expect, it } from "vitest";
import { maskCreditCard } from "./mask-credit-card.js";
describe("maskCreditCard", () => {
    it("keeps the last digits and the separators", () => {
        expect(maskCreditCard("4242 4242 4242 4242")).toBe(
            "**** **** **** 4242",
        );
        expect(maskCreditCard("no digits")).toBeUndefined();
    });
});
