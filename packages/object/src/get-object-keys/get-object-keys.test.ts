import { describe, expect, it } from "vitest";
import { getObjectKeys } from "./get-object-keys.js";

describe("getObjectKeys", () => {
    it("lists string keys and optional symbols", () => {
        const symbol = Symbol("id");
        const object = { name: "Ada", [symbol]: 1 };
        expect(getObjectKeys(object)).toEqual(["name"]);
        expect(getObjectKeys({ object, includeSymbols: true })).toEqual([
            "name",
            symbol,
        ]);
        expect(getObjectKeys(null)).toBeUndefined();
        expect(getObjectKeys({ object: null })).toBeUndefined();
        const hidden = {};
        Object.defineProperty(hidden, "secret", { value: 1 });
        expect(
            getObjectKeys({ object: hidden, includeNonEnumerable: true }),
        ).toEqual(["secret"]);
    });
});
