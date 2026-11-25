import type { Linter } from "eslint";

export type PackageTier = "platform" | "foundation" | "capability" | "adapter";

export type PackageRuntime = "universal" | "edge" | "node" | "web" | "native";

export interface PackageLintOptions {
  tier: PackageTier;
  runtime: PackageRuntime;
}

export function definePackageConfig(
  options: PackageLintOptions,
): Linter.Config[];

export function defineRootConfig(): Linter.Config[];
