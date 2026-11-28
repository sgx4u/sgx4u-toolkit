import {
    array,
    assert,
    boolean,
    constant,
    dictionary,
    integer,
    oneof,
    property,
    string,
    stringMatching,
} from "fast-check";
import type { Arbitrary } from "fast-check";
import { describe, expect, it } from "vitest";
import { flattenObject } from "../flatten-object/flatten-object.js";
import { unflattenObject } from "./unflatten-object.js";

const safeKey: Arbitrary<string> = stringMatching(/^[a-z][a-z0-9]{0,5}$/);

function nestedValue(maxDepth: number): Arbitrary<unknown> {
    const leaf = oneof(
        constant(null),
        boolean(),
        integer({ min: -10, max: 10 }),
        string({ maxLength: 8 }),
    );
    if (maxDepth <= 0) {
        return leaf;
    }
    return oneof(
        leaf,
        array(nestedValue(maxDepth - 1), { maxLength: 3 }),
        dictionary(safeKey, nestedValue(maxDepth - 1), { maxKeys: 3 }),
    );
}

const roundTripValue = oneof(
    dictionary(safeKey, nestedValue(3), { maxKeys: 4 }),
    array(nestedValue(3), { minLength: 1, maxLength: 3 }),
);

describe("unflattenObject", () => {
    it("rebuilds nested objects", () => {
        expect(
            unflattenObject({ object: { "user.name": "Ada", "user.id": 1 } }),
        ).toEqual({ user: { name: "Ada", id: 1 } });
    });

    it("converts a dense index set in auto mode", () => {
        expect(unflattenObject({ object: { "a.0": "x", "a.1": "y" } })).toEqual(
            {
                a: ["x", "y"],
            },
        );
        expect(unflattenObject({ object: { "1": "b", "0": "a" } })).toEqual([
            "a",
            "b",
        ]);
    });

    it("keeps holes as an object in auto mode and as an array in always mode", () => {
        expect(unflattenObject({ object: { "0": "a", "2": "c" } })).toEqual({
            "0": "a",
            "2": "c",
        });

        const sparse = unflattenObject({
            object: { "0": "a", "2": "c" },
            arrays: "always",
        }) as unknown[];

        expect(sparse[0]).toBe("a");
        expect(sparse[2]).toBe("c");
        expect(sparse.length).toBe(3);
        expect(Object.hasOwn(sparse, 1)).toBe(false);
    });

    it("keeps integer keys as strings when arrays is never", () => {
        expect(
            unflattenObject({
                object: { "0": "a", "1": "b" },
                arrays: "never",
            }),
        ).toEqual({ "0": "a", "1": "b" });
    });

    it("does not turn a mixed node into an array", () => {
        expect(
            unflattenObject({
                object: { "0": "a", name: "Ada" },
                arrays: "always",
            }),
        ).toEqual({ "0": "a", name: "Ada" });
    });

    it("lets a later path overwrite an earlier one", () => {
        const longerLast: Record<string, unknown> = {};
        longerLast.a = 1;
        longerLast["a.b"] = 2;
        expect(unflattenObject({ object: longerLast })).toEqual({
            a: { b: 2 },
        });

        const shorterLast: Record<string, unknown> = {};
        shorterLast["a.b"] = 2;
        shorterLast.a = 1;
        expect(unflattenObject({ object: shorterLast })).toEqual({ a: 1 });
    });

    it("does not pollute Object.prototype from flat dangerous keys", () => {
        const flat: Record<string, unknown> = {};
        flat["__proto__.polluted"] = true;
        flat["constructor.prototype.polluted"] = true;
        flat.name = "Ada";
        const prototype = Object.prototype as { polluted?: unknown };
        const before = prototype.polluted;

        const skipped = unflattenObject({ object: flat });

        expect(skipped).toEqual({ name: "Ada" });
        expect(prototype.polluted).toBe(before);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();

        const kept = unflattenObject({
            object: flat,
            prototypeKeys: "keep",
        }) as Record<string, unknown>;
        const protoValue = Object.getOwnPropertyDescriptor(kept, "__proto__")
            ?.value as { polluted?: unknown };
        const constructorValue = kept.constructor as {
            prototype?: { polluted?: unknown };
        };

        expect(protoValue.polluted).toBe(true);
        expect(constructorValue.prototype?.polluted).toBe(true);
        expect(prototype.polluted).toBe(before);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("throws when prototypeKeys is throw and a segment is dangerous", () => {
        const flat: Record<string, unknown> = {};
        flat["__proto__.polluted"] = true;

        expect(() =>
            unflattenObject({ object: flat, prototypeKeys: "throw" }),
        ).toThrow(RangeError);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("round-trips a plain object through flattenObject", () => {
        const value = {
            user: { name: "Ada" },
            tags: ["a", "b"],
            score: 1,
            empty: {},
            none: [],
        };

        expect(
            unflattenObject({ object: flattenObject({ object: value }) }),
        ).toEqual(value);
    });

    it("round-trips generated objects that have no dangerous or delimiter keys", () => {
        assert(
            property(roundTripValue, (value) => {
                const flat = flattenObject({ object: value });
                expect(unflattenObject({ object: flat })).toEqual(value);
            }),
            { numRuns: 25 },
        );
    });

    it("throws for an unknown arrays or prototypeKeys option", () => {
        expect(() =>
            unflattenObject({ object: { a: 1 }, arrays: "index" as "auto" }),
        ).toThrow(RangeError);
        expect(() =>
            unflattenObject({
                object: { a: 1 },
                prototypeKeys: "drop" as "skip",
            }),
        ).toThrow(RangeError);
    });

    it("keeps an empty segment from a trailing delimiter", () => {
        expect(unflattenObject({ object: { "a.b.": 1 } })).toEqual({
            a: { b: { "": 1 } },
        });
    });

    it("returns undefined for null, primitives, and arrays", () => {
        expect(unflattenObject({ object: null })).toBeUndefined();
        expect(unflattenObject({ object: "a.b" })).toBeUndefined();
        expect(unflattenObject({ object: [] })).toBeUndefined();
    });
});
