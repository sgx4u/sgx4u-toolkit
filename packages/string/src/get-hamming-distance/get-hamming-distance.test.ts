import { describe, expect, it } from "vitest";
import { getHammingDistance } from "./get-hamming-distance.js";
describe("getHammingDistance", () => {
    it("measures the pair", () => {
        expect(getHammingDistance({ first: "kitten", second: "kitten" })).toBe(
            0,
        );
        expect(
            getHammingDistance({ first: 1 as unknown as string, second: "a" }),
        ).toBeUndefined();
    });
});
