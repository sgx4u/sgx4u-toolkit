import { describe, expect, it } from "vitest";
import { splitGraphemes } from "./split-graphemes.js";

describe("splitGraphemes", () => {
    it("keeps clusters together", () => {
        expect(splitGraphemes("")).toEqual([]);
        expect(splitGraphemes("a😀")).toEqual(["a", "😀"]);
        expect(splitGraphemes("👨‍👩‍👧‍👦")).toEqual(["👨‍👩‍👧‍👦"]);
        expect(splitGraphemes("🇺🇸")).toEqual(["🇺🇸"]);
        expect(splitGraphemes("👍🏽")).toEqual(["👍🏽"]);
        expect(splitGraphemes("e\u0301")).toEqual(["e\u0301"]);
        expect(splitGraphemes("가")).toEqual(["가"]);
        expect(splitGraphemes(" ")).toEqual([" "]);
        expect(splitGraphemes("क्ष")).toHaveLength(1);
        expect(splitGraphemes("\uD800")).toEqual(["\uD800"]);
        expect(splitGraphemes(null)).toBeUndefined();
    });
});
