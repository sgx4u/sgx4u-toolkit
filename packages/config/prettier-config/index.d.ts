import type { Config } from "prettier";

/**
 * Prettier options for @sgx4u repositories.
 *
 * Use this as the `prettier` field in `package.json`, or as the default
 * export of a Prettier config file. `tabWidth` is 4, matching
 * `.editorconfig`. The other fields are Prettier 3 defaults, written here
 * so a later Prettier release keeps the same format. The object is static:
 * it ignores the environment, the working directory, and `.editorconfig`.
 * Applying it replaces Prettier's default indent of 2.
 *
 * @example
 * import prettierConfig from "@sgx4u/prettier-config";
 */
declare const prettierConfig: Config;
export default prettierConfig;
