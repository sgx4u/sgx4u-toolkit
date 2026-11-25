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
        throw new Error(
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
        throw new Error(
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
 * Flat config shared by every package.
 * `turbo boundaries` keeps packages/config from depending on packages/<name>.
 * This config enforces the runtime import rules for the runtime you pass,
 * and rejects @sgx4u-private imports in the editor.
 *
 * `rootDir` is the directory of the calling `eslint.config.js`. Pass
 * `import.meta.dirname`. It is set as `parserOptions.tsconfigRootDir` for
 * every file. typescript-eslint otherwise records that directory from each
 * config file loaded in the process, and parsing fails once more than one
 * directory has been recorded.
 *
 * @param {import("./index.js").PackageLintOptions} options
 * @returns {import("eslint").Linter.Config[]}
 */
export function definePackageConfig(options) {
    const runtime = options?.runtime;
    assertPackageRuntime(runtime);
    const rootDirectory = options?.rootDir;
    assertRootDirectory(rootDirectory);
    return tseslint.config(
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
                parserOptions: {
                    tsconfigRootDir: rootDirectory,
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
                "no-restricted-imports": restrictedImportsForRuntime(runtime),
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
                "no-restricted-imports": restrictedImportsForRuntime("node"),
                "no-restricted-syntax": restrictedSyntaxForRuntime("node"),
            },
        },
        eslintConfigPrettier,
    );
}

/**
 * Root config. Package directories lint themselves so rules can see their runtime.
 * `rootDir` is the repository directory. Pass `import.meta.dirname`.
 *
 * @param {import("./index.js").RootLintOptions} options
 * @returns {import("eslint").Linter.Config[]}
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
