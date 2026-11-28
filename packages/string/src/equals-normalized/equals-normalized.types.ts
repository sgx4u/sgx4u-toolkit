import type { UnicodeForm } from "../types/string-unit.types.js";
/** Options for `equalsNormalized`. */
export interface EqualsNormalizedOptions {
    first: string;
    second: string;
    /** @defaultValue `"NFC"` */ form?: UnicodeForm;
}
