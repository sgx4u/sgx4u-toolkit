import { describe, expect, it } from "vitest";
import { compareNumbers } from "../index.js";

describe("compareNumbers", () => {
    it("covers the documented behavior", () => {
        expect(compareNumbers({ first: 1, second: 2 })).toBe(-1);
        expect(compareNumbers({ first: 2, second: 1 })).toBe(1);
        expect(compareNumbers({ first: -0, second: 0 })).toBe(0);
        expect(
            compareNumbers({ first: Number.NaN, second: 1 }),
        ).toBeUndefined();
        expect(
            compareNumbers({
                first: 1 as unknown as number,
                second: "1" as unknown as number,
            }),
        ).toBeUndefined();
    });
});
