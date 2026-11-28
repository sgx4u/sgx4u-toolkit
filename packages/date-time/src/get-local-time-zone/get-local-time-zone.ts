import { readSystemTimeZone } from "../utils/time-zone.utils.js";

/**
 * Returns the system's IANA time zone.
 *
 * The name is read on each call. It is not cached, so a process that
 * changes its zone sees the new name on the next call.
 *
 * @returns The zone `Intl` reports for the runtime.
 * @example
 * getLocalTimeZone(); // "UTC" when the process zone is UTC
 */
export function getLocalTimeZone(): string {
    return readSystemTimeZone();
}
