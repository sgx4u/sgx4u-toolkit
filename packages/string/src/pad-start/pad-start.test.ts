import { describe, expect, it } from "vitest";
import { padStart } from "./pad-start.js";
describe("padStart", () => {
    it("pads one side", () => {
        expect(padStart({ value: "a", maximumLength: 3 })).toBe("  a");
        expect(padStart({ value: "abcd", maximumLength: 2 })).toBe("abcd");
        expect(
            padStart({ value: 1 as unknown as string, maximumLength: 1 }),
        ).toBeUndefined();
    });
});
