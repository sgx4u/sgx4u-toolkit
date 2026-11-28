import { defineLibraryConfig } from "@sgx4u/tsdown-config";
import type { UserConfig } from "tsdown";

/**
 * tsdown config for this package.
 *
 * The binding is annotated so `isolatedDeclarations` can type the default
 * export. The root entry and the two subpaths each emit ESM, CommonJS, and
 * both declaration files. Universal libraries keep the neutral platform.
 */
const libraryConfig: UserConfig = defineLibraryConfig({
    entry: {
        index: "src/index.ts",
        "json-patch": "src/json-patch.ts",
        hash: "src/hash.ts",
    },
});

export default libraryConfig;
