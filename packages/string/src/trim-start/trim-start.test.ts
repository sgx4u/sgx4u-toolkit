import { describe, expect, it } from "vitest";
import { trimStart } from "./trim-start.js";

describe("trimStart", () => {
    it("trims one end", () => {
        expect(trimStart("  a  ")).not.toBe("  a  ");
        expect(trimStart("")).toBe("");
        expect(trimStart(1 as unknown as string)).toBeUndefined();
    });
});
