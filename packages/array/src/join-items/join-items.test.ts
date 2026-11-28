import { describe, expect, it } from "vitest";
import { joinItems } from "./join-items.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

const invalidArrays: readonly (readonly [string, unknown])[] = [
    ["null", null],
    ["an empty object", {}],
    ["a string", "text"],
    ["a typed array", new Uint8Array()],
    ["a set", new Set()],
    ["a generator", generate()],
];

describe("joinItems", () => {
    it("joins three items with a different last separator", () => {
        expect(
            joinItems({ array: ["A", "B", "C"], lastSeparator: ", and " }),
        ).toBe("A, B, and C");
    });

    it("uses only the last separator for two items", () => {
        expect(joinItems({ array: ["A", "B"], lastSeparator: " and " })).toBe(
            "A and B",
        );
        expect(joinItems({ array: ["A", "B"] })).toBe("A, B");
    });

    it("returns the formatted item for one item and an empty string for none", () => {
        expect(joinItems({ array: ["A"] })).toBe("A");
        expect(joinItems({ array: [] })).toBe("");
    });

    it("uses a custom format and separator", () => {
        expect(
            joinItems({
                array: [1, 2, 3],
                separator: "-",
                format: (item, index) => `${index}:${item}`,
            }),
        ).toBe("0:1-1:2-2:3");
    });

    it("returns undefined for a non-object", () => {
        expect(joinItems(null as never)).toBeUndefined();
        expect(joinItems("text" as never)).toBeUndefined();
        expect(joinItems(generate as never)).toBeUndefined();
    });

    it.each(invalidArrays)(
        "returns undefined when array is %s",
        (_label, array) => {
            expect(joinItems({ array: array as never })).toBeUndefined();
        },
    );

    it("throws when format is present and is not a function", () => {
        expect(() =>
            joinItems({ array: ["A"], format: "no" as never }),
        ).toThrow('`format` must be a function; received "no".');
        expect(() => joinItems({ format: 1 } as never)).toThrow(TypeError);
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze(["A", "B", "C"]);
        expect(joinItems({ array, lastSeparator: ", and " })).toBe(
            "A, B, and C",
        );
        expect(array).toEqual(["A", "B", "C"]);
    });

    it("formats a sparse hole with String", () => {
        // eslint-disable-next-line no-sparse-arrays -- hole under test
        const array = ["A", , "C"] as string[];
        expect(joinItems({ array })).toBe("A, undefined, C");
        expect(1 in array).toBe(false);
    });
});
