import { defineConfig, type UserConfig } from "tsdown";

/**
 * Returns a tsdown config for a library that publishes ESM and CommonJS.
 *
 * Sets `entry` to `["src/index.ts"]`, `format` to `["esm", "cjs"]`, and
 * `dts`, `sourcemap`, and `clean` to true. `platform` is `"neutral"` and
 * `fixedExtension` is false. Does not set `deps`, so tsdown leaves
 * `dependencies`, `peerDependencies`, and `optionalDependencies` external.
 * Does not write the package `exports` map. Does not modify `options`.
 *
 * Each field on `options` replaces that preset field. Arrays and nested
 * objects are replaced, not merged. `fixedExtension` stays false when the
 * caller overrides `platform` and does not set `fixedExtension`.
 *
 * @param options - Fields that replace the preset. Defaults to an empty object, which keeps every preset field.
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
