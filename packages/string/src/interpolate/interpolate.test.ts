import { describe, expect, it } from "vitest";
import { interpolate } from "./interpolate.js";
describe("interpolate", () => {
    it("fills placeholders and does not evaluate", () => {
        expect(
            interpolate({ template: "Hi {name}", values: { name: "Ada" } }),
        ).toBe("Hi Ada");
        expect(interpolate({ template: "Hi {name}", values: {} })).toBe("Hi ");
        expect(
            interpolate({ template: "Hi {name}", values: {}, missing: "keep" }),
        ).toBe("Hi {name}");
        expect(
            interpolate({
                template: "Hi {{name}}",
                values: { name: "Ada" },
                pattern: "double-curly",
            }),
        ).toBe("Hi Ada");
        expect(() =>
            interpolate({
                template: "a",
                values: [] as unknown as Record<string, unknown>,
            }),
        ).toThrow(TypeError);
    });
});
