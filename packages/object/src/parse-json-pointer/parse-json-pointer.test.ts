import { describe, expect, it } from "vitest";
import { parseJSONPointer } from "./parse-json-pointer.js";

describe("parseJSONPointer", () => {
    it("parses the empty pointer as the whole document", () => {
        expect(parseJSONPointer("")).toEqual([]);
    });

    it("decodes escapes and canonical indexes", () => {
        expect(parseJSONPointer("/a~1b/0")).toEqual(["a/b", 0]);
        expect(parseJSONPointer("/m~0n")).toEqual(["m~n"]);
        expect(parseJSONPointer("/~01")).toEqual(["~1"]);
        expect(parseJSONPointer("/-")).toEqual(["-"]);
        expect(parseJSONPointer("/01")).toEqual(["01"]);
        expect(parseJSONPointer("/")).toEqual([""]);
        expect(parseJSONPointer("//a")).toEqual(["", "a"]);
    });

    it("returns undefined for a non-pointer or a non-string", () => {
        expect(parseJSONPointer("a")).toBeUndefined();
        expect(parseJSONPointer("/~")).toBeUndefined();
        expect(parseJSONPointer("/~2")).toBeUndefined();
        expect(parseJSONPointer(1)).toBeUndefined();
        expect(parseJSONPointer(null)).toBeUndefined();
        expect(parseJSONPointer(undefined)).toBeUndefined();
        expect(parseJSONPointer(["/a"])).toBeUndefined();
    });
});
