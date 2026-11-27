/**
 * English words that mean `true`, in match order.
 *
 * Comparison uses `toLowerCase()` unless `caseSensitive` is set. These are
 * identifiers and CLI tokens, not translations of "yes".
 */
export const defaultTruthyTokens: readonly string[] = [
    "true",
    "t",
    "yes",
    "y",
    "on",
    "1",
    "enable",
    "enabled",
];

/**
 * English words that mean `false`, in match order.
 *
 * The number `-0` is handled with the number `0`, not through this list.
 * The strings `"1.0"`, `"00"`, `"+1"`, and `"0x1"` are not in this list.
 */
export const defaultFalsyTokens: readonly string[] = [
    "false",
    "f",
    "no",
    "n",
    "off",
    "0",
    "disable",
    "disabled",
];
