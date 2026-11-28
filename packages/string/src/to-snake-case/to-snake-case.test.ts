import { describe, expect, it } from "vitest";
import { toSnakeCase } from "./to-snake-case.js";

describe("toSnakeCase", () => {
    it("separates words with underscores", () => {
        expect(toSnakeCase("foo bar")).toBe("foo_bar");
        expect(toSnakeCase("v1.2")).toBe("v_1_2");
        expect(toSnakeCase("version2Beta")).toBe("version_2_beta");
        expect(toSnakeCase("")).toBe("");
        expect(toSnakeCase(null as never)).toBeUndefined();
    });

    it("merges a letter and its digits when asked", () => {
        expect(
            toSnakeCase({ value: "v1.2", mergeAmbiguousCharacters: true }),
        ).toBe("v12");
    });
});
