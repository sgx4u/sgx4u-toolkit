import { describe, expect, it } from "vitest";
import { singularize } from "./singularize.js";
describe("singularize", () => {
    it("singularizes irregulars and regulars", () => {
        expect(singularize("cities")).toBe("city");
        expect(singularize("buses")).toBe("bus");
        expect(singularize("people")).toBe("person");
        expect(singularize("children")).toBe("child");
        expect(singularize("mice")).toBe("mouse");
        expect(singularize("geese")).toBe("goose");
        expect(singularize("women")).toBe("woman");
        expect(singularize("data")).toBe("datum");
        expect(singularize("indexes")).toBe("index");
        expect(singularize("octopuses")).toBe("octopus");
        expect(singularize("sheep")).toBe("sheep");
        expect(singularize("bus")).toBe("bus");
        expect(() => singularize({ value: "cats", locale: "fr" })).toThrow(
            RangeError,
        );
    });
});
