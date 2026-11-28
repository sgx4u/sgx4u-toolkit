import { describe, expect, it } from "vitest";
import { toNoCase } from "./to-no-case.js";

describe("toNoCase", () => {
    it("converts words", () => {
        expect(toNoCase("fooBar")).toBe("foo bar");
        expect(toNoCase("")).toBe("");
        expect(toNoCase(null as unknown as string)).toBeUndefined();
    });
});
