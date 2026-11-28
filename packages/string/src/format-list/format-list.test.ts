import { describe, expect, it } from "vitest";
import { formatList } from "./format-list.js";
describe("formatList", () => {
    it("formats and rejects a bad list", () => {
        expect(formatList({ values: [] })).toBe("");
        expect(formatList({ values: ["a", "b"], locale: "en" })).toContain("a");
        expect(() => formatList({ values: [1 as unknown as string] })).toThrow(
            TypeError,
        );
        expect(
            formatList(null as unknown as { values: string[] }),
        ).toBeUndefined();
    });
});
