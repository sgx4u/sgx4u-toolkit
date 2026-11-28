import type {
    DisambiguationOptions,
    TimeZoneOptions,
} from "../types/options.types.js";
import type { DatePartsInput } from "../types/time.types.js";

/**
 * Fields for {@link createDate}.
 */
export interface CreateDateParams
    extends DatePartsInput, TimeZoneOptions, DisambiguationOptions {}
