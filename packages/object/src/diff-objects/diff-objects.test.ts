import { describe, expect, it } from "vitest";
import { valuesAreEqual } from "../utils/equal.utils.js";
import { diffObjects } from "./diff-objects.js";

const equalOptions = {
    includeNonEnumerable: false,
    includeSymbols: false,
} as const;

describe("diffObjects", () => {
    it("returns unchanged for equal values", () => {
        expect(diffObjects({ first: { a: 1 }, second: { a: 1 } })).toEqual({
            kind: "unchanged",
        });
        expect(diffObjects({ first: Number.NaN, second: Number.NaN })).toEqual({
            kind: "unchanged",
        });
        expect(diffObjects({ first: [1, 2], second: [1, 2] })).toEqual({
            kind: "unchanged",
        });
    });

    it("diffs added, removed, and changed object keys", () => {
        expect(
            diffObjects({
                first: { id: 1, city: "Paris" },
                second: { id: 2, name: "Ada" },
            }),
        ).toEqual({
            kind: "object",
            properties: {
                city: { kind: "removed", value: "Paris" },
                id: { kind: "changed", from: 1, to: 2 },
                name: { kind: "added", value: "Ada" },
            },
        });
    });

    it("nests object diffs", () => {
        const diff = diffObjects({
            first: { user: { name: "Ada", city: "Paris" } },
            second: { user: { name: "Ada", city: "Lyon" } },
        });
        expect(diff).toEqual({
            kind: "object",
            properties: {
                user: {
                    kind: "object",
                    properties: {
                        city: { kind: "changed", from: "Paris", to: "Lyon" },
                    },
                },
            },
        });
    });

    it("diffs arrays by index, including a longer tail", () => {
        expect(diffObjects({ first: [1, 2, 3], second: [1, 9, 3, 4] })).toEqual(
            {
                kind: "array",
                items: [
                    { index: 1, diff: { kind: "changed", from: 2, to: 9 } },
                    { index: 3, diff: { kind: "added", value: 4 } },
                ],
            },
        );
    });

    it("reports removed indexes for a shorter array", () => {
        expect(diffObjects({ first: [1, 2, 3, 4], second: [1, 8, 3] })).toEqual(
            {
                kind: "array",
                items: [
                    { index: 1, diff: { kind: "changed", from: 2, to: 8 } },
                    { index: 3, diff: { kind: "removed", value: 4 } },
                ],
            },
        );
    });

    it("reports a type change", () => {
        expect(diffObjects({ first: { a: 1 }, second: [1] })).toEqual({
            kind: "changed",
            from: { a: 1 },
            to: [1],
        });
        expect(diffObjects({ first: 1, second: "1" })).toEqual({
            kind: "changed",
            from: 1,
            to: "1",
        });
    });

    it("ignores symbol keys unless includeSymbols is set", () => {
        const marker = Symbol("id");
        const first = { a: 1, [marker]: 1 };
        const second = { a: 1, [marker]: 2 };
        expect(diffObjects({ first, second })).toEqual({ kind: "unchanged" });
        expect(diffObjects({ first, includeSymbols: true, second }).kind).toBe(
            "changed",
        );
    });

    it("does not loop on a cycle", () => {
        const first: { n: number; self?: object } = { n: 1 };
        const second: { n: number; self?: object } = { n: 2 };
        first.self = first;
        second.self = second;
        const diff = diffObjects({ first, second });
        expect(diff).toEqual({
            kind: "object",
            properties: {
                n: { kind: "changed", from: 1, to: 2 },
            },
        });
        expect(valuesAreEqual(first, second, equalOptions)).toBe(false);
    });
});
