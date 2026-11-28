import { describe, expect, it } from "vitest";
import { soundsAlike } from "./sounds-alike.js";
describe("soundsAlike", () => {
    it("matches Smith and Schmidt", () => {
        expect(soundsAlike({ first: "Smith", second: "Schmidt" })).toBe(true);
        expect(
            soundsAlike({
                first: "Robert",
                second: "Rupert",
                algorithm: "soundex",
            }),
        ).toBe(true);
        expect(
            soundsAlike({ first: 1 as unknown as string, second: "a" }),
        ).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(soundsAlike(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof soundsAlike({ first: "", second: "Schmidt" })).toBe(
            "boolean",
        );
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof soundsAlike({ first: "👨‍👩‍👧", second: "Schmidt" })).toBe(
            "boolean",
        );
    });
    it("accepts a combining mark", () => {
        expect(
            typeof soundsAlike({ first: "e\u0301", second: "Schmidt" }),
        ).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof soundsAlike({ first: "مرحبا", second: "Schmidt" })).toBe(
            "boolean",
        );
    });
    it("accepts CJK text", () => {
        expect(typeof soundsAlike({ first: "你好", second: "Schmidt" })).toBe(
            "boolean",
        );
    });
});
