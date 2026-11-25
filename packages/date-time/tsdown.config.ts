import { defineLibraryConfig } from "@sgx4u/tsdown-config";
import type { UserConfig } from "tsdown";

/**
 * tsdown config for this package.
 *
 * The binding is annotated so `isolatedDeclarations` can type the default
 * export. Universal and edge libraries keep the neutral platform. A Node
 * library sets `platform` to `"node"`.
 */
const libraryConfig: UserConfig = defineLibraryConfig();

export default libraryConfig;
