import { afterEach, describe, expect, it } from "vitest";
import type { JSONPatchOperation } from "../types/json-patch.types.js";
import { applyJSONPatch } from "./apply-json-patch.js";

function polluted(): unknown {
    return ({} as { polluted?: unknown }).polluted;
}

afterEach(() => {
    delete (Object.prototype as { polluted?: unknown }).polluted;
});

describe("applyJSONPatch", () => {
    it("adds, replaces, removes, and leaves the input in place", () => {
        const source = { a: 1, nested: { b: 2 } };
        const result = applyJSONPatch({
            object: source,
            patch: [
                { op: "add", path: "/c", value: 3 },
                { op: "replace", path: "/nested/b", value: 9 },
                { op: "remove", path: "/a" },
            ],
        });

        expect(result).toEqual({ nested: { b: 9 }, c: 3 });
        expect(source).toEqual({ a: 1, nested: { b: 2 } });
    });

    it("replaces the root for an empty add or replace", () => {
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "add", path: "", value: 5 }],
            }),
        ).toBe(5);
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "replace", path: "", value: [1] }],
            }),
        ).toEqual([1]);
    });

    it("inserts into an array and appends with the dash token", () => {
        const source = [1, 2, 3];

        expect(
            applyJSONPatch({
                object: source,
                patch: [{ op: "add", path: "/1", value: 9 }],
            }),
        ).toEqual([1, 9, 2, 3]);
        expect(
            applyJSONPatch({
                object: source,
                patch: [{ op: "add", path: "/-", value: 9 }],
            }),
        ).toEqual([1, 2, 3, 9]);
        expect(
            applyJSONPatch({
                object: source,
                patch: [{ op: "replace", path: "/1", value: 9 }],
            }),
        ).toEqual([1, 9, 3]);
        expect(
            applyJSONPatch({
                object: source,
                patch: [{ op: "remove", path: "/1" }],
            }),
        ).toEqual([1, 3]);
        expect(source).toEqual([1, 2, 3]);
    });

    it("shares an unchanged nested object", () => {
        const shared = { n: 1 };
        const source = { a: shared, b: 2 };
        const result = applyJSONPatch({
            object: source,
            patch: [{ op: "replace", path: "/b", value: 3 }],
        }) as { a: { n: number }; b: number };

        expect(result).toEqual({ a: { n: 1 }, b: 3 });
        expect(result.a).toBe(shared);
    });

    it("returns undefined for a failed test and does not return a partial edit", () => {
        const source = { a: 1, b: 2 };
        const result = applyJSONPatch({
            object: source,
            patch: [
                { op: "replace", path: "/a", value: 9 },
                { op: "test", path: "/b", value: 0 },
            ],
        });

        expect(result).toBeUndefined();
        expect(source).toEqual({ a: 1, b: 2 });
        expect(
            applyJSONPatch({
                object: source,
                patch: [{ op: "test", path: "/a", value: 1 }],
            }),
        ).toBe(source);
        expect(
            applyJSONPatch({
                object: { a: { b: 1 } },
                patch: [{ op: "test", path: "/a", value: { b: 1 } }],
            }),
        ).toEqual({ a: { b: 1 } });
    });

    it("fails a missing target when strict and skips it when not", () => {
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "remove", path: "/missing" }],
            }),
        ).toBeUndefined();
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [
                    { op: "remove", path: "/missing" },
                    { op: "replace", path: "/a", value: 2 },
                ],
                strict: false,
            }),
        ).toEqual({ a: 2 });
        expect(
            applyJSONPatch({
                object: [1],
                patch: [{ op: "add", path: "/5", value: 1 }],
                strict: false,
            }),
        ).toEqual([1]);
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "test", path: "/missing", value: 1 }],
                strict: false,
            }),
        ).toBeUndefined();
    });

    it("moves after removing, and copies a clone", () => {
        expect(
            applyJSONPatch({
                object: { a: 1, b: 2 },
                patch: [{ op: "move", from: "/a", path: "/c" }],
            }),
        ).toEqual({ b: 2, c: 1 });
        expect(
            applyJSONPatch({
                object: ["a", "b", "c"],
                patch: [{ op: "move", from: "/0", path: "/2" }],
            }),
        ).toEqual(["b", "c", "a"]);
        expect(
            applyJSONPatch({
                object: ["a", "b", "c"],
                patch: [{ op: "move", from: "/2", path: "/0" }],
            }),
        ).toEqual(["c", "a", "b"]);

        const copied = applyJSONPatch({
            object: { a: { b: 1 } },
            patch: [{ op: "copy", from: "/a", path: "/c" }],
        }) as { a: { b: number }; c: { b: number } };
        expect(copied).toEqual({ a: { b: 1 }, c: { b: 1 } });
        expect(copied.a).not.toBe(copied.c);
        copied.c.b = 9;
        expect(copied.a.b).toBe(1);
    });

    it("rejects a move into a child", () => {
        const source = { a: { b: 1 } };
        expect(
            applyJSONPatch({
                object: source,
                patch: [{ op: "move", from: "/a", path: "/a/c" }],
            }),
        ).toBeUndefined();
        expect(
            applyJSONPatch({
                object: source,
                patch: [{ op: "move", from: "/a", path: "/a/c" }],
                strict: false,
            }),
        ).toBeUndefined();
        expect(source).toEqual({ a: { b: 1 } });
    });

    it("throws before applying when a later operation is malformed", () => {
        const source = { a: 1 };
        expect(() =>
            applyJSONPatch({
                object: source,
                patch: [
                    { op: "replace", path: "/a", value: 2 },
                    { op: "nope", path: "/a" },
                ] as JSONPatchOperation[],
            }),
        ).toThrow(RangeError);
        expect(source).toEqual({ a: 1 });
        expect(() =>
            applyJSONPatch({
                object: source,
                patch: { op: "remove", path: "/a" } as never,
            }),
        ).toThrow(RangeError);
    });

    it("does not pollute Object.prototype from a dangerous pointer", () => {
        const skipped = applyJSONPatch({
            object: { a: 1 },
            patch: [
                { op: "add", path: "/__proto__/polluted", value: true },
                { op: "add", path: "/__proto__", value: { polluted: true } },
                { op: "replace", path: "/a", value: 2 },
            ],
        });

        expect(polluted()).toBeUndefined();
        expect(skipped).toEqual({ a: 2 });
        expect(Object.hasOwn(skipped as object, "__proto__")).toBe(false);

        const kept = applyJSONPatch({
            object: {},
            patch: [
                { op: "add", path: "/__proto__", value: { polluted: true } },
            ],
            prototypeKeys: "keep",
        });
        expect(polluted()).toBeUndefined();
        expect(Object.hasOwn(kept as object, "__proto__")).toBe(true);

        expect(() =>
            applyJSONPatch({
                object: {},
                patch: [{ op: "add", path: "/constructor", value: 1 }],
                prototypeKeys: "throw",
            }),
        ).toThrow(RangeError);
        expect(polluted()).toBeUndefined();
    });

    it("returns the same document for an empty patch", () => {
        const source = { a: 1 };
        expect(applyJSONPatch({ object: source, patch: [] })).toBe(source);
    });

    it("throws when params, strict, or prototypeKeys is invalid", () => {
        expect(() => applyJSONPatch(null as never)).toThrow(TypeError);
        expect(() =>
            applyJSONPatch({
                object: {},
                patch: [],
                strict: "yes" as never,
            }),
        ).toThrow(RangeError);
        expect(() =>
            applyJSONPatch({
                object: {},
                patch: [],
                prototypeKeys: "nope" as never,
            }),
        ).toThrow(RangeError);
    });

    it("skips a missing copy or move when strict is false", () => {
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "copy", from: "/missing", path: "/b" }],
                strict: false,
            }),
        ).toEqual({ a: 1 });
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "move", from: "/missing", path: "/b" }],
                strict: false,
            }),
        ).toEqual({ a: 1 });
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "copy", from: "/missing", path: "/b" }],
            }),
        ).toBeUndefined();
    });

    it("copies the root into a child without a cycle", () => {
        expect(
            applyJSONPatch({
                object: { b: 1 },
                patch: [{ op: "copy", from: "", path: "/a" }],
            }),
        ).toEqual({ b: 1, a: { b: 1 } });
    });

    it("fails when a parent is missing, primitive, or not an array index", () => {
        expect(
            applyJSONPatch({
                object: {},
                patch: [{ op: "add", path: "/a/b", value: 1 }],
            }),
        ).toBeUndefined();
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "replace", path: "/a/b", value: 2 }],
            }),
        ).toBeUndefined();
        expect(
            applyJSONPatch({
                object: 1,
                patch: [{ op: "add", path: "/a", value: 2 }],
            }),
        ).toBeUndefined();
        expect(
            applyJSONPatch({
                object: 1,
                patch: [{ op: "remove", path: "/a" }],
            }),
        ).toBeUndefined();
        expect(
            applyJSONPatch({
                object: [1, 2],
                patch: [{ op: "remove", path: "/foo" }],
            }),
        ).toBeUndefined();
        expect(
            applyJSONPatch({
                object: [1, 2],
                patch: [{ op: "replace", path: "/-", value: 3 }],
            }),
        ).toBeUndefined();
        const sparse = [1, 2, 3];
        delete sparse[1];
        expect(
            applyJSONPatch({
                object: sparse,
                patch: [{ op: "remove", path: "/1" }],
            }),
        ).toBeUndefined();
    });

    it("moves and copies only when the destination can be written", () => {
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "move", from: "", path: "" }],
            }),
        ).toBeUndefined();
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "move", from: "", path: "" }],
                strict: false,
            }),
        ).toEqual({ a: 1 });
        expect(
            applyJSONPatch({
                object: { a: 1, x: 2 },
                patch: [{ op: "move", from: "/x", path: "/missing/b" }],
            }),
        ).toBeUndefined();
        expect(
            applyJSONPatch({
                object: { a: 1, x: 2 },
                patch: [{ op: "move", from: "/x", path: "/missing/b" }],
                strict: false,
            }),
        ).toEqual({ a: 1, x: 2 });
        expect(
            applyJSONPatch({
                object: { a: { b: 1 }, x: 2 },
                patch: [{ op: "move", from: "/x", path: "/a/b" }],
            }),
        ).toEqual({ a: { b: 2 } });
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "copy", from: "/a", path: "/missing/b" }],
            }),
        ).toBeUndefined();
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "copy", from: "/a", path: "/missing/b" }],
                strict: false,
            }),
        ).toEqual({ a: 1 });
    });

    it("leaves a nested dangerous segment unchanged when it is skipped", () => {
        const child = { n: 1 };
        const result = applyJSONPatch({
            object: { a: child },
            patch: [
                { op: "add", path: "/a/__proto__", value: { polluted: true } },
            ],
        });
        expect(result).toEqual({ a: { n: 1 } });
        expect((result as { a: object }).a).toBe(child);
        expect(polluted()).toBeUndefined();
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "test", path: "/__proto__", value: {} }],
            }),
        ).toBeUndefined();
    });

    it("clones holes, dates, and class instances that are inserted", () => {
        const sparse = [1, 2];
        delete sparse[0];
        class Box {
            n = 1;
        }
        const box = new Box();
        const when = new Date(5);
        const result = applyJSONPatch({
            object: {},
            patch: [
                { op: "add", path: "/sparse", value: sparse },
                { op: "add", path: "/box", value: box },
                { op: "add", path: "/when", value: when },
            ],
        }) as { sparse: unknown[]; box: Box; when: Date };
        expect(0 in result.sparse).toBe(false);
        expect(result.box).toBe(box);
        expect(result.when).toEqual(when);
        expect(result.when).not.toBe(when);
    });

    it("removes the document only as a failure", () => {
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "remove", path: "" }],
            }),
        ).toBeUndefined();
        expect(
            applyJSONPatch({
                object: { a: 1 },
                patch: [{ op: "remove", path: "" }],
                strict: false,
            }),
        ).toEqual({ a: 1 });
    });
});
