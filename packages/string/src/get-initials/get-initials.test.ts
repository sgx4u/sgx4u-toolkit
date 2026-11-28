import { describe, expect, it } from "vitest";
import { getInitials } from "./get-initials.js";
describe("getInitials", () => {
    it("takes the first grapheme of each word", () => {
        expect(getInitials("Mary Jane Watson")).toBe("MJ");
        expect(
            getInitials({ value: "Mary Jane Watson", maximumLength: 3 }),
        ).toBe("MJW");
    });
});
