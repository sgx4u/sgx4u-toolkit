import { afterEach, describe, expect, it } from "vitest";
import { getPath } from "../get-path/get-path.js";
import type { SetPathParams } from "./set-path.types.js";
import { setPath } from "./set-path.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("setPath", () => {
    it("copies ancestors and shares untouched values", () => {
        const sibling = { n: 1 };
        const object = { a: { b: 1 }, sibling };
        const result = setPath({ object, path: "a.c", value: 2 }) as {
            a: { b: number; c: number };
            sibling: typeof sibling;
        };

        expect(result).toEqual({ a: { b: 1, c: 2 }, sibling });
        expect(result.sibling).toBe(sibling);
        expect(result.a).not.toBe(object.a);
        expect(object).toEqual({ a: { b: 1 }, sibling });
    });

    it("returns the same object when the value is already there", () => {
        const object = { a: { b: 1 } };
        expect(setPath({ object, path: "a.b", value: 1 })).toBe(object);
    });

    it("creates missing parents and fills one sparse slot", () => {
        expect(setPath({ object: {}, path: "a.0.b", value: 1 })).toEqual({
            a: [{ b: 1 }],
        });
        const sparse = sparseTriple();
        const result = setPath({
            object: sparse,
            path: 1,
            value: 2,
        }) as unknown[];

        expect(result).toEqual([1, 2, 3]);
        expect(Object.hasOwn(sparse, 1)).toBe(false);
    });

    it("replaces the root for an empty path", () => {
        expect(setPath({ object: { a: 1 }, path: "", value: 5 })).toBe(5);
        const object = { a: 1 };
        expect(setPath({ object, path: "", value: object })).toBe(object);
    });

    it("returns undefined for a non-object root or an illegal path", () => {
        expect(setPath({ object: null, path: "a", value: 1 })).toBeUndefined();
        expect(setPath({ object: "ada", path: "a", value: 1 })).toBeUndefined();
        expect(
            setPath({ object: { a: 1 }, path: "a..b", value: 1 }),
        ).toBeUndefined();
    });

    it("throws for an unknown option or a rejected dangerous key", () => {
        expect(() =>
            setPath({
                object: {},
                path: "a",
                value: 1,
                pathStyle: "bad",
            } as unknown as SetPathParams),
        ).toThrow(
            '`pathStyle` must be "dot" or "json-pointer"; received "bad".',
        );
        expect(() =>
            setPath({
                object: {},
                path: "__proto__.polluted",
                value: true,
                prototypeKeys: "throw",
            }),
        ).toThrow(RangeError);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("does not pollute Object.prototype", () => {
        const payload = JSON.parse('{"__proto__": {"polluted": true}}');
        const skipped = setPath({
            object: {},
            path: "__proto__.polluted",
            value: true,
        });
        const kept = setPath({
            object: {},
            path: "__proto__",
            value: { polluted: true },
            prototypeKeys: "keep",
        });
        setPath({ object: payload, path: "ok", value: 1 });

        expect(skipped).toEqual({});
        expect(
            Object.getOwnPropertyDescriptor(kept as object, "__proto__")?.value,
        ).toEqual({ polluted: true });
        expect(Object.getPrototypeOf(kept)).toBe(Object.prototype);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });

    it("returns the written value for a safe key without changing the input", async () => {
        let fastCheck: typeof import("fast-check").default;
        try {
            fastCheck = (await import("fast-check")).default;
        } catch {
            return;
        }
        const nested = Object.freeze({ name: "Ada" });
        const input = Object.freeze({ nested });

        fastCheck.assert(
            fastCheck.property(
                fastCheck
                    .string()
                    .filter(
                        (key) =>
                            key !== "__proto__" &&
                            key !== "prototype" &&
                            key !== "constructor",
                    ),
                fastCheck.anything({ maxDepth: 2 }),
                (key, value) => {
                    const result = setPath({
                        object: input,
                        path: [key],
                        value,
                    });
                    expect(getPath({ object: result, path: [key] })).toBe(
                        value,
                    );
                    expect(input).toEqual({ nested: { name: "Ada" } });
                    expect(input.nested).toBe(nested);
                },
            ),
        );
    });
});
