import { describe, expect, it } from "vitest";
import type { CreateWindowsParams } from "./create-windows.types.js";
import { createWindows } from "./create-windows.js";

function* generate(): Generator<number, void, unknown> {
    yield 1;
}

function sparse(): number[] {
    const array: number[] = [];
    array[0] = 1;
    array[2] = 3;
    return array;
}

describe("createWindows", () => {
    it("slides by step and keeps a short tail by default", () => {
        const params: CreateWindowsParams<number> = {
            array: [1, 2, 3, 4, 5],
            size: 3,
            step: 2,
        };
        const result = createWindows(params);
        expect(result).toEqual([[1, 2, 3], [3, 4, 5], [5]]);
        expect(result).not.toBe(params.array);
    });

    it("drops a short tail when partial is false", () => {
        expect(
            createWindows({
                array: [1, 2, 3, 4],
                size: 3,
                step: 2,
                partial: false,
            }),
        ).toEqual([[1, 2, 3]]);
        expect(
            createWindows({
                array: [1, 2],
                size: 3,
                partial: false,
            }),
        ).toEqual([]);
        expect(createWindows({ array: [1, 2, 3], size: 3 })).toEqual([
            [1, 2, 3],
            [2, 3],
            [3],
        ]);
    });

    it("returns an empty array for an empty array", () => {
        const array: number[] = [];
        const result = createWindows({ array, size: 2 });
        expect(result).toEqual([]);
        expect(result).not.toBe(array);
    });

    it("returns undefined for a non-object and for a non-array field", () => {
        expect(createWindows(null)).toBeUndefined();
        expect(createWindows("text")).toBeUndefined();
        expect(createWindows(generate)).toBeUndefined();
        const invalidArrays = [
            null,
            {},
            "text",
            new Uint8Array([1]),
            new Set([1]),
            generate(),
        ];
        for (const array of invalidArrays) {
            expect(
                createWindows({ array: array as never, size: 1 }),
            ).toBeUndefined();
        }
    });

    it("does not mutate a frozen array", () => {
        const array = Object.freeze([1, 2, 3, 4]);
        const result = createWindows({ array, size: 2, step: 2 });
        expect(result).toEqual([
            [1, 2],
            [3, 4],
        ]);
        expect(result).not.toBe(array);
        expect(array).toEqual([1, 2, 3, 4]);
    });

    it("copies holes as undefined", () => {
        expect(createWindows({ array: sparse(), size: 2, step: 2 })).toEqual([
            [1, undefined],
            [3],
        ]);
    });

    it("throws when size or step is not a positive finite integer", () => {
        expect(() => createWindows({ array: [1], size: 0 })).toThrow(
            RangeError,
        );
        expect(() => createWindows({ array: [1], size: 2, step: 0 })).toThrow(
            RangeError,
        );
        expect(() => createWindows({ array: [1], size: "2" as never })).toThrow(
            TypeError,
        );
        expect(() => createWindows({ array: [1], size: 1, step: 1.5 })).toThrow(
            RangeError,
        );
        expect(() => createWindows({ array: [1] } as never)).toThrow(TypeError);
        expect(() =>
            createWindows({ array: "text" as never, size: 0 }),
        ).toThrow(RangeError);
    });
});
