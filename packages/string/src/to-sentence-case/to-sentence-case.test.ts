import { describe, expect, it } from "vitest";
import { toSentenceCase } from "./to-sentence-case.js";

describe("toSentenceCase", () => {
    it("converts words", () => {
        expect(toSentenceCase("fooBar")).toBe("Foo bar");
        expect(toSentenceCase("")).toBe("");
        expect(toSentenceCase(null as unknown as string)).toBeUndefined();
    });
});
