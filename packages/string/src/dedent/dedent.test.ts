import { describe, expect, it } from "vitest";
import { dedent } from "./dedent.js";
describe("dedent", () => {
    it("drops the common indent and the outer newlines", () => {
        expect(dedent("\n  a\n    b\n")).toBe("a\n  b");
        expect(dedent("  a\n  b")).toBe("a\nb");
        expect(dedent("\r\n\ta\r\n\tb\r\n")).toBe("a\r\nb");
        expect(dedent("\ta\n    b")).toBe("\ta\n    b");
        expect(dedent("")).toBe("");
        expect(dedent(null)).toBeUndefined();
    });
});
