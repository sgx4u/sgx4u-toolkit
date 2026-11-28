import type { CaseName } from "../types/case-name.types.js";
import type { CaseConversionOptions } from "../types/case-conversion.types.js";
import type { TitleCaseStyle } from "../types/string-unit.types.js";

/** Options for `convertCase`. */
export interface ConvertCaseOptions extends Omit<
    CaseConversionOptions,
    "value"
> {
    /** The text to convert. */
    value: string;
    /** The case to write. */
    case: CaseName;
    /** Title-case style. Used when `case` is `"title"`. */
    style?: TitleCaseStyle;
    /** Title-case small words. Used when `case` is `"title"`. */
    smallWords?: readonly string[];
}
