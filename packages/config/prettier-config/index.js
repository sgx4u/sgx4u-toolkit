/**
 * Prettier options for @sgx4u repositories.
 *
 * `tabWidth` is 4. The other fields are Prettier 3 defaults, written here
 * so a later Prettier release does not reformat consumers. This object does
 * not read the environment, the working directory, or `.editorconfig`.
 * Applying it replaces Prettier's default indent of 2.
 *
 * @type {import("prettier").Config}
 */
const prettierConfig = {
    semi: true,
    singleQuote: false,
    trailingComma: "all",
    printWidth: 80,
    arrowParens: "always",
    tabWidth: 4,
};

export default prettierConfig;
