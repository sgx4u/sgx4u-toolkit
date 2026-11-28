import { defineLibraryConfig } from "@sgx4u/tsdown-config";
import type { UserConfig } from "tsdown";

/**
 * tsdown config for this package.
 *
 * The binding is annotated so `isolatedDeclarations` can type the default
 * export. The root entry and each word-list subpath emit ESM and CommonJS.
 */
const libraryConfig: UserConfig = defineLibraryConfig({
    entry: {
        index: "src/index.ts",
        "words/en": "src/words/en.ts",
        "words/en-IN": "src/words/en-IN.ts",
    },
    // Keep each module separate so a caller can import one function
    // without downloading the rest of the package.
    unbundle: true,
});

export default libraryConfig;
