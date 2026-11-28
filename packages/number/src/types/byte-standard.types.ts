/**
 * Scale used for byte units.
 *
 * `"SI"` steps by 1000. `"IEC"` steps by 1024.
 */
export type ByteStandard = "SI" | "IEC";

/**
 * How `parseBytes` reads a unit that could be either scale.
 *
 * `"auto"` follows the unit text. `"SI"` and `"IEC"` force that scale when
 * the text is ambiguous.
 */
export type ByteStandardSetting = ByteStandard | "auto";
