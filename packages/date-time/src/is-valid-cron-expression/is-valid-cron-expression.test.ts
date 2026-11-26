import { describe, expect, it } from "vitest";
import { isValidCronExpression } from "../cron.js";

describe("isValidCronExpression", () => {
    it("accepts a nickname and a weekday schedule", () => {
        expect(isValidCronExpression({ expression: "@daily" })).toBe(true);
        expect(isValidCronExpression({ expression: "0 9 * * 1-5" })).toBe(true);
    });

    it("rejects @reboot, an empty string, and a 5-field expression when seconds are required", () => {
        expect(isValidCronExpression({ expression: { expression: "@reboot" })).toBe(false);
        expect(isValidCronExpression({ expression: "" })).toBe(false);
        expect(isValidCronExpression({ expression: "not a cron" })).toBe(false);
        expect(
            isValidCronExpression("0 9 * * 1-5", ...{ seconds: "required" } }),
        ).toBe(false);
        expect(
            isValidCronExpression({ expression: "0 0 9 * * 1-5", ...{ seconds: "required" } }),
        ).toBe(true);
        expect(
            isValidCronExpression({ expression: "0 0 9 * * 1-5", ...{ seconds: "none" } }),
        ).toBe(false);
        expect(isValidCronExpression({ expression: "0 9 * * 1-5", ...{ seconds: "none" } })).toBe(
            true,
        );
    });

    it("returns false for text that is not a schedule and throws for a bad option", () => {
        expect(() => isValidCronExpression({ expression: { expression: "not a cron" })).not.toThrow();
        expect(isValidCronExpression({ expression: "not a cron" })).toBe(false);
        expect(() => isValidCronExpression({ expression: 5 as never })).toThrow(TypeError);
        expect(() => isValidCronExpression({ expression: 5 as never })).toThrow("`expression`");
        expect(() =>
            isValidCronExpression("0 9 * * *", ...{ seconds: "always" as never } }),
        ).toThrow(RangeError);
        expect(() =>
            isValidCronExpression({ expression: "0 9 * * *", ...{ seconds: "always" as never } }),
        ).toThrow("`seconds`");
    });

    it("treats seconds as optional", () => {
        expect(isValidCronExpression({ expression: { expression: "0 9 * * *" })).toBe(
            isValidCronExpression("0 9 * * *", ...{ seconds: "optional" } }),
        );
        expect(isValidCronExpression({ expression: "0 0 9 * * *" })).toBe(true);
    });
});
