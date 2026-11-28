import { describe, expect, it } from "vitest";
import { extractMentions } from "./extract-mentions.js";
describe("extractMentions", () => {
    it("finds mentions", () => {
        expect(extractMentions("hi @ada and @bob")).toEqual(["@ada", "@bob"]);
        expect(extractMentions("none")).toEqual([]);
    });
});
