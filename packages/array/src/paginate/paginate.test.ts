import { describe, expect, it } from "vitest";
import { paginate } from "./paginate.js";

const letters = ["a", "b", "c", "d", "e"] as const;

describe("paginate", () => {
    it("returns the first page", () => {
        const page = paginate({ array: letters, page: 1, pageSize: 2 });
        expect(page).toEqual({
            items: ["a", "b"],
            page: 1,
            pageSize: 2,
            pageCount: 3,
            totalCount: 5,
            offset: 0,
            hasPreviousPage: false,
            hasNextPage: true,
        });
        expect(page?.items).not.toBe(letters);
    });

    it("returns a middle page", () => {
        expect(paginate({ array: letters, page: 2, pageSize: 2 })).toEqual({
            items: ["c", "d"],
            page: 2,
            pageSize: 2,
            pageCount: 3,
            totalCount: 5,
            offset: 2,
            hasPreviousPage: true,
            hasNextPage: true,
        });
    });

    it("returns an empty item list past the end", () => {
        expect(paginate({ array: letters, page: 4, pageSize: 2 })).toEqual({
            items: [],
            page: 4,
            pageSize: 2,
            pageCount: 3,
            totalCount: 5,
            offset: 6,
            hasPreviousPage: true,
            hasNextPage: false,
        });
    });

    it("reports zero pages for an empty source", () => {
        const source = Object.freeze([] as string[]);
        expect(paginate({ array: source, page: 1, pageSize: 2 })).toEqual({
            items: [],
            page: 1,
            pageSize: 2,
            pageCount: 0,
            totalCount: 0,
            offset: 0,
            hasPreviousPage: false,
            hasNextPage: false,
        });
        expect(
            paginate({ array: source, page: 2, pageSize: 2 })?.hasPreviousPage,
        ).toBe(false);
    });

    it("returns one item when pageSize is 1", () => {
        expect(paginate({ array: letters, page: 3, pageSize: 1 })).toEqual({
            items: ["c"],
            page: 3,
            pageSize: 1,
            pageCount: 5,
            totalCount: 5,
            offset: 2,
            hasPreviousPage: true,
            hasNextPage: true,
        });
    });

    it("returns undefined when array is not an array", () => {
        expect(
            paginate({ array: "no", page: 1, pageSize: 1 } as never),
        ).toBeUndefined();
    });

    it("densifies a sparse hole", () => {
        const values: number[] = [];
        values[0] = 1;
        values[2] = 3;
        const page = paginate({ array: values, page: 1, pageSize: 3 });
        expect(page?.items).toEqual([1, undefined, 3]);
        expect(1 in (page?.items ?? [])).toBe(true);
    });

    it("throws when page or pageSize is unusable", () => {
        expect(() =>
            paginate({ array: letters, page: 0, pageSize: 1 }),
        ).toThrow(
            "`page` must be a finite integer greater than or equal to 1; received 0.",
        );
        expect(() =>
            paginate({ array: letters, page: 1.5, pageSize: 1 }),
        ).toThrow(RangeError);
        expect(() =>
            paginate({ array: letters, page: 1, pageSize: 0 }),
        ).toThrow(RangeError);
    });
});
