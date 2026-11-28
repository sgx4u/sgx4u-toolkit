import { describe, expect, it } from "vitest";
import { countWords } from "./count-words.js";
describe("countWords", () => {
    it("counts split words", () => {
        expect(countWords("foo bar")).toBe(2);
        expect(countWords("fooBar")).toBe(2);
        expect(countWords("")).toBe(0);
        expect(countWords(null as unknown as string)).toBeUndefined();
    });
});
