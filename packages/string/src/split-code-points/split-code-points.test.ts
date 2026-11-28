import { describe, expect, it } from "vitest";
import { splitCodePoints } from "./split-code-points.js";

describe("splitCodePoints", () => {
    it("splits on code points", () => {
        expect(splitCodePoints("")).toEqual([]);
        expect(splitCodePoints("😀")).toEqual(["😀"]);
        expect(splitCodePoints("e\u0301")).toEqual(["e", "\u0301"]);
        expect(splitCodePoints(null)).toBeUndefined();
    });
});
