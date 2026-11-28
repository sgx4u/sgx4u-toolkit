import { describe, expect, it } from "vitest";
import { isTrainCase } from "./is-train-case.js";

describe("isTrainCase", () => {
    it("accepts the train-case conversion", () => {
        expect(isTrainCase("Xml-Http-Request")).toBe(true);
        expect(isTrainCase("Foo")).toBe(true);
        expect(isTrainCase("foo-bar")).toBe(false);
        expect(isTrainCase("")).toBe(false);
        expect(isTrainCase(null)).toBe(false);
    });
});
