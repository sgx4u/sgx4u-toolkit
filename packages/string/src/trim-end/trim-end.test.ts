import { describe, expect, it } from "vitest";
import { trimEnd } from "./trim-end.js";

describe("trimEnd", () => {
    it("trims one end", () => {
        expect(trimEnd("  a  ")).not.toBe("  a  ");
        expect(trimEnd("")).toBe("");
        expect(trimEnd(1 as unknown as string)).toBeUndefined();
    });
});
