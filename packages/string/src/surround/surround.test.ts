import { describe, expect, it } from "vitest";
import { surround } from "./surround.js";
describe("surround", () => {
    it("wraps with the prefix and an optional suffix", () => {
        expect(surround({ value: "a", prefix: "*" })).toBe("*a*");
        expect(surround({ value: "a", prefix: "(", suffix: ")" })).toBe("(a)");
        expect(
            surround({ value: 1 as unknown as string, prefix: "*" }),
        ).toBeUndefined();
    });
});
