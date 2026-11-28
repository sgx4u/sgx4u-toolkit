import { describe, expect, it } from "vitest";
import { splitWords } from "./split-words.js";

describe("splitWords", () => {
    it("splits the documented examples", () => {
        expect(splitWords("")).toEqual([]);
        expect(splitWords("XMLHttpRequest")).toEqual([
            "XML",
            "Http",
            "Request",
        ]);
        expect(splitWords("userID")).toEqual(["user", "ID"]);
        expect(splitWords("__typename")).toEqual(["typename"]);
        expect(splitWords("version2Beta")).toEqual(["version", "2", "Beta"]);
        expect(splitWords("v1.2")).toEqual(["v", "1", "2"]);
        expect(
            splitWords({ value: "V1.2", mergeAmbiguousCharacters: true }),
        ).toEqual(["V12"]);
        expect(
            splitWords({
                value: "version2Beta",
                mergeAmbiguousCharacters: true,
            }),
        ).toEqual(["version2", "Beta"]);
        expect(splitWords("你好")).toEqual(["你好"]);
        expect(splitWords("foo😀bar")).toEqual(["foo", "😀", "bar"]);
        expect(splitWords(null as unknown as string)).toBeUndefined();
    });
});
