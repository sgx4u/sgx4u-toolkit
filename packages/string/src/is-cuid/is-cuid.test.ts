import { describe, expect, it } from "vitest";
import { isCUID } from "./is-cuid.js";
describe("isCUID", () => {
    it("checks the v1 shape", () => {
        expect(isCUID("cabcdefghijklmnopqrstuvwx")).toBe(true);
        expect(isCUID("abcdefghijklmnopqrstuvwx")).toBe(false);
    });
});
