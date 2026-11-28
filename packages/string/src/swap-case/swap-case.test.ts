import { describe, expect, it } from "vitest";
import { swapCase } from "./swap-case.js";

describe("swapCase", () => {
    it("flips cased letters", () => {
        expect(swapCase("Hello")).toBe("hELLO");
        expect(swapCase("123")).toBe("123");
        expect(swapCase("")).toBe("");
        expect(swapCase(null as unknown as string)).toBeUndefined();
    });
});
