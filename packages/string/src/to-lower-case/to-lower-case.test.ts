import { describe, expect, it } from "vitest";
import { toLowerCase } from "./to-lower-case.js";

describe("toLowerCase", () => {
    it("converts case and honors Turkish", () => {
        expect(toLowerCase("Hello")).toBe("Hello".toLocaleLowerCase());
        expect(toLowerCase({ value: "I", locale: "tr-TR" })).toBe("ı");
        expect(toLowerCase("")).toBe("");
        expect(toLowerCase(null as unknown as string)).toBeUndefined();
        expect(() => toLowerCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
    });
});
