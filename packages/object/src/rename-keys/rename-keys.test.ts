import { describe, expect, it } from "vitest";
import { renameKeys } from "./rename-keys.js";

describe("renameKeys", () => {
    it("renames listed keys and lets the later duplicate win", () => {
        expect(
            renameKeys({
                object: { a: 1, b: 2, c: 3 },
                mapping: { a: "b", c: "b" },
            }),
        ).toEqual({ b: 3 });
    });

    it("renames nested objects and objects inside arrays", () => {
        const result = renameKeys({
            object: { items: [{ first_name: "Ada" }], first_name: "Grace" },
            mapping: { first_name: "firstName", items: "list" },
            deep: true,
        });

        expect(result).toEqual({
            list: [{ firstName: "Ada" }],
            firstName: "Grace",
        });
    });

    it("keeps unlisted keys and skips a dangerous target", () => {
        expect(
            renameKeys({
                object: { a: 1, b: 2 },
                mapping: { a: "__proto__" },
            }),
        ).toEqual({ b: 2 });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("does not rename nested keys when deep is false", () => {
        const nested = { b: 1 };
        const result = renameKeys({
            object: { a: nested },
            mapping: { b: "c" },
        });

        expect(result).toEqual({ a: { b: 1 } });
        expect(result?.a).toBe(nested);
    });

    it("does not mutate the input", () => {
        const input = { a: 1 };
        renameKeys({ object: input, mapping: { a: "id" } });

        expect(input).toEqual({ a: 1 });
    });

    it("throws when mapping is not a plain object", () => {
        expect(() =>
            renameKeys({
                object: { a: 1 },
                mapping: [] as unknown as Record<string, string>,
            }),
        ).toThrow(TypeError);
    });

    it("renames to a number or symbol and ignores a target that is not a key", () => {
        const symbol = Symbol("id");
        const result = renameKeys({
            object: { a: 1, b: 2, c: 3 },
            mapping: {
                a: 2,
                b: symbol,
                c: { nested: true } as unknown as PropertyKey,
            },
        }) as Record<PropertyKey, unknown>;

        expect(result[2]).toBe(1);
        expect(result[symbol]).toBe(2);
        expect(result.c).toBe(3);
    });

    it("preserves an array hole while renaming objects inside it", () => {
        const items: ({ name: string } | undefined)[] = [];
        items[0] = { name: "Ada" };
        items[2] = { name: "Grace" };
        const result = renameKeys({
            object: { items },
            mapping: { name: "id", items: "list" },
            deep: true,
        }) as { list: unknown[] };

        expect(result.list[0]).toEqual({ id: "Ada" });
        expect(Object.hasOwn(result.list, 1)).toBe(false);
        expect(result.list[2]).toEqual({ id: "Grace" });
    });

    it("returns undefined for an array root", () => {
        expect(
            renameKeys({
                object: [{ a: 1 }],
                mapping: { a: "id" },
            }),
        ).toBeUndefined();
    });
});
