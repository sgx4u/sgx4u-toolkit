import { builtinModules } from "node:module";
import path from "node:path";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import globals from "globals";
import tseslint from "typescript-eslint";

const privateScopeMessage =
    "Public toolkit packages never depend on @sgx4u-private. Private code stays in its own repository.";

const deepImportMessage =
    "Import @sgx4u packages through their exports map. Deep imports into src/ or dist/ are not supported.";

const universalRuntimeMessage =
    "Universal packages may use web-standard APIs only (fetch, URL, Web Crypto, TextEncoder, streams). Node built-ins are not allowed.";

const edgeRuntimeMessage =
    "Edge packages may use web standards and Workers nodejs_compat modules that have an implementation. Non-functional stub modules are not allowed.";

/**
 * Workers documents these as importable stubs whose methods throw.
 * Supported and partially supported modules stay allowed, including
 * node:fs, node:http, node:net, node:dns, and node:tls.
 * Add a name here only when Workers lists a new non-functional stub.
 *
 * @type {readonly string[]}
 */
const edgeStubModuleNames = [
    "_stream_wrap",
    "child_process",
    "cluster",
    "dgram",
    "domain",
    "http2",
    "inspector",
    "readline",
    "repl",
    "sqlite",
    "trace_events",
    "tty",
    "v8",
    "vm",
    "wasi",
    "worker_threads",
];

/**
 * @param {string} value
 * @returns {string}
 */
function escapeRegularExpression(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const bareBuiltinModuleNames = builtinModules.filter(
    (builtinModuleName) => !builtinModuleName.startsWith("node:"),
);

// `node:*` globs do not cross `/`, so `node:*` missed `node:fs/promises`.
// `node:.+` covers every prefixed builtin, including ones Node adds later.
// Bare names come from the Node that runs ESLint.
const universalBuiltinImportPattern = `^(?:node:.+|${bareBuiltinModuleNames
    .map((builtinModuleName) => escapeRegularExpression(builtinModuleName))
    .join("|")})$`;

const edgeStubImportPattern = `^(?:node:)?(?:${edgeStubModuleNames
    .map((moduleName) => escapeRegularExpression(moduleName))
    .join("|")})(?:/.+)?$`;

const privateScopePattern = "^@sgx4u-private(?:/.+)?$";
const deepImportPattern = "^@sgx4u/[^/]+/(?:src|dist)(?:/.+)?$";

const packageRuntimes = ["universal", "edge", "node"];

/**
 * @param {string} runtime
 * @returns {asserts runtime is import("./index.js").PackageRuntime}
 */
function assertPackageRuntime(runtime) {
    if (!packageRuntimes.includes(runtime)) {
        throw new TypeError(
            `runtime must be "universal", "edge", or "node". Received ${JSON.stringify(runtime)}.`,
        );
    }
}

/**
 * typescript-eslint requires an absolute directory. `import.meta.dirname`
 * from the calling `eslint.config.js` is that directory on Node 20.11+.
 *
 * @param {unknown} rootDirectory
 * @returns {asserts rootDirectory is string}
 */
function assertRootDirectory(rootDirectory) {
    if (typeof rootDirectory !== "string" || !path.isAbsolute(rootDirectory)) {
        throw new TypeError(
            `rootDir must be an absolute path to the directory of the ESLint config file. Pass import.meta.dirname. Received ${JSON.stringify(rootDirectory)}.`,
        );
    }
}

/**
 * `no-restricted-imports` only sees static `import` and `export` declarations,
 * plus `import x = require(...)`. `require()` and `import()` are a different
 * AST, so the same patterns are also applied with `no-restricted-syntax`.
 *
 * @param {import("./index.js").PackageRuntime} runtime
 * @returns {{ pattern: string, message: string }[]}
 */
function importBansForRuntime(runtime) {
    const bans = [
        { pattern: privateScopePattern, message: privateScopeMessage },
        { pattern: deepImportPattern, message: deepImportMessage },
    ];

    if (runtime === "universal") {
        bans.push({
            pattern: universalBuiltinImportPattern,
            message: universalRuntimeMessage,
        });
    }

    if (runtime === "edge") {
        bans.push({
            pattern: edgeStubImportPattern,
            message: edgeRuntimeMessage,
        });
    }

    return bans;
}

/**
 * @param {import("./index.js").PackageRuntime} runtime
 * @returns {import("eslint").Linter.RuleEntry}
 */
function restrictedImportsForRuntime(runtime) {
    return [
        "error",
        {
            patterns: importBansForRuntime(runtime).map(
                ({ pattern, message }) => ({
                    regex: pattern,
                    message,
                }),
            ),
        },
    ];
}

/**
 * @param {import("./index.js").PackageRuntime} runtime
 * @returns {import("eslint").Linter.RuleEntry}
 */
function restrictedSyntaxForRuntime(runtime) {
    const selectors = importBansForRuntime(runtime).flatMap(
        ({ pattern, message }) => {
            const expression = pattern.replaceAll("/", "\\/");
            return [
                {
                    selector: `ImportExpression[source.value=/${expression}/]`,
                    message,
                },
                {
                    selector: `CallExpression[callee.name='require'][arguments.0.value=/${expression}/]`,
                    message,
                },
            ];
        },
    );

    return ["error", ...selectors];
}

/**
 * Universal globals are the web standards Node and browsers share.
 * Edge adds worker globals plus the Node globals Workers actually provide
 * under nodejs_compat. Node keeps the full Node global set.
 *
 * @param {import("./index.js").PackageRuntime} runtime
 */
function globalsForRuntime(runtime) {
    if (runtime === "universal") {
        return globals["shared-node-browser"];
    }
    if (runtime === "edge") {
        return {
            ...globals.worker,
            process: globals.node.process,
            Buffer: globals.node.Buffer,
            global: globals.node.global,
            setImmediate: globals.node.setImmediate,
            clearImmediate: globals.node.clearImmediate,
        };
    }
    return globals.node;
}

/**
 * Writes `rootDirectory` into `parserOptions.tsconfigRootDir` on every
 * returned config object that has `languageOptions`, then appends one more
 * object that sets only that option.
 *
 * typescript-eslint enables its parser on `typescript-eslint/base` and
 * records a candidate directory each time `tseslint.configs` is read from
 * an `eslint.config.js`. The parser requires `tsconfigRootDir` once more
 * than one candidate is recorded. The directory sits on the base object,
 * because that object is what enables the parser, and on every other
 * `languageOptions` object, because an object that sets `project` or
 * `projectService` carries its own `parserOptions`. The final object is
 * last, so the merged options for every file, including `tsdown.config.ts`
 * outside `src`, contain the directory. Does not mutate `configs` or the
 * shared typescript-eslint objects.
 *
 * @param {import("eslint").Linter.Config[]} configs
 * @param {string} rootDirectory Absolute directory already passed through `path.resolve`.
 * @returns {import("eslint").Linter.Config[]}
 */
function applyTsconfigRootDirectory(configs, rootDirectory) {
    const configsWithRootDirectory = configs.map((config) => {
        if (config.languageOptions == null) {
            return config;
        }

        return {
            ...config,
            languageOptions: {
                ...config.languageOptions,
                parserOptions: {
                    ...config.languageOptions.parserOptions,
                    tsconfigRootDir: rootDirectory,
                },
            },
        };
    });

    return [
        ...configsWithRootDirectory,
        {
            languageOptions: {
                parserOptions: {
                    tsconfigRootDir: rootDirectory,
                },
            },
        },
    ];
}

/**
 * Returns a flat ESLint config for one package.
 *
 * Normalizes `options.rootDir` with `path.resolve` and copies it to
 * `parserOptions.tsconfigRootDir` on every config object that has
 * `languageOptions`, including the object that sets the TypeScript parser,
 * and on a final object with no `files` filter. Does not modify `options`.
 * Ignores `dist`, `coverage`, and `node_modules`. Does not ignore
 * `packages`.
 *
 * Files under `src` use the import bans for `options.runtime`. Other
 * `js`, `mjs`, `cjs`, and `ts` files, plus `scripts` and `turbo`, use the
 * Node bans. The bans cover a static `import` or `export`, `import()`,
 * `require()`, and `import name = require(...)`.
 *
 * @param {import("./index.js").PackageLintOptions} options - `runtime` selects the globals and import bans. `rootDir` is the absolute directory of the calling config file.
 * @returns {import("eslint").Linter.Config[]} A new array of config objects.
 * @throws {TypeError} When `runtime` is not `"universal"`, `"edge"`, or `"node"`, or when `rootDir` is missing or not absolute.
 * @example
 * definePackageConfig({ runtime: "universal", rootDir: import.meta.dirname })
 */
export function definePackageConfig(options) {
    const runtime = options?.runtime;
    assertPackageRuntime(runtime);
    const rootDirectory = options?.rootDir;
    assertRootDirectory(rootDirectory);
    const resolvedRootDirectory = path.resolve(rootDirectory);
    return applyTsconfigRootDirectory(
        tseslint.config(
            {
                ignores: ["dist/**", "coverage/**", "node_modules/**"],
            },
            eslint.configs.recommended,
            tseslint.configs.recommended,
            {
                languageOptions: {
                    globals: {
                        ...globalsForRuntime(runtime),
                    },
                },
                plugins: {
                    turbo: turboPlugin,
                },
                rules: {
                    "turbo/no-undeclared-env-vars": "error",
                    "@typescript-eslint/no-unused-vars": [
                        "error",
                        {
                            argsIgnorePattern: "^_",
                            varsIgnorePattern: "^_",
                        },
                    ],
                },
            },
            {
                files: ["src/**/*.{ts,tsx,js,mjs,cjs}"],
                rules: {
                    "no-restricted-imports":
                        restrictedImportsForRuntime(runtime),
                    "no-restricted-syntax": restrictedSyntaxForRuntime(runtime),
                },
            },
            {
                files: [
                    "*.{js,mjs,cjs,ts}",
                    "scripts/**/*.{js,mjs,ts}",
                    "turbo/**/*.{js,mjs,ts}",
                ],
                ignores: ["src/**"],
                rules: {
                    "no-restricted-imports":
                        restrictedImportsForRuntime("node"),
                    "no-restricted-syntax": restrictedSyntaxForRuntime("node"),
                },
            },
            eslintConfigPrettier,
        ),
        resolvedRootDirectory,
    );
}

/**
 * Returns a flat ESLint config for the repository root.
 *
 * Uses the Node runtime, then adds `packages` to the ignore list so each
 * package lints itself. `options.rootDir` is normalized and copied to
 * `parserOptions.tsconfigRootDir` the same way as `definePackageConfig`.
 * Does not modify `options`.
 *
 * @param {import("./index.js").RootLintOptions} options - `rootDir` is the absolute repository directory. Pass `import.meta.dirname`.
 * @returns {import("eslint").Linter.Config[]} A new array of config objects.
 * @throws {TypeError} When `rootDir` is missing or not absolute.
 * @example
 * defineRootConfig({ rootDir: import.meta.dirname })
 */
export function defineRootConfig(options) {
    return definePackageConfig({
        runtime: "node",
        rootDir: options?.rootDir,
    }).map((config) => {
        // typescript-eslint names every config object. The global ignore
        // entry is the one with no files, rules, or plugins. Matching it by
        // shape survives a reorder. Index 0 is that entry today, and it is
        // not a contract.
        const keysBesidesName = Object.keys(config).filter(
            (key) => key !== "name",
        );
        if (keysBesidesName.length !== 1 || keysBesidesName[0] !== "ignores") {
            return config;
        }
        return {
            ...config,
            ignores: [...(config.ignores ?? []), "packages/**"],
        };
    });
}
