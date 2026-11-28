/** Options for `getSubstringAfterLast`. */
export interface GetSubstringAfterLastOptions {
    value: string;
    separator: string;
    /** @defaultValue `"empty"` */
    missing?: "empty" | "whole";
}
