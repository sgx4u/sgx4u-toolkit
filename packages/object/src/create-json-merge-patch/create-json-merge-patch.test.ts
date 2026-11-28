import { describe, expect, it } from "vitest";
import { applyJSONMergePatch } from "../apply-json-merge-patch/apply-json-merge-patch.js";
import { createJSONMergePatch } from "./create-json-merge-patch.js";

describe("createJSONMergePatch", () => {
    it("returns an empty object when two objects are equal", () => {
        expect(
            createJSONMergePatch({
                first: { a: 1, b: 1 },
                second: { b: 1, a: 1 },
            }),
        ).toEqual({});
    });

    it("removes missing keys, copies new keys, and recurses into objects", () => {
        expect(
            createJSONMergePatch({
                first: { a: "b", b: "c" },
                second: { a: "b", d: "e" },
            }),
        ).toEqual({ b: null, d: "e" });
        expect(
            createJSONMergePatch({
                first: { a: { b: 1, c: 2 } },
                second: { a: { b: 1 } },
            }),
        ).toEqual({ a: { c: null } });
        expect(
            createJSONMergePatch({
                first: { a: { b: 1 }, c: 2 },
                second: { a: { b: 1 }, c: 3 },
            }),
        ).toEqual({ c: 3 });
    });

    it("replaces arrays and returns a non-object second value when it is JSON", () => {
        expect(
            createJSONMergePatch({ first: { a: [1, 2] }, second: { a: [1] } }),
        ).toEqual({ a: [1] });
        expect(
            createJSONMergePatch({ first: { a: 1 }, second: [1, 2] }),
        ).toEqual([1, 2]);
        expect(createJSONMergePatch({ first: 1, second: 2 })).toBe(2);
        expect(
            createJSONMergePatch({ first: { a: 1 }, second: null }),
        ).toBeNull();
    });

    it("returns undefined when a nested change is not JSON", () => {
        const shared = [1];
        expect(
            createJSONMergePatch({
                first: { a: { b: { c: 1 } } },
                second: { a: { b: { c: () => 1 } } },
            }),
        ).toBeUndefined();
        expect(
            createJSONMergePatch({
                first: { a: 1 },
                second: { a: () => 1 },
            }),
        ).toBeUndefined();
        expect(
            createJSONMergePatch({
                first: 1,
                second: { a: shared, b: shared },
            }),
        ).toEqual({ a: [1], b: [1] });
    });

    it("returns undefined when the second value is not JSON", () => {
        expect(
            createJSONMergePatch({ first: 1, second: undefined }),
        ).toBeUndefined();
        expect(
            createJSONMergePatch({ first: 1, second: Number.NaN }),
        ).toBeUndefined();
        expect(
            createJSONMergePatch({ first: {}, second: () => 1 }),
        ).toBeUndefined();
        expect(
            createJSONMergePatch({
                first: {},
                second: { a: undefined },
            }),
        ).toBeUndefined();
    });

    it("round-trips through applyJSONMergePatch", () => {
        const first = { a: 1, b: { c: 2, d: 3 } };
        const second = { b: { c: 2, e: 4 }, f: [1] };
        const patch = createJSONMergePatch({ first, second });
        expect(applyJSONMergePatch({ object: first, patch })).toEqual(second);
        expect(first).toEqual({ a: 1, b: { c: 2, d: 3 } });
    });

    it("clones the inserted value", () => {
        const second = { a: { n: 1 } };
        const patch = createJSONMergePatch({ first: {}, second }) as {
            a: { n: number };
        };
        second.a.n = 4;
        expect(patch.a.n).toBe(1);
    });

    it("throws when params is not a plain object", () => {
        expect(() => createJSONMergePatch(undefined as never)).toThrow(
            TypeError,
        );
    });
});
