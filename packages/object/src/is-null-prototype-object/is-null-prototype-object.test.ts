import { describe, expect, it } from "vitest";
import { isNullPrototypeObject } from "./is-null-prototype-object.js";

describe("isNullPrototypeObject", () => {
    it("checks the prototype", () => {
        expect(isNullPrototypeObject(Object.create(null))).toBe(true);
        expect(isNullPrototypeObject({})).toBe(false);
        expect(isNullPrototypeObject(null)).toBe(false);
        expect(isNullPrototypeObject(1)).toBe(false);
    });
});
