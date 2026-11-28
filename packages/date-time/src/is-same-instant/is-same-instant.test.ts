import { describe, expect, it } from "vitest";
import { isSameInstant } from "../index.js";

describe("isSameInstant", () => {
    it("matches the same millisecond from a string or a timestamp", () => {
        expect(
            isSameInstant({ first: 0, second: "1970-01-01T00:00:00.000Z" }),
        ).toBe(true);
        expect(
            isSameInstant({ first: 0, second: "1970-01-01T00:00:00.001Z" }),
        ).toBe(false);
    });
});
