import { describe, expect, it } from "vitest";
import { getMetaphone } from "./get-metaphone.js";
describe("getMetaphone", () => {
    it("encodes Smith, Robert, and Rupert", () => {
        expect(getMetaphone("Smith")).toBe("SM0");
        expect(getMetaphone("Robert")).toBe("RBRT");
        expect(getMetaphone("Rupert")).toBe("RPRT");
        expect(getMetaphone("")).toBeUndefined();
    });
});
