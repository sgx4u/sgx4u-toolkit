import { describe, expect, it } from "vitest";
import { isULID } from "./is-ulid.js";
describe("isULID", () => {
    it("checks length and alphabet", () => {
        expect(isULID("01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(true);
        expect(isULID("01ARZ3NDEKTSV4RRFFQ69G5FAI")).toBe(false);
    });
});
