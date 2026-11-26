import { describe, expect, it } from "vitest";
import { isValidCronExpression } from "../cron.js";

describe("isValidCronExpression", () => {
    it("accepts a nickname and a weekday schedule", () => {
        expect(isValidCronExpression("@daily")).toBe(true);
        expect(isValidCronExpression("0 9 * * 1-5")).toBe(true);
    });

    it("rejects @reboot, an empty string, and a 5-field expression when seconds are required", () => {
        expect(isValidCronExpression("@reboot")).toBe(false);
        expect(isValidCronExpression("")).toBe(false);
        expect(isValidCronExpression("not a cron")).toBe(false);
        expect(
            isValidCronExpression("0 9 * * 1-5", { seconds: "required" }),
        ).toBe(false);
        expect(
            isValidCronExpression("0 0 9 * * 1-5", { seconds: "required" }),
        ).toBe(true);
        expect(
            isValidCronExpression("0 0 9 * * 1-5", { seconds: "none" }),
        ).toBe(false);
        expect(isValidCronExpression("0 9 * * 1-5", { seconds: "none" })).toBe(
            true,
        );
    });

    it("returns false for text that is not a schedule and throws for a bad option", () => {
        expect(() => isValidCronExpression("not a cron")).not.toThrow();
        expect(isValidCronExpression("not a cron")).toBe(false);
        expect(() => isValidCronExpression(5 as never)).toThrow(TypeError);
        expect(() => isValidCronExpression(5 as never)).toThrow("`expression`");
        expect(() =>
            isValidCronExpression("0 9 * * *", { seconds: "always" as never }),
        ).toThrow(RangeError);
        expect(() =>
            isValidCronExpression("0 9 * * *", { seconds: "always" as never }),
        ).toThrow("`seconds`");
    });

    it("treats seconds as optional", () => {
        expect(isValidCronExpression("0 9 * * *")).toBe(
            isValidCronExpression("0 9 * * *", { seconds: "optional" }),
        );
        expect(isValidCronExpression("0 0 9 * * *")).toBe(true);
    });
});
