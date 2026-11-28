import { describe, expect, it } from "vitest";
import { countLines } from "./count-lines.js";
describe("countLines", () => {
    it("counts lines", () => {
        expect(countLines("a\nb")).toBe(2);
        expect(countLines({ value: "a\n\nb", omitEmpty: true })).toBe(2);
        expect(countLines(null as unknown as string)).toBeUndefined();
    });
});
