import { describe, expect, it } from "vitest";
import { assert, integer, property } from "fast-check";
import { addPrecise, subtractPrecise } from "../index.js";

describe("addPrecise", () => {
    it("covers the documented behavior", () => {
        expect(addPrecise({ first: 0.1, second: 0.2 })).toBe(0.3);
        expect(addPrecise({ first: Number.NaN, second: 1 })).toBeUndefined();
        assert(
            property(
                integer({ min: -1000, max: 1000 }),
                integer({ min: -1000, max: 1000 }),
                (first, second) => {
                    const start = first / 10;
                    const added = addPrecise({
                        first: start,
                        second: second / 10,
                    });
                    expect(added).toBeDefined();
                    expect(
                        subtractPrecise({
                            first: added ?? 0,
                            second: second / 10,
                        }),
                    ).toBe(start);
                },
            ),
        );
    });
});
