import { describe, expect, it } from "vitest";
import { createCombinatorics } from "./create-combinatorics.js";

describe("createCombinatorics", () => {
    it("returns the combinatorics helpers and ignores unused config", () => {
        const combinatorics = createCombinatorics({ locale: "en-US" });
        expect(Object.isFrozen(combinatorics)).toBe(true);
        expect(combinatorics.getPairs([1, 2, 3])).toEqual([
            [1, 2],
            [1, 3],
            [2, 3],
        ]);
    });

    it("throws when the config is invalid", () => {
        expect(() => createCombinatorics({ concurrency: 0 })).toThrow(
            RangeError,
        );
    });
});
