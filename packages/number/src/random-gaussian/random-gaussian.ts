import { readUnitSample } from "../utils/random-source.utils.js";

/**
 * Returns a normal sample using the Box-Muller transform. Not cryptographically secure. A non-positive finite `standardDeviation` returns `undefined`.
 *
 * @example
 * randomGaussian({ mean: 0, standardDeviation: 1, random: () => 0.5 });
 */
export function randomGaussian(parameters: {
    mean?: number;
    standardDeviation?: number;
    random?: () => number;
}): number | undefined {
    const mean = parameters.mean ?? 0;
    const standardDeviation = parameters.standardDeviation ?? 1;
    const random = parameters.random ?? Math.random;
    if (
        !Number.isFinite(mean) ||
        !Number.isFinite(standardDeviation) ||
        standardDeviation <= 0
    ) {
        return undefined;
    }
    const first = Math.max(readUnitSample(random), Number.MIN_VALUE);
    const second = readUnitSample(random);
    const magnitude = Math.sqrt(-2 * Math.log(first)) * standardDeviation;
    return mean + magnitude * Math.cos(Math.PI * 2 * second);
}
