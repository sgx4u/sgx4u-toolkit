import { describe, expect, it } from "vitest";
import { countSentences } from "./count-sentences.js";
describe("countSentences", () => {
    it("counts sentences", () => {
        expect(countSentences("Hello. World.")).toBeGreaterThan(0);
        expect(countSentences("")).toBe(0);
        expect(countSentences(null as unknown as string)).toBeUndefined();
    });
});
