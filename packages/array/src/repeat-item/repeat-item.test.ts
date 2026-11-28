import { describe, expect, it } from "vitest";
import { repeatItem } from "./repeat-item.js";

describe("repeatItem", () => {
    it("repeats the same reference", () => {
        const item = { id: 1 };
        const result = repeatItem({ item, count: 3 });

        expect(result).toEqual([item, item, item]);
        expect(result[0]).toBe(item);
        expect(result[1]).toBe(item);
        expect(result[2]).toBe(item);
    });

    it("returns an empty array when count is 0", () => {
        expect(repeatItem({ item: 1, count: 0 })).toEqual([]);
    });

    it("throws when count is not a non-negative integer", () => {
        expect(() => repeatItem({} as never)).toThrow(TypeError);
        expect(() => repeatItem(null as never)).toThrow(TypeError);
        expect(() => repeatItem("text" as never)).toThrow(TypeError);
        expect(() => repeatItem(new Uint8Array() as never)).toThrow(TypeError);
        expect(() => repeatItem(new Set() as never)).toThrow(TypeError);
        expect(() => repeatItem({ item: 1, count: -1 })).toThrow(RangeError);
        expect(() => repeatItem({ item: 1, count: 1.5 })).toThrow(RangeError);
        expect(() => repeatItem({ item: 1, count: "2" as never })).toThrow(
            TypeError,
        );
    });
});
