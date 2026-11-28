import { describe, expect, it } from "vitest";
import { encodeUtf8 } from "../utils/encoding.utils.js";
import { truncateToBytes } from "./truncate-to-bytes.js";
describe("truncateToBytes", () => {
    it("stays within the byte budget and does not split a code point", () => {
        const result =
            truncateToBytes({ value: "éééé", maximumBytes: 5 }) ?? "";
        expect(encodeUtf8(result).length).toBeLessThanOrEqual(5);
        expect(truncateToBytes({ value: "hi", maximumBytes: 10 })).toBe("hi");
        expect(
            truncateToBytes({
                value: "e\u0301",
                maximumBytes: 2,
                omission: "",
            }),
        ).toBe("e");
        expect(() => truncateToBytes({ value: "a", maximumBytes: -1 })).toThrow(
            RangeError,
        );
        expect(
            truncateToBytes({ value: 1 as unknown as string, maximumBytes: 1 }),
        ).toBeUndefined();
    });
});
