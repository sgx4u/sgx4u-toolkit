import { describe, expect, it } from "vitest";
import { splitLines } from "./split-lines.js";
describe("splitLines", () => {
    it("splits on all three newlines", () => {
        expect(splitLines("a\nb\r\nc\rd")).toEqual(["a", "b", "c", "d"]);
        expect(splitLines({ value: "a\n\nb", omitEmpty: true })).toEqual([
            "a",
            "b",
        ]);
        expect(splitLines("")).toEqual([""]);
        expect(splitLines(null as unknown as string)).toBeUndefined();
    });
});
