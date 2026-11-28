import { describe, expect, it } from "vitest";
import { flattenTree } from "./flatten-tree.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

interface TreeNode {
    id: string;
    children?: unknown;
    kids?: TreeNode[];
}

const invalidArrays: readonly (readonly [string, unknown])[] = [
    ["null", null],
    ["an empty object", {}],
    ["a string", "text"],
    ["a typed array", new Uint8Array()],
    ["a set", new Set()],
    ["a generator", generate()],
];

describe("flattenTree", () => {
    it("walks depth-first and emits a node before its children", () => {
        const forest: TreeNode[] = [
            {
                id: "a",
                children: [{ id: "b", children: [{ id: "c" }] }, { id: "d" }],
            },
        ];
        expect(flattenTree({ array: forest })?.map((node) => node.id)).toEqual([
            "a",
            "b",
            "c",
            "d",
        ]);
    });

    it("uses getChildren instead of childrenKey", () => {
        const forest: TreeNode[] = [
            {
                id: "root",
                children: [{ id: "ignored" }],
                kids: [{ id: "kept" }],
            },
        ];
        const result = flattenTree({
            array: forest,
            getChildren: (node) => node.kids,
        });

        expect(result?.map((node) => node.id)).toEqual(["root", "kept"]);
    });

    it("treats missing or non-array children as a leaf", () => {
        const mixed = flattenTree({
            array: [{ id: "a", children: "no" }, { id: "b" }, 1],
        });
        expect(
            mixed?.map((node) =>
                typeof node === "object" && node !== null && "id" in node
                    ? node.id
                    : node,
            ),
        ).toEqual(["a", "b", 1]);
    });

    it("skips an object that is already on the path", () => {
        const node: TreeNode = { id: "loop", children: [] };
        node.children = [node];
        const result = flattenTree({ array: [node] });

        expect(result).toEqual([node]);
    });

    it("emits a shared child again when it is not an ancestor", () => {
        const child = { id: "child" };
        const left = { id: "left", children: [child] };
        const right = { id: "right", children: [child] };
        expect(
            flattenTree({ array: [left, right] })?.map((node) => node.id),
        ).toEqual(["left", "child", "right", "child"]);
    });

    it("returns an empty array for an empty forest", () => {
        const array: TreeNode[] = [];
        const result = flattenTree({ array });

        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("reads a custom children key", () => {
        expect(
            flattenTree({
                array: [{ id: "a", kids: [{ id: "b" }] }],
                childrenKey: "kids",
            })?.map((node) => node.id),
        ).toEqual(["a", "b"]);
    });

    it("returns undefined for a non-object", () => {
        expect(flattenTree(null as never)).toBeUndefined();
        expect(flattenTree("text" as never)).toBeUndefined();
        expect(flattenTree(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s",
        (_label, array) => {
            expect(flattenTree({ array: array as never })).toBeUndefined();
        },
    );

    it("throws when getChildren is present and is not a function", () => {
        expect(() =>
            flattenTree({ array: [], getChildren: "no" as never }),
        ).toThrow(TypeError);
        expect(() => flattenTree({ getChildren: 1 } as never)).toThrow(
            TypeError,
        );
    });

    it("does not mutate a frozen node", () => {
        const child = Object.freeze({ id: "b" });
        const root = Object.freeze({
            id: "a",
            children: Object.freeze([child]),
        });
        const array = Object.freeze([root]);
        const result = flattenTree({ array });

        expect(result).toEqual([root, child]);
        expect(result).not.toBe(array);
        expect(array[0]).toBe(root);
    });

    it("treats a sparse hole as undefined", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = [{ id: "a" }, , { id: "c" }] as TreeNode[];
        const result = flattenTree({ array });

        expect(result?.[1]).toBeUndefined();
        expect(1 in array).toBe(false);
    });
});
