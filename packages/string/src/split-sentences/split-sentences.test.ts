import { describe, expect, it } from "vitest";
import { splitSentences } from "./split-sentences.js";
describe("splitSentences", () => {
    it("splits and trims sentences", () => {
        expect(splitSentences("Hello. World.")?.length).toBeGreaterThan(0);
        expect(splitSentences("")).toEqual([]);
        expect(splitSentences(null as unknown as string)).toBeUndefined();
    });
});
