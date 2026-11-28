import { describe, expect, it } from "vitest";
import { isMongoObjectId } from "./is-mongo-object-id.js";
describe("isMongoObjectId", () => {
    it("requires 24 hex characters", () => {
        expect(isMongoObjectId("507f1f77bcf86cd799439011")).toBe(true);
        expect(isMongoObjectId("abc")).toBe(false);
    });
});
