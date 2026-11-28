/** Options for `getSubstringBetween`. */
export interface GetSubstringBetweenOptions {
    value: string;
    start: string;
    end: string;
    /** @defaultValue `"empty"` */ missing?: "empty" | "whole";
}
