import { describe, expect, it } from "vitest";
import { parseOctal } from "../index.js";

describe("parseOctal", () => {
    it("covers the documented behavior", () => {
        expect(parseOctal("0o10")).toBe(8);
        expect(parseOctal("8")).toBeUndefined();
    });
});
