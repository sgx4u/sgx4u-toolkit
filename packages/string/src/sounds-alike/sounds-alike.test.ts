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
