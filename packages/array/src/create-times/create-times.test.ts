import { describe, expect, it } from "vitest";
import { createTimes } from "./create-times.js";

describe("createTimes", () => {
    it("returns the indexes", () => {
        expect(createTimes({ count: 4 })).toEqual([0, 1, 2, 3]);
    });

    it("returns an empty array when count is 0", () => {
        expect(createTimes({ count: 0 })).toEqual([]);
    });

    it("maps each index", () => {
        expect(
            createTimes({ count: 3, mapper: (index: number) => index * 2 }),
        ).toEqual([0, 2, 4]);
    });

    it("throws when count is not a non-negative integer", () => {
        expect(() => createTimes({} as never)).toThrow(TypeError);
        expect(() => createTimes(null as never)).toThrow(TypeError);
        expect(() => createTimes("text" as never)).toThrow(TypeError);
        expect(() => createTimes({ count: -1 })).toThrow(RangeError);
        expect(() => createTimes({ count: 1.5 })).toThrow(RangeError);
        expect(() => createTimes({ count: "2" as never })).toThrow(TypeError);
    });

    it("throws when mapper is present and is not a function", () => {
        expect(() => createTimes({ count: 2, mapper: "no" as never })).toThrow(
            '`mapper` must be a function; received "no".',
        );
    });
});
