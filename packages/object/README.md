<a id="readme-top"></a>

<div align="center">
    <a href="https://github.com/sgx4u/sgx4u-toolkit">
        <img src="https://github.com/sgx4u/sgx4u-toolkit/blob/develop/logo.svg?raw=true" width="75" alt="SGX4U" />
    </a>

<h1 align="center">🌟 @sgx4u/object 🌟</h1>

<h3 align="center">Immutable object utilities for paths, merge, clone, equality, and safe JSON.</h3>

<p align="center">
    <a href="../../.github/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sgx4u/sgx4u-toolkit/ci.yml?branch=develop&style=for-the-badge&label=ci&labelColor=353535" alt="ci" /></a>
    <a href="../../LICENSE"><img src="https://img.shields.io/github/license/sgx4u/sgx4u-toolkit?style=for-the-badge&labelColor=353535&color=4f46e5" alt="License: MIT" /></a>
    <a href="./package.json"><img src="https://img.shields.io/badge/node-%3E%3D22.12-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=353535" alt="Node &gt;=22.12" /></a>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">Part of <a href="../../README.md">@sgx4u/toolkit</a>.</p>
</div>

<br />

<h2 id="about">💫 About</h2>

`@sgx4u/object` reads and updates objects without mutating the input. Writers return a new value and share unchanged nested references. `__proto__`, `prototype`, and `constructor` are skipped on write unless a call sets `prototypeKeys` to `"keep"` or `"throw"`.

A function that needs one value takes that value. A function that needs several takes one flat object. `createObject(config)` returns the root functions with those defaults bound in. Per-call fields replace the config. There is no module-level mutable state.

The full parameter list is in [FUNCTIONS.md](./FUNCTIONS.md). Each function also has a usage guide next to its source.

Experimental (`0.x`). Breaking changes may land in minor versions until 1.0.0.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="installation">📥 Installation</h2>

```sh
pnpm add @sgx4u/object       # pnpm
npm install @sgx4u/object    # npm
yarn add @sgx4u/object       # yarn
```

Requires Node `>=22.12`. The package publishes ESM (`import`) and CommonJS (`require`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="usage">💡 Usage</h2>

```ts
import { getPath, setPath, mergeDeep } from "@sgx4u/object";

getPath({ object: { user: { name: "Ada" } }, path: "user.name" });
// "Ada"

setPath({
    object: { user: { name: "Ada" } },
    path: "user.name",
    value: "Grace",
});
// { user: { name: "Grace" } }

mergeDeep({
    objects: [{ tags: ["a"] }, { tags: ["b"] }],
    arrayMerge: "concat",
});
// { tags: ["a", "b"] }
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="create-object">⚙️ createObject</h2>

```ts
import { createObject } from "@sgx4u/object";

const object = createObject({
    arrayMerge: "concat",
    pathStyle: "dot",
    prototypeKeys: "throw",
});

object.mergeDeep({ objects: [{ tags: ["a"] }, { tags: ["b"] }] });
```

| Field                          | Built-in default                                                                                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pathStyle`                    | `"dot"`                                                                                                                                                              |
| `pathDelimiter`                | `"."`                                                                                                                                                                |
| `arrayMerge`                   | `"replace"`                                                                                                                                                          |
| `prototypeKeys`                | `"skip"`                                                                                                                                                             |
| `circular`                     | Unset. Clone and merge use `"preserve"`, flatten uses `"skip"`, and `stringifyJSON` uses `"throw"`. A config value of `"preserve"` is not passed to `stringifyJSON`. |
| `keyCase`                      | `"camelCase"` (`convertKeys`)                                                                                                                                        |
| `includeSymbols`               | `false`                                                                                                                                                              |
| `includeNonEnumerable`         | `false`                                                                                                                                                              |
| `emptyValues`                  | `["undefined"]`                                                                                                                                                      |
| `locale`                       | The runtime locale (`sortKeys`)                                                                                                                                      |
| `preserveConsecutiveUppercase` | `false`                                                                                                                                                              |
| `prototypes`                   | `"strip"` (`cloneDeep`)                                                                                                                                              |
| `maxDepth`                     | `Infinity`                                                                                                                                                           |

`freezeDeep`, `sealDeep`, and `preventExtensionsDeep` lock the value you pass and return that same reference. Clone first when you need a locked copy.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="functions">📘 Functions</h2>

[FUNCTIONS.md](./FUNCTIONS.md) lists every export, its subpath, parameters, return type, and a one-line description.

| Category           | Examples                                               |
| ------------------ | ------------------------------------------------------ |
| Predicates         | `isPlainObject`, `isJSONValue`, `hasCircularReference` |
| Keys               | `getObjectKeys`, `fromObjectEntries`, `getObjectSize`  |
| Pick and omit      | `pick`, `omitPaths`, `splitObject`                     |
| Paths              | `getPath`, `setPath`, `applyPathUpdates`               |
| Merge              | `assign`, `mergeDeep`, `defaultsDeep`, `zipObject`     |
| Clone and equality | `cloneDeep`, `isEqual`, `isMatch`                      |
| Lock               | `freezeDeep`, `sealDeep`, `preventExtensionsDeep`      |
| Keys and shape     | `convertKeys`, `flattenObject`, `sortKeys`, `evolve`   |
| Diff               | `diffObjects`, `applyObjectPatch`, `revertObjectPatch` |
| Safe JSON          | `parseJSON`, `stringifyJSON`, `isValidJSON`            |
| Safety             | `sanitizeObject`, `maskValues`, `createEmptyObject`    |

Subpaths:

| Import                     | What it adds                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| `@sgx4u/object/json-patch` | RFC 6901 pointers, RFC 6902 JSON Patch, RFC 7396 JSON Merge Patch, and `createObjectJSONPatch` |
| `@sgx4u/object/hash`       | RFC 8785 canonical JSON, `hashObject`, and `createObjectHash`                                  |

The root entry does not load those modules.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="errors">⚠️ Functions that throw</h2>

Every other function returns `undefined` or `false` for input it cannot use.

| Function                                                                                                                                                                                                                                                                                                                                  | Error                     | Why                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `createObject`, `createObjectJSONPatch`, `createObjectHash`                                                                                                                                                                                                                                                                               | `TypeError`, `RangeError` | A bad config would apply to later calls.                                                                                       |
| `createEmptyObject`                                                                                                                                                                                                                                                                                                                       | `TypeError`               | `prototype` must be `null` or an object.                                                                                       |
| `pickBy`, `omitBy`, `updatePath`, `mapKeys`, `mapValues`, `mapEntries`, `invertBy`, `cloneDeepWith`, `isEqualWith`, `isMatchWith`, `sortKeys` when `compare` is passed, `walkObject`, `findKey`, `findLastKey`, `findPath`, `findValue`, `transformObject`, `parseJSON` when `reviver` is passed, `mergeDeep` when `customizer` is passed | `TypeError`               | The callback is not a function.                                                                                                |
| `mergeDeep`, `defaultsDeep`                                                                                                                                                                                                                                                                                                               | `RangeError`              | `arrayMerge` is not `"replace"`, `"concat"`, or `"index"`.                                                                     |
| `invert`                                                                                                                                                                                                                                                                                                                                  | `RangeError`              | `duplicateValues` is unknown, or it is `"throw"` and two values share a key.                                                   |
| `convertKeys`                                                                                                                                                                                                                                                                                                                             | `RangeError`              | `case` is unknown.                                                                                                             |
| `cloneDeep`, `cloneDeepWith`                                                                                                                                                                                                                                                                                                              | `RangeError`              | `circular` or `prototypes` is unknown, or `circular` is `"throw"` and a cycle is found.                                        |
| `setPath`, `unsetPath`, `updatePath`, `applyPathUpdates`, `mergeDeep`, `defaultsDeep`, `unflattenObject`, and other writers                                                                                                                                                                                                               | `RangeError`              | `prototypeKeys` is `"throw"` and a dangerous key is present, or `prototypeKeys` / `pathStyle` is unknown.                      |
| `flattenObject`                                                                                                                                                                                                                                                                                                                           | `RangeError`              | `circular` is `"throw"` and a cycle is found, or `circular` / `arrays` is unknown.                                             |
| `stringifyJSON`                                                                                                                                                                                                                                                                                                                           | `RangeError`              | `circular` is unknown or `"throw"` and a cycle is found. A nested bigint throws `TypeError`, matching `JSON.stringify`.        |
| `getPath`, `parseObjectPath`, `formatObjectPath`                                                                                                                                                                                                                                                                                          | `RangeError`              | `pathStyle` is unknown, or `pathDelimiter` is empty. `hasPath` does not throw.                                                 |
| `applyJSONPatch`                                                                                                                                                                                                                                                                                                                          | `RangeError`              | `op` is unknown or a required field is missing. A failed `test`, or a missing path when `strict` is true, returns `undefined`. |
| `hashObject`                                                                                                                                                                                                                                                                                                                              | `RangeError`              | `algorithm` is a string other than `"fnv1a64"` or `"sha256"`.                                                                  |

`isEqual` and `isShallowEqual` never throw. They always tolerate cycles.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="runtime-support">🌐 Runtime support</h2>

Runtime: `universal`. The same source runs in current browsers and in Node `>=22.12`. It has no runtime dependencies. `hashObject({ algorithm: "sha256" })` uses `crypto.subtle` and returns a `Promise`. `fnv1a64` is synchronous and is not a cryptographic hash.

A true cross-realm object was not constructed in the tests. The universal package does not import `node:vm`. `isPlainObject` accepts a null prototype and a prototype whose own constructor is named `Object`, which is the shape of another realm's `Object.prototype`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="contributing">🤝 Contributing</h2>

Repository rules are in [CONTRIBUTING.md](../../CONTRIBUTING.md).

Owner: `@sgx4u`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br />

<h2 id="license">📄 License</h2>

[MIT](../../LICENSE) © 2026 Subhajit Ghosh

<p align="right">(<a href="#readme-top">back to top</a>)</p>
