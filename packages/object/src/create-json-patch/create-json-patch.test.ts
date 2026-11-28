import { describe, expect, it } from "vitest";
import { applyJSONPatch } from "../apply-json-patch/apply-json-patch.js";
import { jsonDataAreEqual } from "../utils/json-data.utils.js";
import { createJSONPatch } from "./create-json-patch.js";

const roundTrips: readonly (readonly [unknown, unknown])[] = [
    [{}, { a: 1 }],
    [
        { a: 1, b: 2 },
        { b: 2, c: 3 },
    ],
    [{ a: 1 }, { a: 1 }],
    [
        [1, 2, 3],
        [1, 9],
    ],
    [
        [1, 2],
        [1, 2, 3, 4],
    ],
    [{ a: [1, { b: 2 }] }, { a: [1, { b: 3, c: 4 }, 5] }],
    ["a", "b"],
    [null, false],
    [{ "a/b": 1, "m~n": 2 }, { "a/b": 3 }],
    [[1, 2, 3], [1]],
    [{ n: 1 }, ["n"]],
];

describe("createJSONPatch", () => {
    it("returns an empty patch when the values are equal", () => {
        expect(
            createJSONPatch({ first: { b: 1, a: 1 }, second: { a: 1, b: 1 } }),
        ).toEqual([]);
        expect(
            createJSONPatch({ first: Number.NaN, second: Number.NaN }),
        ).toEqual([]);
        expect(createJSONPatch({ first: -0, second: 0 })).toEqual([]);
        expect(
            createJSONPatch({
                first: new Date(0),
                second: new Date(0),
            }),
        ).toEqual([]);
    });

    it("does not emit move and round-trips through apply", () => {
        for (const [first, second] of roundTrips) {
            const patch = createJSONPatch({ first, second });
            expect(patch.every((operation) => operation.op !== "move")).toBe(
                true,
            );
            expect(patch.every((operation) => operation.op !== "copy")).toBe(
                true,
            );
            const applied = applyJSONPatch({ object: first, patch });
            expect(jsonDataAreEqual(applied, second)).toBe(true);
        }
    });

    it("compares arrays by index", () => {
        expect(
            createJSONPatch({ first: ["a", "b"], second: ["b", "a"] }),
        ).toEqual([
            { op: "replace", path: "/0", value: "b" },
            { op: "replace", path: "/1", value: "a" },
        ]);
    });

    it("replaces the root when the kinds differ", () => {
        expect(createJSONPatch({ first: { a: 1 }, second: [1] })).toEqual([
            { op: "replace", path: "", value: [1] },
        ]);
    });

    it("stores a clone of the inserted value", () => {
        const second = { a: { n: 1 } };
        const patch = createJSONPatch({ first: {}, second });
        second.a.n = 5;

        expect(patch).toEqual([{ op: "add", path: "/a", value: { n: 1 } }]);
    });

    it("replaces a cyclic value at the root", () => {
        const first: { n: number; self?: unknown } = { n: 1 };
        first.self = first;
        const second: { n: number; self?: unknown } = { n: 2 };
        second.self = second;
        const patch = createJSONPatch({ first, second });

        expect(patch).toHaveLength(1);
        expect(patch[0]?.op).toBe("replace");
        expect(patch[0]?.path).toBe("");
        const value = patch[0]?.value as { n: number; self?: unknown };
        expect(value.n).toBe(2);
        expect(value.self).toBe(value);
    });

    it("treats two equal cycles as unchanged", () => {
        const first: { self?: unknown } = {};
        first.self = first;
        const second: { self?: unknown } = {};
        second.self = second;

        expect(createJSONPatch({ first, second })).toEqual([]);
    });

    it("compares holes, dates, and array cycles", () => {
        const left = [1, 2, 3];
        delete left[1];
        const right = [1, 2, 3];
        expect(createJSONPatch({ first: left, second: right })[0]?.op).toBe(
            "replace",
        );
        expect(
            createJSONPatch({
                first: { when: new Date(1) },
                second: { when: {} },
            })[0]?.path,
        ).toBe("/when");
        const cycle: unknown[] = [1];
        cycle.push(cycle);
        const patch = createJSONPatch({ first: cycle, second: { a: 1 } });
        expect(patch).toEqual([{ op: "replace", path: "", value: { a: 1 } }]);
        const dated = new Date(1);
        expect(
            createJSONPatch({
                first: { when: dated, n: 1 },
                second: { when: dated, n: 2 },
            }).some((operation) => operation.path === "/n"),
        ).toBe(true);
    });

    it("throws when params is not a plain object", () => {
        expect(() => createJSONPatch(null as never)).toThrow(TypeError);
        expect(() => createJSONPatch([] as never)).toThrow(TypeError);
    });
});
