import { describe, expect, it } from "vitest";
import { getDiceCoefficient } from "./get-dice-coefficient.js";
describe("getDiceCoefficient", () => {
    it("measures the pair", () => {
        expect(getDiceCoefficient({ first: "kitten", second: "kitten" })).toBe(
            1,
        );
        expect(
            getDiceCoefficient({ first: 1 as unknown as string, second: "a" }),
        ).toBeUndefined();
    });
});
