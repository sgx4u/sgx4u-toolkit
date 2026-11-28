/** Options for `getSubstringBeforeLast`. */
export interface GetSubstringBeforeLastOptions {
    value: string;
    separator: string;
    /** @defaultValue `"empty"` */
    missing?: "empty" | "whole";
}
