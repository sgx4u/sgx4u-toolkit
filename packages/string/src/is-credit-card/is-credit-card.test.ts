import { describe, expect, it } from "vitest";
import { isCreditCard } from "./is-credit-card.js";
describe("isCreditCard", () => {
    it("accepts the Visa test number", () => {
        expect(isCreditCard("4242424242424242")).toBe(true);
        expect(isCreditCard("4242-4242-4242-4242")).toBe(true);
        expect(isCreditCard("4242424242424243")).toBe(false);
    });
});
