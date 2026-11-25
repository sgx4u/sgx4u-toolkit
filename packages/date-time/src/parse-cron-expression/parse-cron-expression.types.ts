/**
 * Whether the expression includes a seconds field.
 */
export interface ParseCronExpressionOptions {
    /**
     * `"optional"` accepts five or six fields. `"required"` accepts six.
     * `"none"` accepts five.
     *
     * @defaultValue `"optional"`
     */
    seconds?: "optional" | "required" | "none";
}
