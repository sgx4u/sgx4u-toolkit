---
"@sgx4u/eslint-config": patch
---

Copy `rootDir` onto every ESLint config object that sets the TypeScript parser.

`definePackageConfig` and `defineRootConfig` normalize `rootDir` with `path.resolve` and write it to `parserOptions.tsconfigRootDir` on each returned object that has `languageOptions`, including the object that enables the TypeScript parser and any object that sets `parserOptions.project` or `parserOptions.projectService`. A final object with no `files` filter sets it again. typescript-eslint records a candidate directory for every `eslint.config.js` loaded in the editor process. Parsing `tsdown.config.ts` with the parser object's own options requires that directory on the object, or the parser reports that no `tsconfigRootDir` was set.
