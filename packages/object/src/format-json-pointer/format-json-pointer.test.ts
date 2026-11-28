import { describe, expect, it } from "vitest";
import { formatJSONPointer } from "./format-json-pointer.js";

describe("formatJSONPointer", () => {
    it("formats an empty path and escapes tokens", () => {
        expect(formatJSONPointer([])).toBe("");
        expect(formatJSONPointer(["a/b", 0])).toBe("/a~1b/0");
        expect(formatJSONPointer(["m~n"])).toBe("/m~0n");
        expect(formatJSONPointer(["a/b~c"])).toBe("/a~1b~0c");
    });

    it("returns undefined when the value is not a segment list", () => {
        expect(formatJSONPointer("a")).toBeUndefined();
        expect(formatJSONPointer(null)).toBeUndefined();
        expect(formatJSONPointer(undefined)).toBeUndefined();
        expect(formatJSONPointer({})).toBeUndefined();
        expect(formatJSONPointer([Symbol("a")])).toBeUndefined();
        expect(formatJSONPointer([Number.NaN])).toBeUndefined();
        expect(formatJSONPointer([Number.POSITIVE_INFINITY])).toBeUndefined();
    });
});
