import { afterEach, describe, expect, it } from "vitest";
import { applyJSONMergePatch } from "./apply-json-merge-patch.js";

function polluted(): unknown {
    return ({} as { polluted?: unknown }).polluted;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("applyJSONMergePatch", () => {
    it("merges objects, removes null keys, and does not mutate", () => {
        const source = { a: { b: 1, keep: true }, c: 2 };
        const result = applyJSONMergePatch({
            object: source,
            patch: { a: { b: 3 }, c: null, d: 4 },
        });

        expect(result).toEqual({ a: { b: 3, keep: true }, d: 4 });
        expect(source).toEqual({ a: { b: 1, keep: true }, c: 2 });
        expect(source.a).not.toBe((result as { a: object }).a);
    });

    it("replaces the document when the patch is not a plain object", () => {
        expect(
            applyJSONMergePatch({ object: { a: 1 }, patch: [1, 2] }),
        ).toEqual([1, 2]);
        expect(
            applyJSONMergePatch({ object: { a: 1 }, patch: null }),
        ).toBeNull();
        expect(applyJSONMergePatch({ object: { a: 1 }, patch: 4 })).toBe(4);
        const date = new Date(5);
        const cloned = applyJSONMergePatch({ object: {}, patch: date });
        expect(cloned).toEqual(date);
        expect(cloned).not.toBe(date);
    });

    it("starts from an empty object when the target is not a plain object", () => {
        expect(applyJSONMergePatch({ object: [1], patch: { a: 1 } })).toEqual({
            a: 1,
        });
        expect(
            applyJSONMergePatch({ object: null, patch: { a: { b: 1 } } }),
        ).toEqual({ a: { b: 1 } });
    });

    it("does not pollute Object.prototype from a __proto__ key", () => {
        const patch = JSON.parse(
            '{"__proto__": {"polluted": true}, "a": 1}',
        ) as {
            a: number;
        };
        const result = applyJSONMergePatch({ object: {}, patch });

        expect(polluted()).toBeUndefined();
        expect(result).toEqual({ a: 1 });
        expect(Object.hasOwn(result as object, "__proto__")).toBe(false);

        const nested = JSON.parse(
            '{"a": {"__proto__": {"polluted": true}}}',
        ) as {
            a: object;
        };
        applyJSONMergePatch({ object: { a: { b: 1 } }, patch: nested });
        expect(polluted()).toBeUndefined();
    });

    it("keeps or throws for a dangerous key when asked", () => {
        const patch = JSON.parse('{"__proto__": {"polluted": true}}') as object;
        const kept = applyJSONMergePatch({
            object: {},
            patch,
            prototypeKeys: "keep",
        });
        expect(polluted()).toBeUndefined();
        expect(Object.hasOwn(kept as object, "__proto__")).toBe(true);

        expect(() =>
            applyJSONMergePatch({
                object: {},
                patch,
                prototypeKeys: "throw",
            }),
        ).toThrow(RangeError);
        expect(polluted()).toBeUndefined();
    });

    it("throws when params or prototypeKeys is invalid", () => {
        expect(() => applyJSONMergePatch(null as never)).toThrow(TypeError);
        expect(() =>
            applyJSONMergePatch({
                object: {},
                patch: {},
                prototypeKeys: "nope" as never,
            }),
        ).toThrow(RangeError);
    });

    it("removes a key whose patch value is null and clones a replacement array", () => {
        const patch = { items: [1, { n: 1 }] };
        const result = applyJSONMergePatch({
            object: { items: [0], extra: true },
            patch,
        }) as { items: { n?: number }[]; extra: boolean };
        expect(result).toEqual({ items: [1, { n: 1 }], extra: true });
        patch.items[1] = { n: 9 };
        expect(result.items[1]).toEqual({ n: 1 });
    });
});
