import { describe, expect, it } from "vitest";
import { isMailtoURI } from "./is-mailto-uri.js";
describe("isMailtoURI", () => {
    it("requires an address", () => {
        expect(isMailtoURI("mailto:a@b.co")).toBe(true);
        expect(isMailtoURI("mailto:")).toBe(false);
    });
});
