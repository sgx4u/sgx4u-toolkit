import { describe, expect, it } from "vitest";
import { atString } from "./at-string.js";
describe("atString", () => {
    it("returns one unit", () => {
        expect(atString({ value: "hi", index: 0 })).toBe("h");
        expect(atString({ value: "hi", index: -1 })).toBe("i");
        expect(atString({ value: "hi", index: 5 })).toBeUndefined();
        expect(atString({ value: "👨‍👩‍👧‍👦", index: 0 })).toBe("👨‍👩‍👧‍👦");
        expect(
            atString({ value: 1 as unknown as string, index: 0 }),
        ).toBeUndefined();
    });
});
