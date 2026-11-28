import { describe, expect, it } from "vitest";
import { getOffsetItems } from "./get-offset-items.js";

describe("getOffsetItems", () => {
    it("slices from offset and treats 0 as the start", () => {
        const values = Object.freeze(["a", "b", "c", "d"]);
        expect(getOffsetItems({ array: values, offset: 0, limit: 2 })).toEqual([
            "a",
            "b",
        ]);
        expect(getOffsetItems({ array: values, offset: 2, limit: 2 })).toEqual([
            "c",
            "d",
        ]);
        expect(values).toEqual(["a", "b", "c", "d"]);
    });

    it("returns an empty array for a zero limit or an offset past the end", () => {
        expect(getOffsetItems({ array: [1, 2], offset: 0, limit: 0 })).toEqual(
            [],
        );
        expect(getOffsetItems({ array: [1, 2], offset: 5, limit: 2 })).toEqual(
            [],
        );
    });

    it("returns undefined when array is not an array", () => {
        expect(
            getOffsetItems({ array: "no", offset: 0, limit: 1 } as never),
        ).toBeUndefined();
    });

    it("densifies a sparse hole", () => {
        const values: number[] = [];
        values[0] = 1;
        values[2] = 3;
        expect(getOffsetItems({ array: values, offset: 0, limit: 3 })).toEqual([
            1,
            undefined,
            3,
        ]);
    });

    it("throws when offset or limit is unusable", () => {
        expect(() =>
            getOffsetItems({ array: [1], offset: -1, limit: 1 }),
        ).toThrow(RangeError);
        expect(() =>
            getOffsetItems({ array: [1], offset: 0, limit: 1.5 }),
        ).toThrow(RangeError);
    });
});
