import { describe, expect, it } from "vitest";
import { getDoubleMetaphone } from "./get-double-metaphone.js";
describe("getDoubleMetaphone", () => {
    it("overlaps Smith and Schmidt", () => {
        expect(getDoubleMetaphone("Smith")).toEqual({
            primary: "SM0",
            secondary: "XMT",
        });
        expect(getDoubleMetaphone("Schmidt")).toEqual({
            primary: "XMT",
            secondary: "SMT",
        });
        expect(getDoubleMetaphone(null)).toBeUndefined();
    });
});
