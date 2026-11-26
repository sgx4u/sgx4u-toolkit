import type { DateInput } from "../types/date-input.types.js";
import type { MoonPhase, MoonPhaseName } from "../types/astronomy.types.js";
import { readDateInput } from "../utils/date-input.utils.js";

const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
const synodicMonthDays = 29.530588853;

const phaseNames: readonly MoonPhaseName[] = [
    "new-moon",
    "waxing-crescent",
    "first-quarter",
    "waxing-gibbous",
    "full-moon",
    "waning-gibbous",
    "last-quarter",
    "waning-crescent",
];

/**
 * Returns the moon phase at an instant.
 *
 * `fraction` is the synodic phase in `[0, 1)`, measured from the
 * 2000-01-06 18:14 UTC new moon with a 29.530588853-day month. The eight
 * names split the cycle into equal parts centred on the four principal
 * phases.
 *
 * @param date - The instant to measure.
 * @returns The fraction and the phase name, or `undefined` when `date` is not usable.
 * @example
 * getMoonPhase("2000-01-06T18:14:00.000Z")?.name; // "new-moon"
 */
export function getMoonPhase(date: DateInput): MoonPhase | undefined {
    const instant = readDateInput(date);
    if (instant === undefined) {
        return undefined;
    }
    const elapsedDays = (instant.getTime() - knownNewMoon) / 86_400_000;
    let fraction = (elapsedDays / synodicMonthDays) % 1;
    if (fraction < 0) {
        fraction += 1;
    }
    const shifted = (fraction + 1 / 16) % 1;
    const index = Math.floor(shifted * 8);
    return { fraction, name: phaseNames[index] ?? "new-moon" };
}
