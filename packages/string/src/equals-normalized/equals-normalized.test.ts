import { describe, expect, it } from "vitest";
import { equalsNormalized } from "./equals-normalized.js";
describe("equalsNormalized", () => {
    it("normalizes before comparing", () => {
        expect(equalsNormalized({ first: "é", second: "e\u0301" })).toBe(true);
        expect(equalsNormalized({ first: "a", second: "b" })).toBe(false);
        expect(
            equalsNormalized({ first: 1 as unknown as string, second: "a" }),
        ).toBe(false);
    });
});
