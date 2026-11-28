import { describe, expect, it } from "vitest";
import { toWellFormedString } from "./to-well-formed-string.js";

describe("toWellFormedString", () => {
    it("replaces a lone surrogate and keeps valid text", () => {
        expect(toWellFormedString("ok")).toBe("ok");
        expect(toWellFormedString("\uD800")?.isWellFormed()).toBe(true);
        expect(toWellFormedString(null)).toBeUndefined();
    });
});
