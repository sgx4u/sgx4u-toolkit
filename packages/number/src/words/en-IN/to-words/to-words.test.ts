import { describe, expect, it } from "vitest";
import { toWords } from "../../en-IN.js";

describe("toWords en-IN", () => {
    it("covers the documented behavior", () => {
        expect(toWords({ value: 100000 })).toBe("one lakh");
        expect(toWords({ value: 0 })).toBe("zero");
        expect(toWords({ value: -3 })).toBe("minus three");
        expect(toWords({ value: 1.5 })).toBe("one point five");
        expect(toWords({ value: 21, kind: "ordinal" })).toBe("twenty-first");
        expect(toWords({ value: Number.NaN })).toBeUndefined();
    });
});
