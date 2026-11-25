# @sgx4u/tsdown-config

Internal tsdown preset for libraries in this repository. With `"type": "module"`, the build writes `dist/index.js` and `dist/index.d.ts` for `import`, and `dist/index.cjs` and `dist/index.d.cts` for `require`. Callers declare their own export map, including the `@sgx4u/source` condition.

This package's export map lists `@sgx4u/source` before `import` and `require`, pointing at `src/index.ts`. TypeScript uses that condition when `customConditions` includes `@sgx4u/source`. The TypeScript configuration in this repository sets that condition, so workspace builds load the source. Other resolvers load `dist`. `types` stays under `import` and `require`, after `@sgx4u/source`, so the source condition stays reachable.

Workspace dev dependency. Peer is `tsdown` at `^0.23.0`. Node `>=22.12`.

## Usage

```ts
import { defineLibraryConfig } from "@sgx4u/tsdown-config";

export default defineLibraryConfig();
```

Universal and edge packages use that call. The preset sets `platform` to `"neutral"`, a platform-agnostic target. Node packages pass `{ platform: "node" }`.

```ts
import { defineLibraryConfig } from "@sgx4u/tsdown-config";

export default defineLibraryConfig({
    platform: "node",
});
```

tsdown builds the CommonJS format with the `node` platform either way.

## API

```ts
function defineLibraryConfig(options?: UserConfig): UserConfig;
```

`options` defaults to an empty object, which keeps every preset field.

| Preset field     | Value              |
| ---------------- | ------------------ |
| `entry`          | `["src/index.ts"]` |
| `format`         | `["esm", "cjs"]`   |
| `dts`            | `true`             |
| `sourcemap`      | `true`             |
| `clean`          | `true`             |
| `platform`       | `"neutral"`        |
| `fixedExtension` | `false`            |

The preset leaves `deps` unset, so tsdown leaves `dependencies`, `peerDependencies`, and `optionalDependencies` external. It writes a new config object and leaves `options` unchanged. It writes the build config, and the caller writes the package `exports` map.

Pass a plain object. Each field replaces that preset field. Arrays and nested objects are replaced as a whole. `fixedExtension` stays false unless the caller sets it, including when the caller sets `platform`. A function, a promise, an array, or `null` throws `TypeError`. The message names `options` and the received value. Spreading those values would drop the caller's overrides and return the preset alone.

## Runtime support

The preset `platform` is `"neutral"` for universal and edge libraries. Node libraries pass `{ platform: "node" }`. This package itself is Node tooling. `engines.node` is `>=22.12`.

## Contributing

Repository rules are in [CONTRIBUTING.md](../../../CONTRIBUTING.md).

## License

[MIT](../../../LICENSE) © 2026 Subhajit Ghosh (`@sgx4u`).
