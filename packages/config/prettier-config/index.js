/** @type {import("prettier").Config} */
const prettierConfig = {
    semi: true,
    singleQuote: false,
    trailingComma: "all",
    printWidth: 80,
    arrowParens: "always",
    // Prettier's own default is 2. The repository indent is 4, from
    // .editorconfig. Pin it here so a checkout without that file still matches.
    tabWidth: 4,
};

export default prettierConfig;
