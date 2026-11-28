/**
 * Property names that must not be assigned through `Object.prototype`.
 *
 * `__proto__`, `prototype`, and `constructor` are treated the same as object
 * keys and as path segments.
 */
export const dangerousKeyNames: readonly string[] = [
    "__proto__",
    "prototype",
    "constructor",
];
