import { describe, expect, it } from "vitest";
import { getObjectEntries } from "./get-object-entries.js";

describe("getObjectEntries", () => {
    it("lists pairs", () => {
        expect(getObjectEntries({ id: 1 })).toEqual([["id", 1]]);
        expect(getObjectEntries(1 as unknown as object)).toBeUndefined();
        const symbol = Symbol("id");
        expect(
            getObjectEntries({ object: { [symbol]: 2 }, includeSymbols: true }),
        ).toEqual([[symbol, 2]]);
    });
});
