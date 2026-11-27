import { afterEach, describe, expect, it } from "vitest";
import type { HasPathParams } from "./has-path.types.js";
import { hasPath } from "./has-path.js";

function sparseTriple(): number[] {
    const values: number[] = [];
    values[0] = 1;
    values[2] = 3;
    return values;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("hasPath", () => {
    it("reports own keys and ignores inherited keys by default", () => {
        const child = Object.create({ id: 1 }) as { name?: string };
        child.name = "Ada";

        expect(hasPath({ object: child, path: "name" })).toBe(true);
        expect(hasPath({ object: child, path: "id" })).toBe(false);
        expect(hasPath({ object: child, path: "id", inherited: true })).toBe(
            true,
        );
        expect(hasPath({ object: {}, path: "toString" })).toBe(false);
        expect(hasPath({ object: {}, path: "toString", inherited: true })).toBe(
            true,
        );
    });

    it("returns false for a sparse hole even when inherited is true", () => {
        const sparse = sparseTriple();

        expect(hasPath({ object: sparse, path: 1 })).toBe(false);
        expect(hasPath({ object: sparse, path: "1", inherited: true })).toBe(
            false,
        );
        expect(hasPath({ object: sparse, path: 0 })).toBe(true);
        expect(hasPath({ object: sparse, path: "2" })).toBe(true);
    });

    it("treats an empty path as present and an illegal path as missing", () => {
        expect(hasPath({ object: null, path: "" })).toBe(true);
        expect(hasPath({ object: 5, path: "" })).toBe(true);
        expect(hasPath({ object: { a: 1 }, path: "a..b" })).toBe(false);
        expect(hasPath({ object: { a: 1 }, path: "missing" })).toBe(false);
    });

    it("returns false for unknown options and never throws", () => {
        const object = { a: 1 };
        const cases = [
            {
                object,
                path: "a",
                pathStyle: "bad",
            },
            { object, path: "a", pathDelimiter: "" },
            {
                object,
                path: "a",
                prototypeKeys: "bad",
            },
            {
                object,
                path: "a",
                inherited: "yes",
            },
        ] as unknown as HasPathParams[];

        for (const params of cases) {
            expect(() => hasPath(params)).not.toThrow();
            expect(hasPath(params)).toBe(false);
        }
    });

    it("does not throw for prototypeKeys throw and does not pollute", () => {
        const payload = JSON.parse('{"__proto__": {"polluted": true}}');

        expect(
            hasPath({
                object: payload,
                path: "__proto__.polluted",
                prototypeKeys: "throw",
            }),
        ).toBe(false);
        expect(
            hasPath({
                object: payload,
                path: "__proto__",
                prototypeKeys: "keep",
            }),
        ).toBe(true);
        expect(hasPath({ object: {}, path: "__proto__.polluted" })).toBe(false);
        expect(({} as { polluted?: unknown }).polluted).toBeUndefined();
    });
});
