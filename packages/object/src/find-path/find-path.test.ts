import { describe, expect, it } from "vitest";
import { findPath } from "./find-path.js";
import type { FindPathParams } from "./find-path.types.js";

describe("findPath", () => {
    it("returns the first depth-first dot path", () => {
        expect(
            findPath({
                object: { a: 1, b: { a: 2 } },
                predicate: (value) => value === 1,
            }),
        ).toBe("a");
    });

    it("formats array indexes and nested keys", () => {
        expect(
            findPath({
                object: { items: [{ id: 1 }, { id: 2 }] },
                predicate: (value) => value === 2,
            }),
        ).toBe("items[1].id");
    });

    it("formats a JSON pointer", () => {
        expect(
            findPath({
                object: { user: { id: 1 } },
                pathStyle: "json-pointer",
                predicate: (value) => value === 1,
            }),
        ).toBe("/user/id");
    });

    it("uses a custom delimiter", () => {
        expect(
            findPath({
                object: { user: { id: 1 } },
                pathDelimiter: "/",
                predicate: (value) => value === 1,
            }),
        ).toBe("user/id");
    });

    it("returns an empty path when the root matches", () => {
        expect(
            findPath({
                object: { id: 1 },
                predicate: (value, path, object) =>
                    value === object && path.length === 0,
            }),
        ).toBe("");
    });

    it("returns undefined when nothing matches", () => {
        expect(
            findPath({
                object: { id: 1 },
                predicate: () => false,
            }),
        ).toBeUndefined();
    });

    it("does not walk into a class instance", () => {
        class Box {
            id = 1;
        }
        const seen: unknown[] = [];
        expect(
            findPath({
                object: { box: new Box() },
                predicate: (value) => {
                    seen.push(value);
                    return false;
                },
            }),
        ).toBeUndefined();
        expect(seen).toHaveLength(2);
    });

    it("does not loop on a cycle", () => {
        const box: { self?: object; id: number } = { id: 1 };
        box.self = box;
        expect(
            findPath({
                object: box,
                predicate: (value) => value === 1,
            }),
        ).toBe("id");
    });

    it("throws when predicate or pathStyle is invalid", () => {
        const params = {
            object: {},
            predicate: 1,
        } as unknown as FindPathParams;
        expect(() => findPath(params)).toThrow(TypeError);
        expect(() =>
            findPath({
                object: {},
                pathStyle: "nope" as "dot",
                predicate: () => false,
            }),
        ).toThrow(RangeError);
    });
});
