import { afterEach, describe, expect, it } from "vitest";
import type { UpdatePathParams } from "./update-path.types.js";
import { updatePath } from "./update-path.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("updatePath", () => {
    it("passes the current value to the updater and writes the result", () => {
        const object = { count: 1, nested: { n: 1 } };
        const result = updatePath({
            object,
            path: "count",
            updater: (current) => Number(current) + 1,
        }) as { count: number; nested: { n: number } };

        expect(result.count).toBe(2);
        expect(result.nested).toBe(object.nested);
        expect(object.count).toBe(1);
    });

    it("passes undefined when the path is missing and stores the new value", () => {
        const result = updatePath({
            object: { a: 1 },
            path: "b",
            updater: (current) => {
                expect(current).toBeUndefined();
                return "created";
            },
        });

        expect(result).toEqual({ a: 1, b: "created" });
    });

    it("returns the same object when the updater returns the current value", () => {
        const object = { a: 1 };
        expect(
            updatePath({ object, path: "a", updater: (current) => current }),
        ).toBe(object);
    });

    it("does not call the updater for an illegal path, a non-object, or a sparse read that is then set", () => {
        let calls = 0;
        const updater = (): number => {
            calls += 1;
            return 1;
        };

        expect(
            updatePath({ object: { a: 1 }, path: "a..b", updater }),
        ).toBeUndefined();
        expect(
            updatePath({ object: null, path: "a", updater }),
        ).toBeUndefined();
        expect(calls).toBe(0);

        const sparse = sparseTriple();
        const result = updatePath({
            object: sparse,
            path: 1,
            updater: (current) => {
                expect(current).toBeUndefined();
                return 2;
            },
        }) as unknown[];
        expect(result[1]).toBe(2);
        expect(Object.hasOwn(sparse, 1)).toBe(false);
    });

    it("throws TypeError when updater is not a function", () => {
        expect(() =>
            updatePath({
                object: { a: 1 },
                path: "a",
                updater: "no",
            } as unknown as UpdatePathParams),
        ).toThrow('`updater` must be a function; received "no".');
    });

    it("throws when a dangerous write is rejected and does not pollute", () => {
        let calls = 0;
        expect(() =>
            updatePath({
                object: {},
                path: "__proto__.polluted",
                prototypeKeys: "throw",
                updater: () => {
                    calls += 1;
                    return true;
                },
            }),
        ).toThrow(RangeError);
        expect(calls).toBe(1);
        const payload = JSON.parse('{"__proto__": {"polluted": true}}');
        updatePath({
            object: payload,
            path: "ok",
            updater: () => 1,
        });
        updatePath({
            object: {},
            path: "__proto__.polluted",
            updater: () => true,
        });
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
