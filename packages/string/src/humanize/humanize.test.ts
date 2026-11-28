import { describe, expect, it } from "vitest";
import { humanize } from "./humanize.js";
describe("humanize", () => {
    it("turns a code name into a phrase", () => {
        expect(humanize("foo_bar")).toBe("Foo bar");
        expect(humanize(null)).toBeUndefined();
    });
});
