import { describe, expect, it } from "vitest";
import { isJWT } from "./is-jwt.js";
describe("isJWT", () => {
    it("requires three parts", () => {
        expect(isJWT("eyJ.eyJ.sig")).toBe(true);
        expect(isJWT("a.b")).toBe(false);
        expect(isJWT(null)).toBe(false);
    });
});
