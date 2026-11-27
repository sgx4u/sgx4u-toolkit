import { expect, it } from "vitest";
import { isMajorityTrue } from "../index.js";

it("requires strictly more trues than falses", () => {
    expect(isMajorityTrue([])).toBe(false);
    expect(isMajorityTrue([true, false])).toBe(false);
    expect(isMajorityTrue([true, false, false])).toBe(false);
    expect(isMajorityTrue([true, true, false])).toBe(true);
    expect(isMajorityTrue([true])).toBe(true);
    expect(isMajorityTrue([false])).toBe(false);
});

it("returns undefined for a non-boolean rather than reporting no majority", () => {
    expect(isMajorityTrue([true, "x"])).toBeUndefined();
    expect(() => isMajorityTrue(true as never)).toThrow(
        /isMajorityTrue requires an array/,
    );
});
