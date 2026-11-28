import { describe, expect, it } from "vitest";
import { createString } from "./create-string.js";

describe("createString", () => {
    it("binds locale and rejects an unknown key", () => {
        const strings = createString({ locale: "tr-TR" });
        expect(strings.toLowerCase("I")).toBe("ı");
        expect(strings.toLowerCase({ value: "I", locale: "en" })).toBe("i");
        const other = createString();
        expect(other.toLowerCase("I")).toBe("i");
        expect(() => createString({ typo: true } as never)).toThrow(RangeError);
    });
});
