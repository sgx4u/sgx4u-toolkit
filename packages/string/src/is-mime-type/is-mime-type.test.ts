import { describe, expect, it } from "vitest";
import { isMimeType } from "./is-mime-type.js";
describe("isMimeType", () => {
    it("requires type/subtype", () => {
        expect(isMimeType("text/plain")).toBe(true);
        expect(isMimeType("text")).toBe(false);
    });
});
