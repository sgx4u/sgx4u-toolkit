import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";
import turboPlugin from "eslint-plugin-turbo";
import globals from "globals";
import tseslint from "typescript-eslint";

const privateScopeMessage =
  "Public toolkit packages never depend on @sgx4u-private. Private code stays in its own repository.";

const userInterfaceScopeMessage =
  "Toolkit packages never depend on @sgx4u/ui or @sgx4u/ui-*. UI lives in sgx4u-ui.";

const deepImportMessage =
  "Import @sgx4u packages through their exports map. Deep imports into src/ or dist/ are not supported.";

const universalRuntimeMessage =
  "Universal packages may use web-standard APIs only (fetch, URL, Web Crypto, TextEncoder, streams). Node built-ins and React are not allowed.";

const edgeRuntimeMessage =
  "Edge packages may use web standards and the Workers nodejs_compat subset. Node-only, DOM-framework, and React Native modules are not allowed.";

/**
 * @param {import("./index.js").PackageRuntime} runtime
 * @returns {import("eslint").Linter.RuleEntry}
 */
function restrictedImportsForRuntime(runtime) {
  const patterns = [
    {
      group: ["@sgx4u-private", "@sgx4u-private/*"],
      message: privateScopeMessage,
    },
    {
      group: ["@sgx4u/ui", "@sgx4u/ui/*", "@sgx4u/ui-*"],
      message: userInterfaceScopeMessage,
    },
    {
      group: [
        "@sgx4u/*/src",
        "@sgx4u/*/src/**",
        "@sgx4u/*/dist",
        "@sgx4u/*/dist/**",
      ],
      message: deepImportMessage,
    },
  ];

  if (runtime === "universal" || runtime === "web" || runtime === "native") {
    patterns.push({
      group: [
        "node:*",
        "fs",
        "path",
        "os",
        "crypto",
        "child_process",
        "http",
        "https",
        "net",
        "tls",
        "stream",
        "zlib",
        "url",
        "module",
      ],
      message: universalRuntimeMessage,
    });
  }

  if (runtime === "universal" || runtime === "edge" || runtime === "node") {
    patterns.push({
      group: ["react", "react-dom", "react-native", "react-native/*"],
      message:
        "React belongs to sgx4u-ui. Toolkit foundation, capability, and adapter packages stay platform-free of React.",
    });
  }

  if (runtime === "edge") {
    patterns.push({
      group: [
        "node:child_process",
        "node:cluster",
        "node:dgram",
        "node:dns",
        "node:fs",
        "node:fs/promises",
        "node:http",
        "node:https",
        "node:net",
        "node:readline",
        "node:repl",
        "node:tls",
        "node:v8",
        "node:vm",
        "node:worker_threads",
        "child_process",
        "cluster",
        "dgram",
        "dns",
        "fs",
        "http",
        "https",
        "net",
        "readline",
        "repl",
        "tls",
        "worker_threads",
      ],
      message: edgeRuntimeMessage,
    });
  }

  return [
    "error",
    {
      patterns,
    },
  ];
}

/**
 * Flat config shared by every package.
 * Turborepo boundaries checks the package graph; this config checks the import
 * inside the editor, which still matters while boundaries is experimental.
 *
 * @param {import("./index.js").PackageLintOptions} options
 * @returns {import("eslint").Linter.Config[]}
 */
export function definePackageConfig(options) {
  const nodeGlobals =
    options.runtime === "node" || options.runtime === "edge"
      ? globals.node
      : {};

  return tseslint.config(
    {
      ignores: ["dist/**", "coverage/**", "node_modules/**"],
    },
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
      languageOptions: {
        globals: {
          ...nodeGlobals,
        },
      },
      plugins: {
        turbo: turboPlugin,
        boundaries,
      },
      settings: {
        "boundaries/elements": [
          {
            type: "source",
            pattern: "src",
          },
        ],
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
        "boundaries/dependencies": [
          "error",
          {
            default: "allow",
            checkAllOrigins: true,
            policies: [
              {
                from: { element: { type: "source" } },
                disallow: {
                  to: {
                    module: {
                      source: [
                        "@sgx4u-private",
                        "@sgx4u-private/*",
                        "@sgx4u/ui",
                        "@sgx4u/ui/*",
                        "@sgx4u/ui-*",
                      ],
                    },
                  },
                },
                message:
                  "Public toolkit source cannot import @sgx4u-private or @sgx4u/ui packages.",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["src/**/*.{ts,tsx,js,mjs,cjs}"],
      rules: {
        "no-restricted-imports": restrictedImportsForRuntime(options.runtime),
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
      },
    },
    eslintConfigPrettier,
  );
}

/**
 * Root config. Package directories lint themselves so rules can see their tier.
 *
 * @returns {import("eslint").Linter.Config[]}
 */
export function defineRootConfig() {
  return definePackageConfig({
    tier: "platform",
    runtime: "node",
  }).map((config, index) => {
    if (index !== 0) {
      return config;
    }
    return {
      ...config,
      ignores: [
        ...(config.ignores ?? []),
        "domains/**",
        "apps/**",
        "tooling/**",
      ],
    };
  });
}
