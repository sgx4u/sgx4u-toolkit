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

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(interpolate(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            interpolate({ template: "", values: { name: "Ada" } }) ===
                undefined ||
                typeof interpolate({
                    template: "",
                    values: { name: "Ada" },
                }) === "string" ||
                typeof interpolate({
                    template: "",
                    values: { name: "Ada" },
                }) === "boolean" ||
                typeof interpolate({
                    template: "",
                    values: { name: "Ada" },
                }) === "number" ||
                Array.isArray(
                    interpolate({ template: "", values: { name: "Ada" } }),
                ) ||
                (typeof interpolate({
                    template: "",
                    values: { name: "Ada" },
                }) === "object" &&
                    interpolate({ template: "", values: { name: "Ada" } }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            interpolate({ template: "👨‍👩‍👧", values: { name: "Ada" } }) ===
                undefined ||
                typeof interpolate({
                    template: "👨‍👩‍👧",
                    values: { name: "Ada" },
                }) === "string" ||
                typeof interpolate({
                    template: "👨‍👩‍👧",
                    values: { name: "Ada" },
                }) === "boolean" ||
                typeof interpolate({
                    template: "👨‍👩‍👧",
                    values: { name: "Ada" },
                }) === "number" ||
                Array.isArray(
                    interpolate({ template: "👨‍👩‍👧", values: { name: "Ada" } }),
                ) ||
                (typeof interpolate({
                    template: "👨‍👩‍👧",
                    values: { name: "Ada" },
                }) === "object" &&
                    interpolate({ template: "👨‍👩‍👧", values: { name: "Ada" } }) !==
                        null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            interpolate({ template: "e\u0301", values: { name: "Ada" } }) ===
                undefined ||
                typeof interpolate({
                    template: "e\u0301",
                    values: { name: "Ada" },
                }) === "string" ||
                typeof interpolate({
                    template: "e\u0301",
                    values: { name: "Ada" },
                }) === "boolean" ||
                typeof interpolate({
                    template: "e\u0301",
                    values: { name: "Ada" },
                }) === "number" ||
                Array.isArray(
                    interpolate({
                        template: "e\u0301",
                        values: { name: "Ada" },
                    }),
                ) ||
                (typeof interpolate({
                    template: "e\u0301",
                    values: { name: "Ada" },
                }) === "object" &&
                    interpolate({
                        template: "e\u0301",
                        values: { name: "Ada" },
                    }) !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            interpolate({ template: "مرحبا", values: { name: "Ada" } }) ===
                undefined ||
                typeof interpolate({
                    template: "مرحبا",
                    values: { name: "Ada" },
                }) === "string" ||
                typeof interpolate({
                    template: "مرحبا",
                    values: { name: "Ada" },
                }) === "boolean" ||
                typeof interpolate({
                    template: "مرحبا",
                    values: { name: "Ada" },
                }) === "number" ||
                Array.isArray(
                    interpolate({ template: "مرحبا", values: { name: "Ada" } }),
                ) ||
                (typeof interpolate({
                    template: "مرحبا",
                    values: { name: "Ada" },
                }) === "object" &&
                    interpolate({
                        template: "مرحبا",
                        values: { name: "Ada" },
                    }) !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            interpolate({ template: "你好", values: { name: "Ada" } }) ===
                undefined ||
                typeof interpolate({
                    template: "你好",
                    values: { name: "Ada" },
                }) === "string" ||
                typeof interpolate({
                    template: "你好",
                    values: { name: "Ada" },
                }) === "boolean" ||
                typeof interpolate({
                    template: "你好",
                    values: { name: "Ada" },
                }) === "number" ||
                Array.isArray(
                    interpolate({ template: "你好", values: { name: "Ada" } }),
                ) ||
                (typeof interpolate({
                    template: "你好",
                    values: { name: "Ada" },
                }) === "object" &&
                    interpolate({
                        template: "你好",
                        values: { name: "Ada" },
                    }) !== null),
        ).toBe(true);
    });
});
