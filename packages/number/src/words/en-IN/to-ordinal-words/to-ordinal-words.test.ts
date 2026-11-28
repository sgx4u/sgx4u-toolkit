import { describe, expect, it } from "vitest";
import { toOrdinalWords } from "../../en-IN.js";

describe("toOrdinalWords en-IN", () => {
    it("covers the documented behavior", () => {
        expect(toOrdinalWords({ value: 1 })).toBe("first");
        expect(toOrdinalWords({ value: 22 })).toBe("twenty-second");
        expect(toOrdinalWords({ value: 1.5 })).toBeUndefined();
    });
});
