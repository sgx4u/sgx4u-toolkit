import { describe, expect, it } from "vitest";
import { compareNatural } from "./compare-natural.js";
describe("compareNatural", () => {
    it("sorts digit runs numerically", () => {
        expect(
            compareNatural({ first: "a2", second: "a10", locale: "en-US" }),
        ).toBe(-1);
        expect(
            compareNatural({ first: 1 as unknown as string, second: "a" }),
        ).toBeUndefined();
    });
});
