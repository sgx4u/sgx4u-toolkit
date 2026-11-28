import { describe, expect, it } from "vitest";
import { getReadingTime } from "./get-reading-time.js";
describe("getReadingTime", () => {
    it("divides words by the rate", () => {
        expect(getReadingTime("one two")).toEqual({ words: 2, minutes: 0.01 });
        expect(() => getReadingTime({ value: "a", wordsPerMinute: 0 })).toThrow(
            RangeError,
        );
    });
});
