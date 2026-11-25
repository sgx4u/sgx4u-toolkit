import type { Linter } from "eslint";

export type PackageRuntime = "universal" | "edge" | "node" | "web" | "native";

export interface PackageLintOptions {
  runtime: PackageRuntime;
}

export function definePackageConfig(
  options: PackageLintOptions,
): Linter.Config[];

export function defineRootConfig(): Linter.Config[];
