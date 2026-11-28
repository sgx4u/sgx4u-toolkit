import { describe, expect, it } from "vitest";
import { pad } from "./pad.js";
describe("pad", () => {
    it("pads and leaves long strings unchanged", () => {
        expect(pad({ value: "a", maximumLength: 3 })).toBe(" a ");
        expect(pad({ value: "abcd", maximumLength: 3 })).toBe("abcd");
        expect(pad({ value: "a", maximumLength: 4, align: "start" })).toBe(
            "   a",
        );
        expect(
            pad({ value: "a", maximumLength: 4, align: "end", padString: "." }),
        ).toBe("a...");
        expect(
            pad({
                value: "a",
                maximumLength: 4,
                align: "center",
                padString: "xy",
            }),
        ).toBe("xayx");
        expect(
            pad({ value: 1 as unknown as string, maximumLength: 2 }),
        ).toBeUndefined();
        expect(() => pad({ value: "a", maximumLength: -1 })).toThrow(
            RangeError,
        );
    });
});
