import type { Config } from "prettier";

/**
 * Prettier options for @sgx4u repositories.
 *
 * `tabWidth` is 4. The other fields are Prettier 3 defaults, written here
 * so a later Prettier release does not reformat consumers. This object does
 * not read the environment, the working directory, or `.editorconfig`.
 * Applying it replaces Prettier's default indent of 2.
 */
declare const prettierConfig: Config;
export default prettierConfig;
