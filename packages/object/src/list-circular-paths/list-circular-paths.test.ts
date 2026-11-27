import { describe, expect, it } from "vitest";
import { listCircularPaths } from "./list-circular-paths.js";

describe("listCircularPaths", () => {
    it("lists a self path", () => {
        const box: { self?: object } = {};
        box.self = box;
        expect(listCircularPaths(box)).toEqual(["self"]);
    });

    it("lists a nested path", () => {
        const child: { up?: object } = {};
        const root = { child };
        child.up = root;
        expect(listCircularPaths(root)).toEqual(["child.up"]);
    });

    it("lists an array cycle", () => {
        const items: unknown[] = [];
        items.push(items);
        expect(listCircularPaths(items)).toEqual(["[0]"]);
    });

    it("returns an empty array for a shared reference and for primitives", () => {
        const shared = { id: 1 };
        expect(listCircularPaths({ left: shared, right: shared })).toEqual([]);
        expect(listCircularPaths(1)).toEqual([]);
        expect(listCircularPaths(null)).toEqual([]);
        expect(listCircularPaths("ada")).toEqual([]);
    });

    it("formats a JSON pointer and falls back for an unknown style", () => {
        const box: { self?: object } = {};
        box.self = box;
        expect(
            listCircularPaths({ pathStyle: "json-pointer", value: box }),
        ).toEqual(["/self"]);
        expect(
            listCircularPaths({
                pathDelimiter: "",
                pathStyle: "nope" as "dot",
                value: box,
            }),
        ).toEqual(["self"]);
    });

    it("uses a custom delimiter", () => {
        const child: { up?: object } = {};
        const root = { child };
        child.up = root;
        expect(listCircularPaths({ pathDelimiter: "/", value: root })).toEqual([
            "child/up",
        ]);
    });

    it("lists more than one cycle edge", () => {
        const box: { left?: object; right?: object } = {};
        box.left = box;
        box.right = box;
        expect(listCircularPaths(box)).toEqual(["left", "right"]);
    });
});
