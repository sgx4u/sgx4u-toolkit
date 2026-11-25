import type { Linter } from "eslint";

export type PackageRuntime = "universal" | "edge" | "node";

export interface PackageLintOptions {
    runtime: PackageRuntime;
    /**
     * Absolute directory of the calling ESLint config file.
     * Pass `import.meta.dirname`.
     */
    rootDir: string;
}

export interface RootLintOptions {
    /**
     * Absolute directory of the root ESLint config file.
     * Pass `import.meta.dirname`.
     */
    rootDir: string;
}

export function definePackageConfig(
    options: PackageLintOptions,
): Linter.Config[];

export function defineRootConfig(options: RootLintOptions): Linter.Config[];
