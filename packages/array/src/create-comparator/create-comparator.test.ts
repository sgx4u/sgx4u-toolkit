import { describe, expect, it } from "vitest";
import type { CreateComparatorParams } from "./create-comparator.types.js";
import { createComparator } from "./create-comparator.js";

describe("createComparator", () => {
    it("returns -1, 0, or 1 and calls the iteratee with index 0", () => {
        const seen: Array<{ index: number; array: readonly string[] }> = [];
        const params: CreateComparatorParams<string> = {
            keys: [
                (item, index, array) => {
                    seen.push({ index, array });
                    return item;
                },
            ],
            locale: "en-US",
        };
        const comparator = createComparator(params);
        expect(comparator("a", "b")).toBe(-1);
        expect(comparator("b", "a")).toBe(1);
        expect(comparator("a", "a")).toBe(0);
        expect(seen).toEqual([
            { index: 0, array: ["a"] },
            { index: 0, array: ["b"] },
            { index: 0, array: ["b"] },
            { index: 0, array: ["a"] },
            { index: 0, array: ["a"] },
            { index: 0, array: ["a"] },
        ]);
    });

    it("uses mixed directions and numeric order for en-US and en-IN", () => {
        const rows = [
            { group: "b", label: "item10" },
            { group: "a", label: "item2" },
            { group: "a", label: "item10" },
        ];
        for (const locale of ["en-US", "en-IN"] as const) {
            const comparator = createComparator({
                keys: [
                    { by: "group", direction: "ascending" },
                    { by: "label", direction: "ascending", numeric: true },
                ],
                locale,
            });
            const sorted = rows.toSorted(comparator);
            expect(sorted).toEqual([
                { group: "a", label: "item2" },
                { group: "a", label: "item10" },
                { group: "b", label: "item10" },
            ]);
        }
    });

    it("places nulls first or last without flipping for direction", () => {
        const first = createComparator<number | null>({
            keys: [(item) => item],
            nulls: "first",
            locale: "en-US",
        });
        expect(first(null, 1)).toBe(-1);
        expect(first(1, null)).toBe(1);
        const last = createComparator<number | null>({
            keys: [{ by: (item) => item, direction: "descending" }],
            nulls: "last",
            locale: "en-US",
        });
        expect(last(null, 1)).toBe(1);
        expect(last(2, 1)).toBe(-1);
    });

    it("treats every pair as a tie when keys is empty", () => {
        const comparator = createComparator<number>({
            keys: [],
            locale: "en-US",
        });
        expect(comparator(2, 1)).toBe(0);
    });

    it("throws when keys or an option is invalid and does not return undefined", () => {
        expect(() => createComparator(null as never)).toThrow(TypeError);
        expect(() => createComparator({} as never)).toThrow(TypeError);
        expect(() =>
            createComparator({ keys: "name" as never, locale: "en-US" }),
        ).toThrow(TypeError);
        expect(() =>
            createComparator({
                keys: [(item: number) => item],
                direction: "sideways" as never,
                locale: "en-US",
            }),
        ).toThrow(RangeError);
        expect(() =>
            createComparator({
                keys: [(item: number) => item],
                sensitivity: "high" as never,
                locale: "en-US",
            }),
        ).toThrow(RangeError);
        expect(() =>
            createComparator({
                keys: [(item: number) => item],
                nulls: "middle" as never,
                locale: "en-US",
            }),
        ).toThrow(RangeError);
    });
});
