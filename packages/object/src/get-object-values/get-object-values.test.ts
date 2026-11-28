import { describe, expect, it } from "vitest";
import { getObjectValues } from "./get-object-values.js";

describe("getObjectValues", () => {
    it("lists values for the selected keys", () => {
        expect(getObjectValues({ id: 1 })).toEqual([1]);
        expect(getObjectValues(null)).toBeUndefined();
        const symbol = Symbol("id");
        expect(
            getObjectValues({ object: { [symbol]: 2 }, includeSymbols: true }),
        ).toEqual([2]);
    });
});
