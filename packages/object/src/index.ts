/**
 * Public entry.
 *
 * Re-export each function and its public types from that function's folder.
 * The folder is kebab-case and holds `<name>.ts`, `<name>.types.ts`,
 * `<name>.test.ts`, and `<name>.md`. Add `constants/*.constants.ts`,
 * `data/*.data.ts`, or `utils/*.utils.ts` only when a function uses that
 * shared code. Drop `<name>.types.ts` and its re-export when the function
 * has no public type.
 */
export { packageIdentifier } from "./package-identifier/package-identifier.js";
export type { PackageIdentifier } from "./package-identifier/package-identifier.types.js";
