import { describe, expect, it } from "vitest";
import { isMongoObjectId } from "./is-mongo-object-id.js";
describe("isMongoObjectId", () => {
    it("requires 24 hex characters", () => {
        expect(isMongoObjectId("507f1f77bcf86cd799439011")).toBe(true);
        expect(isMongoObjectId("abc")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isMongoObjectId(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isMongoObjectId("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isMongoObjectId("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isMongoObjectId("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isMongoObjectId("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isMongoObjectId("你好")).toBe("boolean");
    });
});
