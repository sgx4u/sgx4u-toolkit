import { describe, expect, it } from "vitest";
import { evolve } from "./evolve.js";

describe("evolve", () => {
    it("applies functions and nested rules without mutating the input", () => {
        const address = { city: " paris ", zip: "69001" };
        const person = { address, name: "ada" };
        const evolved = evolve({
            object: person,
            transformations: {
                address: {
                    city: (value) => String(value).trim(),
                },
                name: (value) => String(value).toUpperCase(),
            },
        });
        expect(evolved).toEqual({
            address: { city: "paris", zip: "69001" },
            name: "ADA",
        });
        expect(person.name).toBe("ada");
        expect(address.city).toBe(" paris ");
        expect(evolved?.address).not.toBe(address);
        expect((evolved?.address as { zip: string }).zip).toBe("69001");
    });

    it("keeps unlisted keys by reference", () => {
        const shared = { id: 1 };
        const source = { name: "ada", shared };
        const evolved = evolve({
            object: source,
            transformations: {
                name: (value) => String(value).toUpperCase(),
            },
        });
        expect(evolved).not.toBe(source);
        expect(evolved?.shared).toBe(shared);
    });

    it("returns the same object when nothing changes", () => {
        const source = { id: 1 };
        expect(
            evolve({
                object: source,
                transformations: {},
            }),
        ).toBe(source);
        expect(
            evolve({
                object: source,
                transformations: {
                    missing: (value) => value,
                },
            }),
        ).toBe(source);
    });

    it("skips a nested rule when the value is not a plain object", () => {
        const source = { tags: ["a"] };
        expect(
            evolve({
                object: source,
                transformations: {
                    tags: { 0: (value) => value },
                },
            }),
        ).toBe(source);
    });

    it("returns undefined for a non-plain object", () => {
        expect(evolve({ object: null, transformations: {} })).toBeUndefined();
        expect(evolve({ object: [], transformations: {} })).toBeUndefined();
        expect(evolve({ object: "ada", transformations: {} })).toBeUndefined();
    });

    it("returns the object when transformations are not a plain object", () => {
        const source = { id: 1 };
        expect(
            evolve({
                object: source,
                transformations: ((value: unknown) => value) as never,
            }),
        ).toBe(source);
    });
});
