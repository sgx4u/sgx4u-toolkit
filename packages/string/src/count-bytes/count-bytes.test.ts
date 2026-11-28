import { describe, expect, it } from "vitest";
import { countBytes } from "./count-bytes.js";

describe("countBytes", () => {
    it("counts UTF-8 bytes", () => {
        expect(countBytes("")).toBe(0);
        expect(countBytes("a")).toBe(1);
        expect(countBytes("é")).toBe(2);
        expect(countBytes("😀")).toBe(4);
        expect(countBytes(null)).toBeUndefined();
    });
});
