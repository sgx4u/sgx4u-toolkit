import { describe, expect, it } from "vitest";
import { getPluralCategory } from "./get-plural-category.js";
describe("getPluralCategory", () => {
    it("uses Intl plural rules", () => {
        expect(getPluralCategory({ count: 1, locale: "en" })).toBe("one");
        expect(getPluralCategory({ count: 2, locale: "en" })).toBe("other");
        expect(getPluralCategory({ count: Number.NaN })).toBeUndefined();
        expect(
            getPluralCategory({ count: "1" as unknown as number }),
        ).toBeUndefined();
    });
});
