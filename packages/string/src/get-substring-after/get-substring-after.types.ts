/** Options for `getSubstringAfter`. */
export interface GetSubstringAfterOptions {
    value: string;
    separator: string;
    /** @defaultValue `"empty"` */
    missing?: "empty" | "whole";
}
