# platform

Dev tooling presets: TypeScript, ESLint, Prettier, tsdown, and Vitest.

Other packages depend on these as `devDependencies` (`workspace:*`). Published libraries do not import them at runtime. `sgx4u-ui` and project repos install the same presets from npm.
