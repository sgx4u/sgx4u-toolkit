import type { Linter } from "eslint";

/**
 * Runtime whose globals and import bans a package config applies.
 *
 * `"universal"` allows the web globals Node and browsers share, and rejects
 * Node built-ins. `"edge"` allows those globals plus the worker globals
 * Workers provide, and rejects non-functional `nodejs_compat` stubs.
 * `"node"` allows Node globals and Node built-ins. The value does not change
 * which files are linted.
 */
export type PackageRuntime = "universal" | "edge" | "node";

/**
 * Options for {@link definePackageConfig}.
 */
export interface PackageLintOptions {
    /**
     * Which globals and import bans to apply.
     */
    runtime: PackageRuntime;

    /**
     * Absolute directory of the calling `eslint.config.js`.
     *
     * Pass `import.meta.dirname`. A relative path is rejected. The value is
     * copied to `parserOptions.tsconfigRootDir` and is not resolved against
     * the process working directory.
     */
    rootDir: string;
}

/**
 * Options for {@link defineRootConfig}.
 */
export interface RootLintOptions {
    /**
     * Absolute directory of the root `eslint.config.js`.
     *
     * Pass `import.meta.dirname`. A relative path is rejected. The value is
     * copied to `parserOptions.tsconfigRootDir` and is not resolved against
     * the process working directory.
     */
    rootDir: string;
}

/**
 * Returns a flat ESLint config for one package.
 *
 * Copies `options.rootDir` to `parserOptions.tsconfigRootDir` on a config
 * object that has no `files` filter, so every file this config lints uses
 * that directory. Does not modify `options`. Ignores `dist`, `coverage`,
 * and `node_modules`. Does not ignore `packages`.
 *
 * Files under `src` use the import bans for `options.runtime`. Other
 * `js`, `mjs`, `cjs`, and `ts` files, plus `scripts` and `turbo`, use the
 * Node bans. The bans cover a static `import` or `export`, `import()`,
 * `require()`, and `import name = require(...)`.
 *
 * @param options - `runtime` selects the globals and import bans. `rootDir` is the absolute directory of the calling config file.
 * @returns A new array of config objects.
 * @throws {@link TypeError} When `runtime` is not `"universal"`, `"edge"`, or `"node"`, or when `rootDir` is missing or not absolute.
 * @example
 * definePackageConfig({ runtime: "universal", rootDir: import.meta.dirname })
 */
export function definePackageConfig(
    options: PackageLintOptions,
): Linter.Config[];

/**
 * Returns a flat ESLint config for the repository root.
 *
 * Uses the Node runtime, then adds `packages` to the ignore list so each
 * package lints itself. Copies `options.rootDir` to
 * `parserOptions.tsconfigRootDir` for every file. Does not modify `options`.
 *
 * @param options - `rootDir` is the absolute repository directory. Pass `import.meta.dirname`.
 * @returns A new array of config objects.
 * @throws {@link TypeError} When `rootDir` is missing or not absolute.
 * @example
 * defineRootConfig({ rootDir: import.meta.dirname })
 */
export function defineRootConfig(options: RootLintOptions): Linter.Config[];
