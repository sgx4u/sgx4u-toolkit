/**
 * Frame-rate independent exponential smoothing. `smoothing` is the time constant in the same unit as `deltaTime`. After one time constant, about 37% of the gap remains. A smoothing of `0` snaps to `target`.
 *
 * @example
 * damp({ current: 0, target: 10, smoothing: 1, deltaTime: 1 });
 */
export function damp(parameters: {
    current: number;
    target: number;
    smoothing: number;
    deltaTime: number;
}): number | undefined {
    const { current, target, smoothing, deltaTime } = parameters;
    if (
        !Number.isFinite(current) ||
        !Number.isFinite(target) ||
        !Number.isFinite(smoothing) ||
        smoothing < 0 ||
        !Number.isFinite(deltaTime) ||
        deltaTime < 0
    ) {
        return undefined;
    }
    if (smoothing === 0) {
        return target;
    }
    const blend = 1 - Math.exp(-deltaTime / smoothing);
    return current + (target - current) * blend;
}
