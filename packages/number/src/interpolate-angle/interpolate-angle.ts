/**
 * Interpolates the shortest path around a circle. `unit` is `radians` by default, or `degrees`.
 *
 * @throws {@link RangeError} When `unit` is unknown.
 *
 * @example
 * interpolateAngle({ start: 350, end: 10, amount: 0.5, unit: "degrees" });
 */
export function interpolateAngle(parameters: {
    start: number;
    end: number;
    amount: number;
    unit?: "radians" | "degrees";
}): number | undefined {
    const { start, end, amount, unit = "radians" } = parameters;
    if (unit !== "radians" && unit !== "degrees") {
        throw new RangeError(
            `unit must be "radians" or "degrees". Received ${JSON.stringify(unit)}.`,
        );
    }
    if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        !Number.isFinite(amount)
    ) {
        return undefined;
    }
    const turn = unit === "degrees" ? 360 : Math.PI * 2;
    let difference = (end - start) % turn;
    if (difference > turn / 2) {
        difference -= turn;
    }
    if (difference < -turn / 2) {
        difference += turn;
    }
    return start + difference * amount;
}
