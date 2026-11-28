import { describe, expect, it } from "vitest";
import { padEnd } from "./pad-end.js";
describe("padEnd", () => {
    it("pads one side", () => {
        expect(padEnd({ value: "a", maximumLength: 3 })).toBe("a  ");
        expect(padEnd({ value: "abcd", maximumLength: 2 })).toBe("abcd");
        expect(
            padEnd({ value: 1 as unknown as string, maximumLength: 1 }),
        ).toBeUndefined();
    });
});
