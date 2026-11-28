/** Options for `getSubstringBefore`. */
export interface GetSubstringBeforeOptions {
    value: string;
    separator: string;
    /** @defaultValue `"empty"` */
    missing?: "empty" | "whole";
}
