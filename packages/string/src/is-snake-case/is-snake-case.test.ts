import { describe, expect, it } from "vitest";
import { isSnakeCase } from "./is-snake-case.js";

describe("isSnakeCase", () => {
    it("accepts the snake-case conversion", () => {
        expect(isSnakeCase("foo_bar")).toBe(true);
        expect(isSnakeCase("v_1_2")).toBe(true);
        expect(isSnakeCase("foo")).toBe(true);
        expect(isSnakeCase("fooBar")).toBe(false);
        expect(isSnakeCase("")).toBe(false);
        expect(isSnakeCase(null)).toBe(false);
    });
});
