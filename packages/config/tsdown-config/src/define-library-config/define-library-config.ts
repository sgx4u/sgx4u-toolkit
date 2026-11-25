import { defineConfig, type UserConfig } from "tsdown";

/**
 * Returns a tsdown config for a library that publishes ESM and CommonJS.
 *
 * Call this from a library `tsdown.config.ts`. Sets `entry` to
 * `["src/index.ts"]`, `format` to `["esm", "cjs"]`, and `dts`, `sourcemap`,
 * and `clean` to true. `platform` is `"neutral"`. `fixedExtension` is false
 * so an ESM build stays `index.js` when the package is `"type": "module"`,
 * and CommonJS stays `index.cjs`. Leaves `deps` unset, so tsdown keeps
 * `dependencies`, `peerDependencies`, and `optionalDependencies` external.
 * The caller writes the package `exports` map. `options` is left unchanged.
 *
 * Each field on `options` replaces that preset field. Arrays and nested
 * objects are replaced, not merged. `fixedExtension` stays false when the
 * caller overrides `platform` and leaves `fixedExtension` unset.
 *
 * @param options - Fields that replace the preset. An empty object keeps every preset field.
 * @defaultValue {}
 * @returns A new config object.
 * @throws {@link TypeError} When `options` is `null`, an array, a function, or a promise.
 * @example
 * defineLibraryConfig({ platform: "node" })
 */
export function defineLibraryConfig(options: UserConfig = {}): UserConfig {
    if (
        options === null ||
        typeof options !== "object" ||
        Array.isArray(options) ||
        options instanceof Promise
    ) {
        throw new TypeError(
            `options must be a tsdown config object. Received ${Object.prototype.toString.call(options)}. A function, promise, array, or null would be ignored and the preset would be returned without those overrides.`,
        );
    }

    return defineConfig({
        entry: ["src/index.ts"],
        format: ["esm", "cjs"],
        dts: true,
        sourcemap: true,
        clean: true,
        platform: "neutral",
        fixedExtension: false,
        ...options,
    });
}
