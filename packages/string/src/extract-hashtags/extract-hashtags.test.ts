import { describe, expect, it } from "vitest";
import { extractHashtags } from "./extract-hashtags.js";
describe("extractHashtags", () => {
    it("finds hashtags", () => {
        expect(extractHashtags("#Hello #2")).toEqual(["#Hello", "#2"]);
        expect(extractHashtags("none")).toEqual([]);
    });
});
